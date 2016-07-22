const weekdayLabels = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

const monthLabels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const today = new Date();
const todayDate = today.getDate();
const calContainer = document.getElementById('cal-container');
const modalsContainer = document.getElementById('modals-container');

class Calendar {
    constructor(month, year) {
        this.month = (isNaN(month) || month == null) ? today.getMonth() : month;
        this.year  = (isNaN(year) || year == null) ? today.getFullYear() : year;
    }

    generateHTML(node) {
        const firstDay = new Date(this.year, this.month, 1);
        const startingDay = firstDay.getDay();
        const monthLength = daysInMonth[this.month];

        const schedule = new Schedule(monthLength, startingDay);
        const container = document.getElementById(node);
        const cal = document.createElement('table');
            cal.className = 'calendar-table';
        const headerRow = document.createElement('tr');
        const calHeader = document.createElement('th');
            calHeader.colSpan = '7';
        const monthName = monthLabels[this.month];
            calHeader.innerHTML = monthName + '&nbsp;' + this.year;
        const weekdayRow = document.createElement('tr');
            weekdayRow.className = 'calendar-header';

        weekdayLabels.map(day => {
            const weekdayCol = document.createElement('td');
                weekdayCol.className = 'calendar-header-day';
                weekdayCol.innerHTML = day;
            weekdayRow.appendChild(weekdayCol);
        });

        headerRow.appendChild(calHeader);

        cal.appendChild(headerRow);
        cal.appendChild(weekdayRow);
        schedule.generateHTML(cal);

        container.appendChild(cal);
    }
}

class Schedule {
    constructor(monthLength, startingDay) {
        this.monthLength = monthLength;
        this.startingDay = startingDay;
    }

    generateHTML(node) {
        let dayCount = 1;

        for (var i = 0; i < 6; i++) {
            const weekRow = document.createElement('tr');

            for (var j = 0; j <= 6; j++) {
                const day = document.createElement('td');
                if (dayCount <= this.monthLength && (i > 0 || j >= this.startingDay)) {
                    day.className = 'calendar-day has-day'
                        + (dayCount === todayDate ? ' gray' : '' )
                        + (dayCount >= todayDate ? ' pointer hover' : '');
                    day.id = 'day-' + dayCount;

                    if (dayCount >= todayDate) {
                        const dayStuff = new DayStuff(dayCount);
                        dayStuff.generateHTML(day);
                    } else {
                        day.innerHTML = dayCount;
                    }

                    weekRow.appendChild(day);

                    dayCount++;
                } else {
                    day.className = 'calendar-day';
                    weekRow.appendChild(day);
                }
            }

            node.appendChild(weekRow);

            if (dayCount > this.monthLength) {
                break;
            }
        }
    }
}

class DayStuff {
    constructor(day) {
        this.day = day;
        this.apptList = [];
    }

    generateHTML(node) {
        const day = this.day;
        const dayContainer = document.createElement('div');
            dayContainer.innerHTML = this.day;

        const apptContainer = document.createElement('div');
            apptContainer.id = 'dayStuff' + this.day;
            apptContainer.className = 'appt-container';
            apptContainer.innerHTML = 'No Appointments';

        const conflictContainer = document.createElement('div');
            conflictContainer.id = 'conflict' + this.day;
            conflictContainer.className = 'conflict-container';
            conflictContainer.innerHTML = '';

        const apptModal = new DayModal(this.day, this.apptList);

        node.onclick = function() {
            const modalID = 'dayModal' + day;
            const dayModal = document.getElementById(modalID);

            calContainer.className = 'blur';
            modalsContainer.className = 'modals-container';
            dayModal.className = 'day-modal';
        };

        dayContainer.appendChild(apptContainer);
        dayContainer.appendChild(conflictContainer);

        apptModal.generateHTML(modalsContainer);

        node.appendChild(dayContainer);
    }
}

class DayModal {
    constructor(day, list) {
        this.day = day;
        this.apptList = list;
    }

    generateHTML(node) {
        const dayModal = document.createElement('div');
            dayModal.className = 'day-modal display-none';
            dayModal.id = 'dayModal' + this.day;

        const exitDiv = document.createElement('div');
            exitDiv.className = 'exit-div pointer';
            exitDiv.innerHTML = 'Close';
            exitDiv.onclick = function() {
                calContainer.className = '';
                modalsContainer.className = 'modals-container display-none';
                dayModal.className = 'day-modal display-none';
            }

        const dayTitle = document.createElement('div');
            dayTitle.className = 'day-title';
            dayTitle.innerHTML = 'Appointments';

        const apptList = new AppointmentList(this.apptList, this.day);

        dayModal.appendChild(exitDiv);
        dayModal.appendChild(dayTitle);
        apptList.generateHTML(dayModal);

        node.appendChild(dayModal);
    }
}

class AppointmentList {
    constructor(list, day) {
        this.apptList = list;
        this.day = day;
    }

    createAppointment(appt, i, listDiv) {
        const appointment = new Appointment(appt.name, appt.start, appt.end, this.apptList, this.day, i);
        appointment.generateHTML(listDiv);
    }

    generateHTML(node) {
        const scope = this;
        const listDiv = document.createElement('div');
        const apptForm = new Appointment(null, null, null, this.apptList, this.day);
        const apptListLength = this.apptList.length;

        for (var i = 0; i < apptListLength; i++) {
            const appt = this.apptList[i];
            this.createAppointment(appt, i, listDiv);
        }

        apptForm.generateHTML(listDiv);
        node.appendChild(listDiv);
    }
}

class Appointment {
    constructor(name, start, end, list, day, index) {
        this.name = name;
        this.start = start;
        this.end = end;
        this.list = list;
        this.day = day;
        this.index = index;
    }

    handleApptSubmit(form, button) {
        const title = form.childNodes[1].value;
        const startTime = Number(form.childNodes[3].value);
        const endTime = Number(form.childNodes[5].value);

        if (startTime >= endTime || title === '') {
            alert("Invalid Entry");
        } else {
            if (this.index > -1) {
                this.list.splice(this.index, 1);
            }

            if (button !== 'delete') {
                this.list.push({
                    name: title,
                    start: startTime,
                    end: endTime
                });
            }

            this.updateList();
        }
    }

    keysrt(key) {
        return function(a,b){
            return ~~(a[key] > b[key]);
        }
    }

    checkForConflicts() {
        const conflictID = 'conflict' + this.day;
        const conflictDiv = document.getElementById(conflictID);
        let conflicts = 0;
        for (var i = 1; i < this.list.length; i++) {
            if ( (this.list[i-1]["start"] < this.list[i]["end"]) && (this.list[i]["start"] < this.list[i-1]["end"]) ) {
                this.issueWarning(i);
                conflicts++;
            }
        }
        if (conflicts) {
            conflictDiv.innerHTML = 'CONFLICTS';
        } else {
            conflictDiv.innerHTML = '';
        }
    }

    issueWarning(i) {
        const modalID = 'dayModal' + this.day;
        const dayModal = document.getElementById(modalID);
        dayModal.childNodes[2].childNodes[i-1].className = 'appt-form danger';
        dayModal.childNodes[2].childNodes[i].className = 'appt-form danger';
    }

    updateList() {
        const dayStuffID = 'dayStuff' + this.day;
        const modalID = 'dayModal' + this.day;
        const dayModal = document.getElementById(modalID);
        const dayStuff = document.getElementById(dayStuffID);
        const newList = new AppointmentList(this.list, this.day);
        const listLength = this.list.length;

        dayStuff.innerHTML = (listLength === 0 ? "No" : listLength)
            + (listLength === 1 ? ' Appointment' : ' Appointments');
        dayModal.childNodes[2].remove();

        this.list.sort(this.keysrt('start'));

        newList.generateHTML(dayModal);
        this.checkForConflicts();
    }

    createTimeOption(node, i) {
        if (i === 0) {
            node.innerHTML = '12 AM';
        } else if (i < 12) {
            node.innerHTML = i + ' AM';
        } else if (i === 12) {
            node.innerHTML = '12 PM';
        } else if (i < 24) {
            node.innerHTML = (i - 12) + ' PM';
        } else {
            node.innerHTML = '11:59 PM';
        }
    }

    generateHTML(node) {
        const scope = this;
        const appt = document.createElement('form');
            appt.className = 'appt-form';
            appt.action = '#';

        const apptNameHeading = document.createElement('div');
            apptNameHeading.className = 'ib ml10';
            apptNameHeading.innerHTML = 'Title: ';

        const nameInput = document.createElement('input');
            nameInput.className = 'ib';
            nameInput.type = 'text';
            nameInput.name = 'appt-name';
            nameInput.value = this.name || '';

        const startTimeHeading = document.createElement('div');
            startTimeHeading.className = 'ib ml10';
            startTimeHeading.innerHTML = 'From: ';

        const startTimeSelect = document.createElement('select');
            startTimeSelect.className = 'ib';
            startTimeSelect.value = this.start || '';
        for (var i = 0; i <= 24; i++) {
            const startTimeOption = document.createElement('option');
                startTimeOption.value = i;

            if (this.start === i) {
                startTimeOption.selected = true;
            }

            this.createTimeOption(startTimeOption, i);

            startTimeSelect.appendChild(startTimeOption);
        }

        const endTimeHeading = document.createElement('div');
            endTimeHeading.className = 'ib ml10';
            endTimeHeading.innerHTML = 'To: ';

        const endTimeSelect = document.createElement('select');
            endTimeSelect.className = 'ib';
            endTimeSelect.value = this.end || '';
        for (var j = 0; j <= 24; j++) {
            const endTimeOption = document.createElement('option');
                endTimeOption.value = j;

            if (this.end === j) {
                endTimeOption.selected = true;
            }

            this.createTimeOption(endTimeOption, j);

            endTimeSelect.appendChild(endTimeOption);
        }

        appt.appendChild(apptNameHeading);
        appt.appendChild(nameInput);
        appt.appendChild(startTimeHeading);
        appt.appendChild(startTimeSelect);
        appt.appendChild(endTimeHeading);
        appt.appendChild(endTimeSelect);

        if (!this.name) {
            const submitButton = document.createElement('input');
                submitButton.className = 'ib ml10';
                submitButton.type = 'button';
                submitButton.value = 'Save';
                submitButton.name = 'submit';
                submitButton.onclick = function(){scope.handleApptSubmit(this.form)};
            appt.appendChild(submitButton);
        } else {
            const updateButton = document.createElement('input');
                updateButton.className = 'ib ml10';
                updateButton.type = 'button';
                updateButton.value = 'Update';
                updateButton.name = 'update';
                updateButton.onclick = function(){scope.handleApptSubmit(this.form)};
            appt.appendChild(updateButton);

            const deleteButton = document.createElement('input');
                deleteButton.className = 'ib ml10';
                deleteButton.type = 'button';
                deleteButton.value = 'Delete';
                deleteButton.name = 'delete';
                deleteButton.onclick = function(){scope.handleApptSubmit(this.form, 'delete')};
            appt.appendChild(deleteButton);
        }

        node.appendChild(appt);
    }
}

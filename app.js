
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
const calContainer = document.getElementById('cal-container')
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
    }

    generateHTML(node) {
        const day = this.day;
        const dayContainer = document.createElement('div');
            dayContainer.innerHTML = this.day;

        const apptContainer = document.createElement('div');
            apptContainer.className = 'appt-container';
            apptContainer.innerHTML = 'No Appointments';

        const apptModal = new DayModal(this.day);

        node.onclick = function() {
            const modalID = 'dayModal' + day;
            const dayModal = document.getElementById(modalID);
            console.log(day);
            calContainer.className = 'blur';
            modalsContainer.className = 'modals-container';
            dayModal.className = 'day-modal';
        };

        dayContainer.appendChild(apptContainer);

        apptModal.generateHTML(modalsContainer);

        node.appendChild(dayContainer);
    }
}

class DayModal {
    constructor(day) {
        this.day = day;
        this.appts = [];
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

        const apptList = new AppointmentList();

        dayModal.appendChild(exitDiv);
        dayModal.appendChild(dayTitle);
        apptList.generateHTML(dayModal);

        node.appendChild(dayModal);
    }
}

class AppointmentList {
    constructor() {
        this.apptList = [];
    }

    generateHTML(node) {
        const listDiv = document.createElement('div');
        const apptForm = new Appointment();

        this.apptList.map(appt => {
            const appointment = new Appointment(appt.name, appt.start, appt.end);
            appointment.generateHTML(listDiv);
        });

        apptForm.generateHTML(listDiv);
        node.appendChild(listDiv);
    }
}

class Appointment {
    constructor(name, start, end) {
        this.name = name;
        this.start = start;
        this.end = end;
    }

    createTimeOption(node, i) {
        switch (i) {
            case 0:
                node.innerHTML = '12 AM';
                break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
                node.innerHTML = i + ' AM';
                break;
            case 12:
                node.innerHTML = '12 PM';
                break;
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
            case 21:
            case 22:
            case 23:
                node.innerHTML = (i-12) + ' PM';
                break;
            case 24:
                node.innerHTML = '11:59 PM';
                break;
        }
    }

    generateHTML(node) {
        const appt = document.createElement('form');
            appt.className = 'appt-form';
            appt.action = function() {

            };

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
                endTimeOption.value = i;

            this.createTimeOption(endTimeOption, j);

            endTimeSelect.appendChild(endTimeOption);
        }

        const submitButton = document.createElement('input');
            submitButton.className = 'ib ml10';
            submitButton.type = 'submit';
            submitButton.value = 'Submit';

        appt.appendChild(apptNameHeading);
        appt.appendChild(nameInput);
        appt.appendChild(startTimeHeading);
        appt.appendChild(startTimeSelect);
        appt.appendChild(endTimeHeading);
        appt.appendChild(endTimeSelect);
        appt.appendChild(submitButton);

        node.appendChild(appt);
    }
}

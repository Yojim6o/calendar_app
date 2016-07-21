
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const monthLabels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const today = new Date();
const todayDate = today.getDate();

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
            weekdayRow.className = "calendar-header";

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
                        day.onclick = function() {
                            console.log(this.id);
                        };
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
        const dayContainer = document.createElement('div');
            dayContainer.innerHTML = this.day;


        const apptContainer = document.createElement('div');
            apptContainer.className = "appt-container";
            apptContainer.innerHTML = "No Appointments";

        dayContainer.appendChild(apptContainer);


        node.appendChild(dayContainer);
    }
}


const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const monthLabels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const today = new Date();

class Calendar {
    constructor(month, year) {
        this.month = (isNaN(month) || month == null) ? today.getMonth() : month;
        this.year  = (isNaN(year) || year == null) ? today.getFullYear() : year;
    }

    generateHTML(node) {
        const firstDay = new Date(this.year, this.month, 1);
        const startingDay = firstDay.getDay();
        const monthLength = daysInMonth[this.month];

        let schedule = new Schedule(monthLength, startingDay);
        let container = document.getElementById(node);
        let cal = document.createElement('table');
            cal.className = 'calendar-table';
        let headerRow = document.createElement('tr');
        let calHeader = document.createElement('th');
            calHeader.colSpan = '7';
        let monthName = monthLabels[this.month];
            calHeader.innerHTML = monthName + '&nbsp;' + this.year;
        let weekdayRow = document.createElement('tr');
            weekdayRow.className = "calendar-header";

        weekdayLabels.map(day => {
            let weekdayCol = document.createElement('td');
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
            let weekRow = document.createElement('tr');
            for (var j = 0; j <= 6; j++) {
                let day = document.createElement('td');

                console.log("daycount", dayCount);
                console.log("monthLength", this.monthLength);
                console.log("i", i);
                console.log("j", j);
                console.log("startingDay", this.startingDay);

                if (dayCount <= this.monthLength && (i > 0 || j >= this.startingDay)) {
                    day.className = 'calendar-day has-day';
                    day.innerHTML = dayCount;
                    weekRow.appendChild(day);
                    console.log("weekrow is now:", weekRow);
                    dayCount++;
                } else {
                    day.className = 'calendar-day';
                    weekRow.appendChild(day);
                    console.log("weekrow is now:", weekRow);
                    console.log("day was not appended");
                }

                console.log("---------");

            }
            node.appendChild(weekRow);
            if (dayCount > this.monthLength) {
                break;
            }
        }
    }
}

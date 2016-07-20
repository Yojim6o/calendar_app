
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
        container.appendChild(cal);
    }
}

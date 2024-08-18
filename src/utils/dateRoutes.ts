export const validDateRoute = (year?: string, month?: string, day?: string) => {
    const validYear = year ? validateYearRoute(year) : true;
    const validMonth = month ? validateMonthRoute(month) : true;
    const validDay = day ? validateDayRoute(day, month, year) : true;

    return validYear && validMonth && validDay
}

const validateYearRoute = (year: string) => {
    const currentYear = new Date().getFullYear()

    const isFuture = Number(year) > currentYear; // more than current year
    const isBeforeMe = Number(year) < 1990; // before I was born
    const isValidFormat = !!year?.match(/^[0-9]{4}$/g)  // exactly four digits

    return isValidFormat && !isFuture && !isBeforeMe
}

const validateMonthRoute = (month: string) => {
    const months = ['january', 'jan', '01', '1', 'february', 'feb', '02', '2', 'march', 'mar', '03', '3', 'april', 'apr', '04', '4', 'may', '05', '5', 'june', 'jun', '06', '6', 'july', 'jul', '07', '7', 'august', 'aug', '08', '8', 'september', 'sep', 'sept', '09', '9', 'october', 'oct', '10', 'november', 'nov', '11', 'december', 'dec', '12'];

    const isValidMonth = months.indexOf(month?.toLowerCase()) > -1 // in the array

    return isValidMonth
}

const validateDayRoute = (day: string, month?: string, year?: string) => {
    let monthUpperLimit = 31

    // Handle months with 30 days (if provided)
    const has30Days = ['april', 'apr', '04', '4', 'june', 'jun', '06', '6', 'september', 'sept',  'sep', '09', '9', 'november', 'nov', '11'];

    const is30Days = month ? has30Days.indexOf(month?.toLowerCase()) > -1 : false
    if (is30Days) {
        monthUpperLimit = 30;
    }

    // Handle February and leap years (if provided)
    const hasFebruary = ['february', 'feb', '02', '2']

    const isFebruary = month ? hasFebruary.indexOf(month?.toLowerCase()) > -1 : false
    const isLeapYear = year ? ((Number(year) % 4 === 0) && (Number(year) % 100 !== 0)) || (Number(year) % 400 === 0) : false; // don't ask 😂
    if (isFebruary) {
        monthUpperLimit = isLeapYear ? 29 : 28 // 29 days every 4 years, else 28
    }

    // Validation
    const isDayOfMonth = Number(day) <= monthUpperLimit && Number(day) >= 1 // between 1 and 31
    const isValidFormat = !!day?.match(/^[0-9]{1,2}$/g) // only numeric; 1 or 2 digits

    return isValidFormat && isDayOfMonth
}
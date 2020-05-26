

export const convertUserToUnix = (startOrEnd, stateObj) => {
    let year, mo, day, hr, min;
    if(startOrEnd === 'start') {
        year = stateObj.s_year;
        mo = stateObj.s_month - 1;
        day = stateObj.s_day;
        hr = stateObj.s_hour;
        min = stateObj.s_minute
    } else if(startOrEnd === 'end') {
        year = stateObj.e_year;
        mo = stateObj.e_month - 1;
        day = stateObj.e_day;
        hr = stateObj.e_hour;
        min = stateObj.e_minute
    }
    const time = new Date(year, mo, day, hr, min)
    return time.getTime()
    //returns UNIX for compatibility with Timeline component
}



//receives integer Unix
export const convertUnixToUserDate = (unix) => { 
    let y, mo, d;
    const time = new Date(parseInt(unix, 10))

    y = time.getFullYear()
    mo = time.getMonth() + 1
    d = time.getDate()

    return `${mo}/${d}/${y}`
}
//returns pleasantly formatted date

export const convertUnixToUserTime = (unix) => { 
    let h, mi;
    const time = new Date(parseInt(unix, 10))

    h = time.getHours()
    mi = time.getMinutes()
    if(mi.toString().length === 1) {
        mi = '0' + mi
    }
    return `${h === 12 ? (h + ':' + mi + ' pm') : h > 12 ? (h-12 + ':' + mi +' pm') : (h + ':' + mi + ' am')}`
}
//returns pleasantly formatted time


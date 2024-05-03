import moment from 'moment-timezone';

export function getActualDate(){
    const timeZone = 'Europe/Warsaw';
    const currentDate = moment().tz(timeZone);

    return currentDate.format('YYYY-MM-DD');
}
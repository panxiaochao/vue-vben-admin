import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);
dayjs.extend(timezone);
export function formatDate(time, format = 'YYYY-MM-DD') {
  try {
    const date = dayjs.isDayjs(time) ? time : dayjs(time);
    if (!date.isValid()) {
      throw new Error('Invalid date');
    }
    return date.tz().format(format);
  } catch (error) {
    console.error(`Error formatting date: ${error}`);
    return String(time ?? '');
  }
}
export function formatDateTime(time) {
  return formatDate(time, 'YYYY-MM-DD HH:mm:ss');
}
export function isDate(value) {
  return value instanceof Date;
}
export function isDayjsObject(value) {
  return dayjs.isDayjs(value);
}
export const getSystemTimezone = () => {
  return dayjs.tz.guess();
};
let currentTimezone = getSystemTimezone();
export const setCurrentTimezone = (timezone) => {
  currentTimezone = timezone || getSystemTimezone();
  dayjs.tz.setDefault(currentTimezone);
};
export const getCurrentTimezone = () => {
  return currentTimezone;
};

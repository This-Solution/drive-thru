import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(isoWeek);

const formatDate = (value) => dayjs(value).format('DD/MM/YYYY');

const isBeforeDate = (value) => dayjs(value).isBefore(dayjs());

const isCloseToExpire = (value) => {
  const diff = dayjs(value).diff(dayjs(), 'days');

  if (diff < 0) {
    return false;
  }

  return diff <= 7;
};

const getPreviousDate = (days) => {
  return dayjs().add(-1 * days, 'days');
};

const getTodayDate = () => dayjs();

const getDateBeforeMonth = () => getTodayDate().subtract(1, 'month').format('YYYY-MM-DD');

function isBefore(value) {
  return dayjs().isBefore(dayjs(value));
}

function isAfter(value) {
  return dayjs().isAfter(dayjs(value));
}

function getLastDate(noOfDays) {
  const today = dayjs().startOf('day');
  return today.subtract(noOfDays, 'day');
}

function getFormatDate(value) {
  const date = dayjs(value);
  return date.format('DD/MM/YYYY HH:mm');
}

const convertCurrentToUTC = (value) => {
  const offset = dayjs().utcOffset();
  return dayjs(value).subtract(offset, 'minutes');
};
const convertUTCToCurrent = (value) => {
  const offset = dayjs().utcOffset();
  return dayjs(value).add(offset, 'minutes');
};

const dayName = (dayNumber) => dayjs().day(dayNumber).format('dddd');

const convertToUtc = (value, timezone) => {
  return dayjs.utc(value).tz(timezone);
};

const convertMonthNumberToName = (monthNumber) => {
  const date = dayjs().month(monthNumber - 1);
  return date.format('MMMM');
};

function getWeekStartAndEnd(year, weekNumber) {
  const startDate = dayjs().year(year).isoWeek(weekNumber).startOf('isoWeek');
  const endDate = startDate.add(6, 'day').endOf('D').toDate();
  const fromDate = formatDate(startDate);
  const toDate = formatDate(endDate);
  return `${fromDate} - ${toDate}`;
}

function dateFromDay(year, day) {
  const date = new Date(year, 0);
  return new Date(date.setDate(day));
}

const getTimeFromMinutes = (minutes) => {
  return dayjs().add(minutes, 'minute').toDate();
};

const getMinutesFromTime = (time) => {
  return dayjs(time).diff(dayjs(time).startOf('day'), 'minute');
};

function convertTimeZone(value, timeZone = 'Australia/Melbourne') {
  return dayjs.utc(value).tz(timeZone).format('HH:mm:ss');
};

function getTimeFormat(value) {
  return dayjs(`${value}Z`).local().format('HH:mm:ss');
}


export default {
  formatDate,
  isBeforeDate,
  isCloseToExpire,
  getPreviousDate,
  getTodayDate,
  isBefore,
  isAfter,
  getLastDate,
  getFormatDate,
  getDateBeforeMonth,
  convertUTCToCurrent,
  convertCurrentToUTC,
  convertToUtc,
  dayName,
  convertMonthNumberToName,
  getWeekStartAndEnd,
  dateFromDay,
  getTimeFromMinutes,
  getMinutesFromTime,
  convertTimeZone,
  getTimeFormat
};

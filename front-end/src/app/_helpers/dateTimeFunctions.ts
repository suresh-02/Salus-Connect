import { formatDate } from '@angular/common';
import * as moment from 'moment';

export function formatTime(time: Date) {
  let hour = time.getHours() <= 9 ? `0${time.getHours()}` : time.getHours();
  let minute =
    time.getMinutes() <= 9 ? `0${time.getMinutes()}` : time.getMinutes();
  return `${hour}:${minute}`;
}

export function timeStringToDate(time: string): Date {
  let tmp = time.split(':');
  let date = new Date();
  date.setHours(parseInt(tmp[0]));
  date.setMinutes(parseInt(tmp[1]));
  return date;
}

export function dateToString(date: Date | string): string {
  return formatDate(date, 'yyyy-MM-dd', 'en');
}

export function addMinute(
  time: string,
  minute: any,
  is24Hrs?: boolean
): string[] {
  let tmp = time.split(':');
  let date = new Date();
  date.setHours(parseInt(tmp[0]));
  date.setMinutes(parseInt(tmp[1]));
  if (is24Hrs) {
    return [
      moment(date, 'hh:mm:ss').format('HH:mm'),
      moment(date, 'hh:mm:ss').add(minute, 'minutes').format('HH:mm'),
    ];
  } else {
    return [
      moment(date, 'hh:mm:ss').format('LT'),
      moment(date, 'hh:mm:ss').add(minute, 'minutes').format('LT'),
    ];
  }
  // return date;
}

export function amOrPm(time: string): string {
  let tmp = time.split(':');
  let date = new Date();
  date.setHours(parseInt(tmp[0]));
  date.setMinutes(parseInt(tmp[1]));
  return moment(date, 'hh:mm:ss').format('LT');
}

export function addDate(date: Date, days: number, type: string) {
  let noOfDaysToBeAdded;
  if (type === 'day') noOfDaysToBeAdded = days;
  else noOfDaysToBeAdded = days * 7;
  return moment(date).add(noOfDaysToBeAdded, 'days').format('yyyy-MM-DD');
}

export function subtractDate(date: Date, days: number, type: string) {
  let noOfDaysToBeSubtracted;
  if (type === 'day') noOfDaysToBeSubtracted = days;
  else noOfDaysToBeSubtracted = days * 7;
  return moment(date)
    .subtract(noOfDaysToBeSubtracted, 'days')
    .format('yyyy-MM-DD');
}

export function generateTimeRange(
  start: string,
  end: string,
  interval: number
) {
  let startTime = moment(start, 'HH:mm');
  let endTime = moment(end, 'HH:mm');
  let timeSlots = [];

  if (endTime.isBefore(startTime)) {
    endTime.add(1, 'day');
  }

  while (startTime.format('HH:mm') < endTime.format('HH:mm')) {
    // console.log(startTime.format('HH:mm'));
    timeSlots.push(startTime.format('HH:mm'));
    startTime.add(interval, 'minutes');
  }

  if (startTime.format('HH:mm') > endTime.format('HH:mm')) {
    // console.log(startTime.format('HH:mm'), endTime.format('HH:mm'));
    timeSlots.pop();
  }

  return timeSlots;
}

export function sortTimeArray(times: string[]) {
  return times.sort((a, b) => {
    return a.localeCompare(b);
  });
}

export function stringToDate(date: string): Date {
  //console.log('stringToDate', date);
  return !date.endsWith('T00:00') && !date.endsWith('T00:00:00')
    ? new Date(`${date}T00:00`)
    : new Date(date);
}

export function stringToDateTime(date: string): string {
  return moment(date).format('MM-DD-YYYY');
}

export function fromNow(date: string): string {
  let dt = moment(date);
  return dt.fromNow(true);
}

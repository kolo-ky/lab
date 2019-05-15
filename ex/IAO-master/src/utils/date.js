export function dateFormatting(date) {
  if (date === null || date === undefined) return '';
  if (date.substring(0, date.indexOf('T'))) {
    return date.substring(0, date.indexOf('T'))
      .split('-')
      .reverse()
      .join('.');
  }
  return date
    .split('-')
    .reverse()
    .join('.');
}

export function dateToTime(date) {
  if (date === null || date === undefined) return '';
  return date.substring(date.indexOf('T') + 1).split(':').slice(0, -1).join(':');
}

export function dateForSend(date) {
  if (date === null || date === undefined) return '';
  return date.split('.').reverse().join('-');
}

export function sec2time(timeInSeconds) {
  function pad(num, size) {
    return (`000${num}`).slice(size * -1);
  }
  const time = parseFloat(timeInSeconds).toFixed(3);
  const hours = Math.floor(time / 60 / 60);
  const minutes = Math.floor(time / 60) % 60;
  const seconds = Math.floor(time - (minutes * 60));
  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
}


export function sumDurationFormat(mins) {
  const sum = mins.reduce((acc, curr) => acc + curr, 0);
  const timeObj = minTimeObject(sum);
  if (mins.includes(undefined)) {
    return `${timeObj.hours}h ${timeObj.minutes}m 以上`;
  } else {
    return `${timeObj.hours}h ${timeObj.minutes}m`;
  }
}

export function durationFormat(mins) {
  const timeObj = minTimeObject(mins);
  return `${timeObj.hours}h ${timeObj.minutes}m`;
}

export function minTimeObject(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return {
    hours,
    minutes: remainingMinutes,
  };
}

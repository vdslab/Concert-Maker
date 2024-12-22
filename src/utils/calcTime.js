export function sumDurationFormat(mins) {
  const sum = mins.reduce((acc, curr) => acc + curr, 0);
  const timeObj = minTimeObject(sum);
  if (mins.includes(undefined)) {
    return `${timeObj.hours > 0 ? `${timeObj.hours}時間` : ""}${timeObj.minutes > 0 ? `${timeObj.minutes}分` : ""}`;
  } else {
    return `${timeObj.hours > 0 ? `${timeObj.hours}時間` : ""}${timeObj.minutes > 0 ? `${timeObj.minutes}分` : ""}`;
  }
}

export function durationFormat(mins) {
  const timeObj = minTimeObject(mins);
  return `${timeObj.hours > 0 ? `${timeObj.hours}時間` : ""}${timeObj.minutes > 0 ? `${timeObj.minutes}分` : ""}`;
}

export function minTimeObject(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return {
    hours,
    minutes: remainingMinutes,
  };
}

export function sumDurationFormat(mins, language) {
  const sum = mins.reduce((acc, curr) => acc + curr, 0);
  return durationFormat(sum, language);
}

export function durationFormat(mins, language) {

  if (mins === null) return null;
  const timeObj = minTimeObject(mins);

  if (timeObj.hours === 0) {
    return language === "ja" ? `${timeObj.minutes}分` : `${timeObj.minutes} min`;
  } else {
    if (timeObj.minutes === 0) {
      return language === "ja" ? `${timeObj.hours}時間` : `${timeObj.hours}h`;
    } else {
      return language === "ja" ? `${timeObj.hours}時間${timeObj.minutes}分` : `${timeObj.hours}h ${timeObj.minutes}min`;
    }
  }

  let result = [];
  if (timeObj.hours > 0) {
    result.push(language === "ja" ? `${timeObj.hours}時間` : `${timeObj.hours}h`);
  }
  if (timeObj.minutes > 0 || timeObj.hours === 0 ) {
    result.push(language === "ja" ? `${timeObj.minutes}分` : `${timeObj.minutes}min`);
  }

  return result.join(language === "ja" ? "" : " ");
}

export function minTimeObject(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return {
    hours,
    minutes: remainingMinutes,
  };
}

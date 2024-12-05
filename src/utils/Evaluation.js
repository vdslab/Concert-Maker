import Distance from "@/utils/Distance";
import playedWith from "@/assets/data/playedWith.json";

const avgDist = (works) => {
  const length = works.length;
  if (length === 0) return 0;

  let sumDist = 0;

  for (let i = 0; i < length; i++) {
    for (let j = i + 1; j < length; j++) {
      sumDist += Distance(
        works[i].composerData.latitude,
        works[i].composerData.longitude,
        works[j].composerData.latitude,
        works[j].composerData.longitude,
      );
    }
  }

  return sumDist / ((length * (length - 1)) / 2);
};

export const avgDistEval = (works) => {
  const calcDist = avgDist(works);
  const k = 3;
  return (1 - calcDist ** (2 / (1 + k))) ** ((1 + k) / 2) * 5;
};

const avgYear = (works) => {
  const length = works.length;
  if (length === 0) return 0;

  let sumYear = 0;

  for (let i = 0; i < length; i++) {
    for (let j = i + 1; j < length; j++) {
      sumYear += Math.abs(works[i].year - works[j].year);
    }
  }

  return sumYear / ((length * (length - 1)) / 2);
};

export const avgYearEval = (works) => {
  const D_year = avgYear(works);
  const a = 1.0002;
  const b = 10;
  return a ** (-b * D_year) * 5;
};

const avgPlayedWith = (works) => {
  console.log(playedWith);
  const length = works.length;
  if (length === 0) return 0;

  let sumPlayedWith = 0;

  for (let i = 0; i < length; i++) {
    for (let j = i + 1; j < length; j++) {
      const amount = playedWith
        .find((data) => data.workId === works[i].id)
        .playedWith.find((data) => data.workId === works[j].id);
      sumPlayedWith += amount ? amount.amount : 0;
    }
  }

  return sumPlayedWith / ((length * (length - 1)) / 2);
};

export const avgPlayedWithEval = (works) => {
  const D_playedWith = avgPlayedWith(works);
  return Math.min(D_playedWith * 5, 5);
};

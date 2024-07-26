import Works from "@/assets/works_v03.json";
import PlayedWithData from "@/assets/playedWith.json";
import Composer from "@/assets/composers_v02.json";
import { getComposerFromId, matchedDataByIds } from "./utils";
import Distance from "./Distance";

const findItem = (array, key, value) =>
  array.find((item) => item[key] === value);

export const processData = () => {
  const enhancedPlayedWithData = PlayedWithData.map((item) => {
    const baseWork = findItem(Works, "id", item.workId);
    const baseComposer = findItem(Composer, "name", baseWork.composer);

    return {
      ...item,
      playedWith: item.playedWith.map((pw) => {
        const relatedWork = findItem(Works, "id", pw.workId);
        const relatedComposer = findItem(
          Composer,
          "name",
          relatedWork.composer
        );
        return {
          ...pw,
          lat: relatedComposer?.latitude,
          lon: relatedComposer?.longitude,
          year: relatedWork?.year,
        };
      }),
      lat: baseComposer?.latitude,
      lon: baseComposer?.longitude,
      year: baseWork?.year,
    };
  });

  const linkData = enhancedPlayedWithData.flatMap((work) =>
    work.playedWith
      .filter((playedWith) => playedWith.workId > work.workId)
      .map((playedWith) => ({
        source: work.workId,
        target: playedWith.workId,
        distance: 100 / playedWith.amount,
        sourceData: getComposerFromId(work.workId),
        targetData: getComposerFromId(playedWith.workId),
      }))
  );

  const allPlayedWithWorkIds = new Set(
    PlayedWithData.flatMap((item) => [
      item.workId,
      ...item.playedWith.map((pw) => pw.workId),
    ])
  );

  return { enhancedPlayedWithData, linkData, allPlayedWithWorkIds };
};

export const createGraphData = (allPlayedWithWorkIds, linkData, data) => ({
  nodes: matchedDataByIds(data).filter((work) =>
    allPlayedWithWorkIds.has(work.id)
  ),
  links: linkData.filter((link) => {
    const { sourceData, targetData } = link;
    const timeFactor = Math.pow(
      1.1,
      -Math.abs(sourceData.year - targetData.year)
    );
    const distanceFactor = Math.pow(
      1 -
        Math.pow(
          Distance(
            sourceData.lat,
            sourceData.lon,
            targetData.lat,
            targetData.lon
          ),
          0.5
        ),
      2
    );
    return (
      sourceData.lat &&
      sourceData.lon &&
      targetData.lat &&
      targetData.lon &&
      timeFactor * distanceFactor > 0.1
    );
  }),
});

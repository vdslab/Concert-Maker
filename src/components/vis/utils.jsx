import Works from "../../assets/works_v03.json";
import Composer from "../../assets/composers_v02.json";

export const matchedDataByIds = Works.map((work) => {
  const composerInfo = Composer.find((c) => c.name === work.composer);

  return {
    id: work.id,
    composer: work.composer,
    duration: work.duration,
    title: work.title,
    workFormulaStr: work.workFormulaStr,
    workMovements: work.workMovements,
    workMovementDuration: work.workMovementDuration,
    year: work.year,
    lat: composerInfo ? composerInfo.latitude : null,
    lon: composerInfo ? composerInfo.longitude : null,
    nationality: composerInfo ? composerInfo.nationality : null,
    name: work.composer + "/" + work.title,
  };
});

export const getComposerFromId = (composerId) => {
  const work = matchedDataByIds.find((item) => item.id === composerId);
  return work ? work : { lat: null, lon: null };
};

import Works from "@/assets/data/works.json";
import Composer from "@/assets/data/composers.json";

export const getWorksWithComposerDetails = () =>
  Works.map((work) => {
    const composerInfo = Composer.find((c) => c.name === work.composer);

    const result1 = {
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
      birth: composerInfo ? composerInfo.birthYear : null,
      death: composerInfo ? composerInfo.deathYear : null,
      nationality: composerInfo ? composerInfo.nationality : null,
      name: work.composer + " / " + work.title,
      filter: 1,
    };

    const result = { ...result1, ...work.workFormula };

    return result;
  });

export const matchedDataByIds1 = Works.map((work) => {
  const composerInfo = Composer.find((c) => c.name === work.composer);

  const result1 = {
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
    birth: composerInfo ? composerInfo.birthYear : null,
    death: composerInfo ? composerInfo.deathYear : null,
    nationality: composerInfo ? composerInfo.nationality : null,
    name: work.composer + " / " + work.title,
  };

  const result = { ...result1, ...work.workFormula };

  return result;
});

export const getComposerFromId = (composerId) => {
  const work = matchedDataByIds1.find((item) => item.id === composerId);
  return work ? work : { lat: null, lon: null };
};

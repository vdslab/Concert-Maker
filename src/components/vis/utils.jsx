import { getWorksJson, getComposersJson } from "@/utils/processJson";

const Works = getWorksJson();
const Composer = getComposersJson();

/**
 * 指定した名前の作曲家情報を返すヘルパー関数
 * 見つからなければ空オブジェクトを返す
 */
const getComposerInfo = (composerName) =>
  Composer.find((c) => c.name === composerName) ?? {};

/**
 * Work と Composer をマージしたデータを作成する共通関数
 */
function mapWorkToData(work) {
  const composerInfo = getComposerInfo(work.composer);

  return {
    id: work.id,
    composer: work.composer,
    duration: work.duration,
    title: work.title,
    workFormula: work.workFormula,
    workMovements: work.workMovements,
    workMovementDuration: work.workMovementDuration,
    year: work.year,
    lat: composerInfo.latitude ?? null,
    lon: composerInfo.longitude ?? null,
    birth: composerInfo.birthYear ?? null,
    death: composerInfo.deathYear ?? null,
    nationality: composerInfo.nationality ?? null,
    name: `${work.composer} / ${work.title}`,
    filter: 1,
    ...work.workFormula,
  };
}

const worksData = Works.map(mapWorkToData);

/**
 * 全件取得 (作曲家詳細情報入りの works リスト)
 */
export const getWorksWithComposerDetails = worksData;

/**
 * ID から作曲家データを取得する
 * 存在しない場合は lat, lon が null のオブジェクトを返す
 */
export const getComposerFromId = (composerId) => {
  return (
    worksData.find((item) => item.id === composerId) ?? {
      lat: null,
      lon: null,
    }
  );
};

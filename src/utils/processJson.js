import worksData from "@/assets/data/works.json";
import composersData from "@/assets/data/composers.json";

let processedWorksData = null;
let processedComposersData = null;

export const getWorksJson = () => {
  if (processedWorksData) return processedWorksData;

  processedWorksData = worksData.map(item => {
    if (item.originalTitle) {
      return { ...item, composer: item.originalComposer, title: item.originalTitle };
    } else {
      return item;
    }
  });;

  console.log(processedWorksData);
  return processedWorksData;
};

export const getComposersJson = () => {
  if (processedComposersData) return processedComposersData;

  processedComposersData = composersData.map(item => {
    if (item.originalName) {
      return { ...item, name: item.originalName };
    } else {
      return item;
    }
  });;

  console.log(processedComposersData);
  return processedComposersData;
};

import workData from "@/assets/data/works.json";
import composersData from "@/assets/data/composers.json";

import { v4 as randomUUID } from "uuid";

import { useSnackbar } from "notistack";

import { concertsState, workConcertState } from "@/components/RecoilStates";
import { useSetRecoilState } from "recoil";
import { useSearchParams } from "react-router-dom";

import Insights from "@/components/evaluation/Insights.jsx";

export default function Share() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setConcerts = useSetRecoilState(concertsState);
  const setWorkConcert = useSetRecoilState(workConcertState);
  const { enqueueSnackbar } = useSnackbar();

  if (!searchParams) {
    return null;
  }

  const sharedJSON = searchParams.get("share");

  if (!sharedJSON) {
    return null;
  }

  const handleClose = () => {
    setSearchParams((params) => {
      params.delete("share");
      return params;
    });
  };

  const myConcert = JSON.parse(sharedJSON);

  const works = myConcert.works.map((workConcert) => {
    const work = workData.find((work) => work.id === workConcert.work);
    return {
      ...work,
      composerData: composersData.find(
        (composer) => composer.name === work.composer,
      ),
      selectedMovements: workConcert.movements,
    };
  });

  const duplicateConcert = () => {
    const newId = randomUUID();

    setConcerts((oldConcerts) => {
      const newConcerts = [...oldConcerts];
      newConcerts.push({
        id: newId,
        name: generateCopyName(
          oldConcerts.map((concert) => concert.name),
          myConcert.title,
        ),
      });
      return newConcerts;
    });

    const addWorks = works.map((work) => {
      return {
        concert: newId,
        work: work.id,
        movements: [...work.selectedMovements],
      };
    });

    setWorkConcert((oldWorks) => {
      return [...oldWorks, ...addWorks];
    });

    enqueueSnackbar("My演奏会に保存しました！", { variant: "success" });

    handleClose();
  };

  const submitAction = {
    label: "My演奏会に保存",
    func: duplicateConcert,
  };

  return (
    <Insights
      myConcert={myConcert}
      handleClose={handleClose}
      submitAction={submitAction}
    />
  );
}

function generateCopyName(existingNames, prefix) {
  if (!existingNames.includes(`${prefix}のコピー`)) {
    return `${prefix}のコピー`;
  }
  let number = 1;
  while (existingNames.includes(`${prefix}のコピー ${number}`)) {
    number++;
  }
  return `${prefix}のコピー ${number}`;
}

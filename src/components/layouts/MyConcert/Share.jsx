import workData from "@/assets/data/works.json";
import composersData from "@/assets/data/composers.json";

import { v4 as randomUUID } from "uuid";

import { useSnackbar } from "notistack";

import { concertsState, workConcertState } from "@/components/RecoilStates";
import { useSetRecoilState } from "recoil";
import { useSearchParams } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import Insights from "@/components/evaluation/Insights.jsx";
import MobileInsights from "@/components/evaluation/MobileInsights.jsx";

export default function Share() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setConcerts = useSetRecoilState(concertsState);
  const setWorkConcert = useSetRecoilState(workConcertState);
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { t } = useTranslation();

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
          myConcert.name,
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

    enqueueSnackbar(t("layouts.MyConcert.Share.savedToMyConcert"), { variant: "success" });

    handleClose();
  };

  const submitAction = {
    label: t("layouts.MyConcert.Share.saveToMyConcert"),
    func: duplicateConcert,
  };

  if (isMobile) {
    return (
      <MobileInsights
        myConcert={myConcert}
        handleClose={handleClose}
        submitAction={submitAction}
      />
    );
  }

  return (
    <Insights
      myConcert={myConcert}
      handleClose={handleClose}
      submitAction={submitAction}
    />
  );
}

function generateCopyName(existingNames, prefix) {
  if (!existingNames.includes(`${prefix}`)) {
    return `${prefix}`;
  }
  if (!existingNames.includes(`${prefix}のコピー`)) {
    return `${prefix}のコピー`;
  }
  let number = 1;
  while (existingNames.includes(`${prefix}のコピー ${number}`)) {
    number++;
  }
  return `${prefix}のコピー ${number}`;
}

/* eslint-disable react/prop-types */
import { useSnackbar } from "notistack";
import { useState } from "react";

import Insights from "@/components/evaluation/Insights.jsx";

export default function InsightsModal(props) {
  const { myConcert, concertName, open, setOpen } = props;

  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    setOpen(false);
  };

  const copyShareURL = () => {
    navigator.clipboard.writeText(
      window.location.href +
        "?share=" +
        encodeURIComponent(JSON.stringify(myConcert)),
    );
    enqueueSnackbar("URLをコピーしました", { variant: "success" });
  };

  const submitAction = {
    label: "このMy演奏会を共有",
    func: copyShareURL,
  };

  if (!open) {
    return <></>;
  }

  return (
    <Insights
      myConcert={myConcert}
      concertName={concertName}
      handleClose={handleClose}
      submitAction={submitAction}
    />
  );
}

/* eslint-disable react/prop-types */
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import Insights from "@/components/evaluation/Insights.jsx";
import MobileInsights from "@/components/evaluation/MobileInsights.jsx";

export default function InsightsModal(props) {
  const { myConcert, open, setOpen } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  const copyShareURL = () => {
    navigator.clipboard.writeText(
      window.location.href +
        "?share=" +
        encodeURIComponent(JSON.stringify(myConcert)),
    );
    enqueueSnackbar(t("layouts.MyConcert.InsightsModal.linkCopied"), { variant: "success" });
  };

  const submitAction = {
    label: t("layouts.MyConcert.InsightsModal.shareThisMyConcert"),
    func: copyShareURL,
  };

  if (!open) {
    return <></>;
  }

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

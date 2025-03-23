/* eslint-disable react/prop-types */
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import workData from "@/assets/data/works.json";
import composersData from "@/assets/data/composers.json";
import { durationFormat } from "@/utils/calcTime";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import React from "react";
import { useTranslation } from "react-i18next";

import Radar from "@/components/evaluation/radarChart.jsx";
import RectangularGraph from "@//components/evaluation/RectangularGraph.jsx";
import { getWorkFormulaText } from "@/utils/getWorkFormulaText";
import { sumDurationFormat } from "@/utils/calcTime";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MobileInsights(props) {
  const { myConcert, handleClose, submitAction } = props;
  const { t, i18n } = useTranslation();

  if (!myConcert) {
    return <></>;
  }

  const sum_duration = sumDurationFormat(
    myConcert.works.map((workConcert) => {
      const work = workData.find((work) => work.id === workConcert.work);
      return !workConcert.movements ||
        work.workMovementDuration.length <= 1 ||
        work.workMovementDuration[0] === "'"
        ? work.duration
        : workConcert.movements
          .map((duration) =>
            parseInt(work.workMovementDuration[duration].replace("'", "")),
          )
          .reduce((x, y) => x + y);
    }),
    i18n.resolvedLanguage
  );

  const hasWorks = myConcert.works && myConcert.works.length > 0;

  const works = hasWorks
    ? myConcert.works.map((workConcert) => {
      const work = workData.find((work) => work.id === workConcert.work);
      return {
        ...work,
        composerData: composersData.find(
          (composer) => composer.name === work.composer,
        ),
        selectedMovements: workConcert.movements,
      };
    })
    : [];

  return (
    <Dialog
      fullScreen
      open={true}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {myConcert.name}
          </Typography>
          {hasWorks && (
            <Button autoFocus color="inherit" onClick={submitAction.func}>
              {submitAction.label}
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ height: "100vh" }}>
        {hasWorks ? (
          <Box
            sx={{
              height: "100%",
              overflowX: "hidden",
              display: "grid",
              // gridTemplateColumns: "1fr 1fr", // 左右2列
              gridTemplateRows: "7fr 3fr", // 上下2行
              gap: 1, // グリッド間のスペース
            }}
          >
            <Box
              sx={{
                height: "30vh",
                gridRow: "1",
              }}
            >
              <Typography variant="h7" gutterBottom>
                {t("evaluation.Insights.analysisOfProgramStructure")}
              </Typography>
              <Radar works={works} />
            </Box>
            <Box
              sx={{
                height: "10vh",
                gridRow: "2",
              }}
            >
              <Typography variant="h7" gutterBottom>
                {t("evaluation.Insights.analysisOfPerformanceTime")}{" "}
                {sum_duration === "" ? "" : t("evaluation.Insights.totalPerformanceTime", { sum_duration })}
              </Typography>
              <RectangularGraph works={works} />
            </Box>
            <Box sx={{ height: "100%", overflowY: "auto", gridRow: "span 2" }}>
              <Box>
                {works.map((work, index) => {
                  const duration_time = durationFormat(
                    !work.selectedMovements ||
                      work.workMovementDuration.length <= 1 ||
                      work.workMovementDuration[0] === "'"
                      ? work.duration
                      : work.selectedMovements
                        .map((duration) =>
                          parseInt(
                            work.workMovementDuration[duration].replace(
                              "'",
                              "",
                            ),
                          ),
                        )
                        .reduce((x, y) => x + y),
                    i18n.resolvedLanguage
                  );

                  const workFormulaText = getWorkFormulaText(work.workFormula);

                  return (
                    <div key={`${myConcert.concert}-${index}`}>
                      {index !== 0 && <Divider />}
                      <Paper
                        elevation={0}
                        sx={{
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                          cursor: "pointer",
                        }}
                      >
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ width: "100%" }}
                        >
                          <Grid size="grow">
                            <Box sx={{ p: 1 }}>
                              <Typography variant="body1" component="div">
                                {`${work.composer} ${work.composerData.birthYear ||
                                  work.composerData.deathYear
                                  ? ` (${work.composerData.birthYear || ""
                                  }${t("common.tilde")}${work.composerData.deathYear || ""})`
                                  : ""
                                  }`}
                              </Typography>
                              <Typography variant="h6" component="div">
                                {work.title}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {work.year === null
                                  ? ""
                                  : t("evaluation.Insights.yearOfComposition", { year: work.year })}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {duration_time && t("evaluation.Insights.duration", { duration_time })}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {workFormulaText
                                  ? t("evaluation.Insights.instrumentation", { workFormulaText })
                                  : ""}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        <Grid size="grow">
                          {work.selectedMovements.length > 0 && (
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{
                                width: "100%",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Box sx={{ p: 1, overflowX: "auto" }}>
                                <Stack direction="row" spacing={1}>
                                  {work.selectedMovements.map(
                                    (movement, index) => (
                                      <Chip
                                        key={index}
                                        label={work.workMovements[movement]}
                                      />
                                    ),
                                  )}
                                </Stack>
                              </Box>
                            </Stack>
                          )}
                        </Grid>
                      </Paper>
                    </div>
                  );
                })}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography variant="body1" sx={{ fontSize: 20 }} align="center">
              {t("evaluation.Insights.noWork")}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

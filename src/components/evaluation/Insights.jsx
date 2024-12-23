/* eslint-disable react/prop-types */
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
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

import Radar from "@/components/evaluation/radarChart.jsx";
import RectangularGraph from "@//components/evaluation/RectangularGraph.jsx";
import { getWorkFormulaText } from "@/utils/getWorkFormulaText";
import { sumDurationFormat } from "@/utils/calcTime";

export default function Insights(props) {
  const { myConcert, handleClose, submitAction } = props;

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
      fullWidth
      maxWidth="xl"
      open={true}
      onClose={handleClose}
      sx={{ height: "100%" }}
    >
      <DialogTitle>
        {myConcert.name}
        <Typography variant="body1" component="span">
          {sum_duration === "" ? "" : `（合計演奏時間：${sum_duration}）`}
        </Typography>
        {/* ToDo */}
      </DialogTitle>
      <DialogContent sx={{ height: "90vh" }}>
        {hasWorks ? (
          <Box
            sx={{
              height: "100%",
              overflowX: "hidden",
              display: "grid",
              gridTemplateColumns: "1fr 1fr", // 左右2列
              gridTemplateRows: "7fr 3fr", // 上下2行
              gap: 1, // グリッド間のスペース
            }}
          >
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
                                {`${work.composer} ${
                                  work.composerData.birthYear ||
                                  work.composerData.deathYear
                                    ? ` (${
                                        work.composerData.birthYear || ""
                                      }〜${work.composerData.deathYear || ""})`
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
                                  : "作曲年: " + work.year + "年"}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {duration_time !== ""
                                  ? `演奏時間: ${duration_time}`
                                  : ""}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {workFormulaText
                                  ? "楽器編成: " + workFormulaText
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
            <Box
              sx={{
                height: "80%",
                gridColumn: "2",
                gridRow: "1",
              }}
            >
              <Typography variant="h7" gutterBottom>
                曲目構成の分析結果
              </Typography>
              <Radar works={works} />
            </Box>
            <Box
              sx={{
                height: "80%",
                gridColumn: "2",
                gridRow: "2",
              }}
            >
              <Typography variant="h7" gutterBottom>
                演奏時間の分析結果
              </Typography>
              <RectangularGraph works={works} />
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
              分析結果を表示するには1つ以上曲を追加してください
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          閉じる
        </Button>
        {hasWorks && (
          <Button variant="contained" onClick={submitAction.func}>
            {submitAction.label}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

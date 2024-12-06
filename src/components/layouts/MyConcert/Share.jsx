import React from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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

import { v4 as randomUUID } from "uuid";

import { useSnackbar } from "notistack";

import { concertsState, workConcertState } from "@/components/RecoilStates";
import { useSetRecoilState, useRecoilState } from "recoil";
import { useSearchParams } from "react-router-dom";

import Evaluation from "@/components/evaluation/Evaluation.jsx";
import Radar from "@/components/evaluation/radarChart.jsx";
import RectangularGraph from "@//components/evaluation/RectangularGraph.jsx";

export default function Share() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [concertValues, setConcerts] = useRecoilState(concertsState);
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
  console.log("myConcert", myConcert);
  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={true}
      onClose={handleClose}
      sx={{ height: "calc(100% - 64px)" }}
    >
      <DialogTitle>
        My演奏会{myConcert.title}{/* ToDo */}
      </DialogTitle>
      <DialogContent sx={{ height: "90vh" }}>
        <Box
          sx={{
            height: "100%",
            overflowX: "hidden",
            display: 'grid',
            gridTemplateColumns: '1fr 1fr', // 左右2列
            gridTemplateRows: '7fr 3fr', // 上下2行
            gap: 1, // グリッド間のスペース
          }}
        >
          <Box sx={{ height: "100%", overflowY: "auto", gridRow: 'span 2' }}>
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
                              {work.composer}
                            </Typography>
                            <Typography variant="h6" component="div">
                              {work.title}
                            </Typography>
                            <Typography variant="body2" component="div">
                              {duration_time !== ""
                                ? `演奏時間: ${duration_time}`
                                : ""}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <Typography
                                variant="body2"
                                component="div"
                                color="textSecondary"
                              >
                                {work.workFormulaStr
                                  .split("\n")
                                  .map((line, index) => (
                                    <div key={index}>{line}</div>
                                  ))}
                              </Typography>
                            </Stack>
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
          <Box sx={{
            height: "80%",
            gridColumn: '2',
            gridRow: '1'
          }}>
            <Typography variant="h7" gutterBottom>曲目構成の分析結果</Typography>
            <Radar works={works} />
          </Box>
          <Box sx={{
            height: "80%",
            gridColumn: '2',
            gridRow: '2'
          }}>
            <Typography variant="h7" gutterBottom>演奏時間の分析結果</Typography>
            <RectangularGraph works={works} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          閉じる
        </Button>
        <Button variant="contained" onClick={duplicateConcert}>
          My演奏会に保存
        </Button>
      </DialogActions>
    </Dialog>
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

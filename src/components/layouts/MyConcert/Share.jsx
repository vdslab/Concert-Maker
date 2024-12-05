import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import workData from "@/assets/data/works.json";
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

export default function Share() {
  // const [open, setOpen] = React.useState(true);

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

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "85%",
          height: "85%",
          border: "2px solid #000",
          boxShadow: 24,
          bgcolor: "background.paper",
          p: 4,
        }}
      >
        <Grid
          container
          justifyContent="row"
          flexDirection="column"
          width="100%"
          height="100%"
          spacing={2}
        >
          <Grid
            container
            justifyContent="center"
            flexDirection="column"
            width="50%"
            height="100%"
            spacing={2}
          >
            <Grid item>
              <Typography id="modal-modal-title" variant="h5" component="h2">
                {myConcert.title}
              </Typography>
            </Grid>
            <Grid item width="100%" height="90%">
              <Box width="100%" height="100%" sx={{ overflowY: "auto" }}>
                <Grid container spacing={2}>
                  <Grid size="grow">
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
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid
              container
              spacing={3}
              direction="column"
              justifyContent="space-between"
              sx={{
                width: "100%",
                height: "100%",
              }}
            >
              <Grid size="grow">
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    border: "1px solid #f00",
                  }}
                >
                  <Typography variant="body2" component="div">
                    評価画面作成予定地
                  </Typography>
                </Box>
              </Grid>
              <Grid
                container
                size="auto"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={2}
              >
                <Grid>
                  <Button variant="outlined" onClick={handleClose}>
                    閉じる
                  </Button>
                </Grid>
                <Grid>
                  <Button variant="contained" onClick={duplicateConcert}>
                    My演奏会に保存
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
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

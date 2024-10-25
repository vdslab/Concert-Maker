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

import styled from "@mui/material/styles/styled";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function Share() {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);

  //   const myConcert = props.myConcert;
  const myConcert = {
    title: "My Concert", // タイトルはシェアした側にない
    concert: "863c30b8-50ff-491c-a934-1e6c9cd7754e",
    works: [
      { work: 4259, movements: [0, 1, 2] },
      { work: 12458, movements: [] },
      { work: 5512, movements: [] },
      { work: 1768, movements: [] },
      { work: 5546, movements: [0, 1, 2, 3] },
      { work: 4512, movements: [0, 1, 2] },
    ],
  };

  const works = myConcert.works.map((workConcert) => {
    const work = workData.find((work) => work.id === workConcert.work);
    return {
      ...work,
      selectedMovements: workConcert.movements,
    };
  });

  return (
    <Modal
      open={open}
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
                border: "1px solid #000",
              }}
            >
              <Grid size="glow">
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    border: "1px solid #000",
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
                justifyContent="flex-end"
                alignItems="center"
                flexDirection="row"
                spacing={2}
                sx={{
                  border: "1px solid #000",
                }}
              >
                <Grid>
                  <Button variant="contained">コンサートを共有</Button>
                </Grid>
                <Grid>
                  <Button variant="contained">コンサートを保存</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

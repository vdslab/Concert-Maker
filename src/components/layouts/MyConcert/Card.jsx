import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import ConcertMenus from "./ConcertMenus";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AddMyConcert from "@/components/layouts/AddMyConcert";

import { useState } from "react";

import { sumDurationFormat, durationFormat } from "@/utils/calcTime";

import {
  workConcertState,
  selectedConcertState,
  concertsState,
} from "@/components/RecoilStates";
import { useSetRecoilState } from "recoil";

import PropTypes from "prop-types";

MyConcertCard.propTypes = {
  concert: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    works: PropTypes.arrayOf(
      PropTypes.shape({
        composer: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        duration: PropTypes.oneOfType([PropTypes.number, () => null]),
        workFormulaStr: PropTypes.oneOfType([PropTypes.string, () => null]),
        workFormula: PropTypes.shape({
          flute: PropTypes.number,
          oboe: PropTypes.number,
          clarinet: PropTypes.number,
          bassoon: PropTypes.number,
          horn: PropTypes.number,
          trumpet: PropTypes.number,
          trombone: PropTypes.number,
          tuba: PropTypes.number,
          timpani: PropTypes.number,
          percussion: PropTypes.number,
          harp: PropTypes.number,
          keyboard: PropTypes.number,
          str: PropTypes.bool,
        }),
        workFormula_perc: PropTypes.string,
        workMovements: PropTypes.arrayOf(PropTypes.string).isRequired,
        workMovementDuration: PropTypes.arrayOf(PropTypes.string),
        workSources: PropTypes.arrayOf(PropTypes.string).isRequired,
        playedWith: PropTypes.array,
        strYear: PropTypes.string,
        year: PropTypes.number.isRequired,
      }),
    ).isRequired,
    main: PropTypes.bool.isRequired,
  }).isRequired,
};

export default function MyConcertCard(props) {
  const { concert, setClicknode, Data } = props;
  const { id, name, works } = concert;
  const [editMode, setEditMode] = useState(false);
  const selectConcert = useSetRecoilState(selectedConcertState);

  const setConcerts = useSetRecoilState(concertsState);

  const sum_duration = sumDurationFormat(
    works.map((work) =>
      !work.selectedMovements ||
      work.workMovementDuration.length <= 1 ||
      work.workMovementDuration[0] === "'"
        ? work.duration
        : work.selectedMovements
            .map((duration) =>
              parseInt(work.workMovementDuration[duration].replace("'", "")),
            )
            .reduce((x, y) => x + y),
    ),
  );

  return (
    <Card elevation={3}>
      <Box sx={{ p: 2 }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid size="auto">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Button
                variant="contained"
                color={concert.main ? "secondary" : "inherit"}
                size="small"
                onClick={() => {
                  selectConcert(id);
                }}
              >
                Main
              </Button>
              {editMode ? (
                <TextField
                  id="my-concert-name"
                  label="My演奏会名"
                  variant="standard"
                  defaultValue={name}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      setConcerts((concerts) =>
                        concerts.map((concert) =>
                          concert.id === id
                            ? { ...concert, name: e.target.value }
                            : concert,
                        ),
                      );
                      setEditMode(false);
                    }
                  }}
                  helperText="決定するにはEnterキーを押してください"
                />
              ) : (
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography gutterBottom variant="h5" component="div">
                    {name}
                  </Typography>
                  <IconButton
                    aria-label="edit"
                    onClick={() => {
                      setEditMode(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Stack>
              )}
            </Stack>
          </Grid>
          <Grid size="auto">
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              <ConcertMenus id={id} />
              <Typography gutterBottom variant="h6" component="div">
                {sum_duration}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <WorkList
          works={works}
          concertID={id}
          Data={Data}
          setClicknode={setClicknode}
        />
      </Box>
    </Card>
  );
}

WorkList.propTypes = {
  works: PropTypes.arrayOf(
    PropTypes.shape({
      composer: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      duration: PropTypes.oneOfType([PropTypes.number, () => null]),
      workFormulaStr: PropTypes.oneOfType([PropTypes.string, () => null]),
      workFormula: PropTypes.shape({
        flute: PropTypes.number,
        oboe: PropTypes.number,
        clarinet: PropTypes.number,
        bassoon: PropTypes.number,
        horn: PropTypes.number,
        trumpet: PropTypes.number,
        trombone: PropTypes.number,
        tuba: PropTypes.number,
        timpani: PropTypes.number,
        percussion: PropTypes.number,
        harp: PropTypes.number,
        keyboard: PropTypes.number,
        str: PropTypes.bool,
      }),
      workFormula_perc: PropTypes.string,
      workMovements: PropTypes.arrayOf(PropTypes.string).isRequired,
      workMovementDuration: PropTypes.arrayOf(PropTypes.string),
      workSources: PropTypes.arrayOf(PropTypes.string).isRequired,
      playedWith: PropTypes.array,
      strYear: PropTypes.string,
      year: PropTypes.number.isRequired,
    }),
  ).isRequired,
  concertID: PropTypes.string.isRequired,
};

function WorkList(props) {
  const { works, concertID, setClicknode, Data } = props;

  const [openModal, setOpenModal] = React.useState(false);
  const [editWork, setEditWork] = React.useState(null);

  const setWorkConcertState = useSetRecoilState(workConcertState);

  if (works.length === 0) {
    return (
      <Typography variant="body1" align="center">
        曲を追加してください
      </Typography>
    );
  }

  const handleItemClick = (work) => {
    // const node = getComposerFromId(work.id);
    const node = Data.nodes.find((node) => node.id === work.id);
    setClicknode(node);
  };
  const handleItemEditClick = (work) => {
    setEditWork(work);
    setOpenModal(true);
  };

  const handleDeleteClick = (e, work) => {
    e.stopPropagation();
    setWorkConcertState((works) =>
      works.filter(
        (workConcert) =>
          !(workConcert.concert === concertID && workConcert.work === work.id),
      ),
    );
  };

  return (
    <Box>
      <AddMyConcert
        work={editWork}
        open={openModal}
        setOpen={setOpenModal}
        concertID={concertID}
      />
      {works.map((work, index) => {
        const duration_time = durationFormat(
          !work.selectedMovements ||
            work.workMovementDuration.length <= 1 ||
            work.workMovementDuration[0] === "'"
            ? work.duration
            : work.selectedMovements
                .map((duration) =>
                  parseInt(
                    work.workMovementDuration[duration].replace("'", ""),
                  ),
                )
                .reduce((x, y) => x + y),
        );
        return (
          <div key={`${concertID}-${index}`}>
            {index !== 0 && <Divider />}
            <Paper
              elevation={0}
              sx={{
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                cursor: "pointer",
              }}
              onClick={() => handleItemClick(work)}
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
                      {duration_time !== "" ? `演奏時間: ${duration_time}` : ""}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Typography
                        variant="body2"
                        component="div"
                        color="textSecondary"
                      >
                        {work.workFormulaStr.split("\n").map((line, index) => (
                          <div key={index}>{line}</div>
                        ))}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
                <Grid size="auto">
                  <IconButton
                    aria-label="delete"
                    onClick={(e) => handleDeleteClick(e, work)}
                  >
                    <DeleteIcon />
                  </IconButton>
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
                        {work.selectedMovements.map((movement, index) => (
                          <Chip
                            key={index}
                            label={work.workMovements[movement]}
                          />
                        ))}
                      </Stack>
                    </Box>
                    <Box>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleItemEditClick(work)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </Stack>
                )}
              </Grid>
            </Paper>
          </div>
        );
      })}
    </Box>
  );
}

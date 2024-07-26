import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import ConcertMenus from "./ConcertMenus";

import { useState } from "react";

import { sumDurationFormat, durationFormat } from "@/utils/calcTime";

import {
  workConcertState,
  selectedConcertState,
  concertsState,
} from "@/pages/App";
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
        duration: PropTypes.number.isRequired,
        workFormulaStr: PropTypes.string.isRequired,
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
  const { concert } = props;
  const { id, name, works } = concert;
  const [editMode, setEditMode] = useState(false);
  const selectConcert = useSetRecoilState(selectedConcertState);

  const setConcerts = useSetRecoilState(concertsState);

  const sum_duration = sumDurationFormat(works.map((work) => work.duration));

  return (
    <Card elevation={3}>
      <Box sx={{ p: 2 }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
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
                      console.log(e.target.value);
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
          <Grid item xs="auto">
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
        <WorkList works={works} concertID={id} />
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
      duration: PropTypes.number.isRequired,
      workFormulaStr: PropTypes.string.isRequired,
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
  const { works, concertID } = props;
  const setWorkConcertState = useSetRecoilState(workConcertState);

  if (works.length === 0) {
    return (
      <Typography variant="body1" align="center">
        曲を追加してください
      </Typography>
    );
  }

  return (
    <Box>
      {works.map((work, index) => {
        const duration_time = durationFormat(work.duration);
        return (
          <div key={`${concertID}-${index}`}>
            {index !== 0 && <Divider />}
            <Grid
              container
              direction="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <Grid item xs>
                <Box sx={{ p: 1 }}>
                  <Typography variant="body1" component="div">
                    {work.composer}
                  </Typography>
                  <Typography variant="h6" component="div">
                    {work.title}
                  </Typography>
                  <Typography variant="body2" component="div">
                    {duration_time}
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
              {/* <Divider orientation="vertical" flexItem /> */}
              <Grid item xs="auto">
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    console.log("delete");
                    setWorkConcertState((works) =>
                      works.filter(
                        (workConcert) =>
                          !(
                            workConcert.concert === concertID &&
                            workConcert.work === work.id
                          ),
                      ),
                    );
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </div>
        );
      })}
    </Box>
  );
}

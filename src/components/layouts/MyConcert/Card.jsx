import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import ConcertMenus from "./ConcertMenus";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import WorkList from "@/components/layouts/MyConcert/WorkList";

import { useState } from "react";

import { sumDurationFormat } from "@/utils/calcTime";

import { selectedConcertState, concertsState } from "@/components/RecoilStates";
import { useSetRecoilState } from "recoil";

export default function MyConcertCard(props) {
  const { concert, setClickedNodeId, Data } = props;
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
          spacing={2}
        >
          <Grid size="auto">
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
          </Grid>
          <Grid size="grow">
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
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
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
          </Grid>
          <Grid size="auto">
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              <Typography gutterBottom variant="h6" component="div">
                {sum_duration}
              </Typography>
              <ConcertMenus id={id} />
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <WorkList
          works={works}
          concertID={id}
          setClickedNodeId={setClickedNodeId}
        />
      </Box>
    </Card>
  );
}

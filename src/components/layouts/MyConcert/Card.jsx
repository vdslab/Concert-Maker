/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useId } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import ConcertMenus from "./ConcertMenus";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InsightsIcon from "@mui/icons-material/Insights";

import CalloutPopover from "@/components/layouts/CalloutPopover";
import InsightsModal from "@/components/layouts/MyConcert/InsightsModal";
import WorkList from "@/components/layouts/MyConcert/WorkList";

import { sumDurationFormat } from "@/utils/calcTime";

import {
  selectedConcertState,
  concertsState,
  concertListState,
} from "@/components/RecoilStates";
import { useSetRecoilState, useRecoilValue } from "recoil";

export default function MyConcertCard(props) {
  const { concert, setClickedNodeId, Data } = props;
  const { id, name, works } = concert;
  const [editMode, setEditMode] = useState(false);

  const [openInsight, setOpenInsight] = useState(false);

  const [openCallout, setOpenCallout] = useState(false); // 吹き出し用
  const anchorRef = useRef(null); // 吹き出し用
  const calloutId = useId(); // 吹き出し用。CalloutPopover のアクセシビリティ属性として渡す ID

  const workList = useRecoilValue(concertListState);
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

  const InsightsWorks = {
    concert: id,
    name: workList.find((work) => work.id === id).name,
    works: works.map((work) => {
      return {
        work: work.id,
        movements: work.selectedMovements,
      };
    }),
  };

  // 吹き出しを閉じたとき
  const handleCalloutClose = () => {
    setOpenCallout(false);
    localStorage.setItem("isMainUnderstood", "true");
  };

  // 吹き出しを出すかどうかの判定
  useEffect(() => {
    const targetConcert = workList.find(item => !item.main);
    if (targetConcert && targetConcert.id === id) {
      const isMainUnderstood = localStorage.getItem("isMainUnderstood") === "true";
      !isMainUnderstood && setOpenCallout(true);
    }
  }, [])

  return (
    <>
      <Card
        elevation={3}
        sx={{
          m: { xs: 1, sm: 0 },
        }}
      >
        <InsightsModal
          myConcert={InsightsWorks}
          open={openInsight}
          setOpen={setOpenInsight}
        />
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
                ref={anchorRef}
              >
                メイン
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
                      const newName = e.target.value.trim();
                      if (newName === "") {
                        // 空欄の場合は元の名前に戻す
                        e.target.value = name;
                      } else {
                        setConcerts((concerts) =>
                          concerts.map((concert) =>
                            concert.id === id
                              ? { ...concert, name: newName }
                              : concert,
                          ),
                        );
                      }
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
                <Button
                  variant="contained"
                  color="info"
                  style={{ borderRadius: 20 }}
                  startIcon={<InsightsIcon />}
                  onClick={() => {
                    setOpenInsight(true);
                  }}
                  data-tour-id="a-04"
                >
                  分析
                </Button>
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
      <CalloutPopover
        id={calloutId}
        open={openCallout}
        anchorEl={anchorRef.current}
        horizontal={"left"}
        left={30}
      >
        <DialogTitle sx={{ fontSize: 16 }}>
          曲の追加先を変更する
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "white", maxWidth: "20em" }}>
            曲を追加したいy演奏会を切り替えるには、［メイン］をクリックしてください。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button variant="outlined" onClick={handleCalloutClose} sx={{ borderRadius: "2em", borderColor: "white", color: "white" }}>
            閉じる
          </Button>
        </DialogActions>
      </CalloutPopover>
    </>
  );
}

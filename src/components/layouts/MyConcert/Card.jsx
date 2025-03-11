import { useState, useEffect, useRef, useId } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import EditIcon from "@mui/icons-material/Edit";
import InsightsIcon from "@mui/icons-material/Insights";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

import ConcertMenus from "./ConcertMenus";
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

export default function MyConcertCard({ concert, setClickedNodeId }) {
  const { id, name, works } = concert;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [editMode, setEditMode] = useState(false);
  const [openInsight, setOpenInsight] = useState(false);
  const [openCallout, setOpenCallout] = useState(false);

  const anchorRef = useRef(null);
  const calloutId = useId();

  const workList = useRecoilValue(concertListState);
  const selectConcert = useSetRecoilState(selectedConcertState);
  const setConcerts = useSetRecoilState(concertsState);

  // 楽曲の合計時間を計算
  const sumDuration = sumDurationFormat(
    works.map((work) =>
      !work.selectedMovements ||
      work.workMovementDuration.length <= 1 ||
      work.workMovementDuration[0] === "'"
        ? work.duration
        : work.selectedMovements
            .map((movement) =>
              parseInt(work.workMovementDuration[movement].replace("'", ""))
            )
            .reduce((x, y) => x + y)
    )
  );

  const insightsData = {
    concert: id,
    name: workList.find((item) => item.id === id)?.name || name,
    works: works.map((work) => ({
      work: work.id,
      movements: work.selectedMovements,
    })),
  };

  // 吹き出しを閉じたとき
  const handleCalloutClose = () => {
    setOpenCallout(false);
    localStorage.setItem("isMainUnderstood", "true");
  };

  // 吹き出しを出すかどうかの判定
  useEffect(() => {
    const targetConcert = workList.find((item) => !item.main);
    if (targetConcert && targetConcert.id === id) {
      const isMainUnderstood =
        localStorage.getItem("isMainUnderstood") === "true";
      !isMainUnderstood && setOpenCallout(true);
    }
  }, []);

  const handleNameKeyDown = (e) => {
    if (e.key === "Enter") {
      const newName = e.target.value.trim();
      if (newName !== "") {
        setConcerts((prev) =>
          prev.map((concert) =>
            concert.id === id ? { ...concert, name: newName } : concert
          )
        );
      } else {
        e.target.value = name;
      }
      setEditMode(false);
    }
  };

  const renderNameField = () => (
    <TextField
      id="my-concert-name"
      label="My演奏会名"
      variant="standard"
      defaultValue={name}
      onKeyDown={handleNameKeyDown}
      helperText="決定するにはEnterキーを押してください"
    />
  );

  // 編集モードかどうかで表示を切り替え
  const renderContent = () => {
    if (editMode) return renderNameField();

    if (isMobile) {
      return (
        <Stack direction="column" spacing={0} alignItems="flex-start">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                mb: 0.5,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </Typography>
            <IconButton
              aria-label="edit"
              onClick={() => setEditMode(true)}
              sx={{ ml: 1 }}
            >
              <EditIcon />
            </IconButton>
          </Box>
          <Typography
            variant="h6"
            component="div"
            color="text.secondary"
            whiteSpace="nowrap"
          >
            {sumDuration}
          </Typography>
        </Stack>
      );
    }

    return (
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography
          variant="h5"
          component="div"
          gutterBottom
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </Typography>
        <IconButton aria-label="edit" onClick={() => setEditMode(true)}>
          <EditIcon />
        </IconButton>
      </Stack>
    );
  };

  // 「メイン」ボタン部分
  const renderLeftSection = () => (
    <Grid size="auto">
      <Button
        variant="contained"
        color={concert.main ? "secondary" : "inherit"}
        size="small"
        onClick={() => selectConcert(id)}
        ref={anchorRef}
      >
        メイン
      </Button>
    </Grid>
  );

  // 右側の「分析」ボタンとメニュー群
  const renderRightSection = () => (
    <Grid size="auto">
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
      >
        {!isMobile && (
          <Typography variant="h6" component="div" gutterBottom>
            {sumDuration}
          </Typography>
        )}
        <Button
          variant="contained"
          color="info"
          style={{ borderRadius: 20 }}
          startIcon={<InsightsIcon />}
          onClick={() => setOpenInsight(true)}
          data-tour-id="a-04"
        >
          分析
        </Button>
        <ConcertMenus id={id} />
      </Stack>
    </Grid>
  );

  const renderLayout = () => (
    <>
      {isMobile ? (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="flex-start"
        >
          {renderLeftSection()}
          <Grid size="grow">{renderContent()}</Grid>
          {renderRightSection()}
        </Stack>
      ) : (
        <Grid
          container
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          {renderLeftSection()}
          <Grid size="grow">{renderContent()}</Grid>
          {renderRightSection()}
        </Grid>
      )}
    </>
  );

  return (
    <>
      <Card elevation={3} sx={{ m: { xs: 1, sm: 0 } }}>
        <InsightsModal
          myConcert={insightsData}
          open={openInsight}
          setOpen={setOpenInsight}
        />
        <Box sx={{ p: 2 }}>{renderLayout()}</Box>
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
        horizontal="left"
        left={30}
      >
        <DialogTitle sx={{ fontSize: 16 }}>曲の追加先を変更する</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "white", maxWidth: "20em" }}>
            曲を追加したい演奏会を切り替えるには、［メイン］をクリックしてください。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleCalloutClose}
            sx={{ borderRadius: "2em", borderColor: "white", color: "white" }}
          >
            閉じる
          </Button>
        </DialogActions>
      </CalloutPopover>
    </>
  );
}

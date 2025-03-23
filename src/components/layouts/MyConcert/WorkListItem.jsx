import { useState, useEffect, useRef, useId } from "react";

import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AddMyConcert from "@/components/layouts/AddMyConcert";
import CalloutPopover from "@/components/layouts/CalloutPopover";

import composersData from "@/assets/data/composers.json";

import { durationFormat } from "@/utils/calcTime";
import { getWorkFormulaText } from "@/utils/getWorkFormulaText";

import { concertListState } from "@/components/RecoilStates";
import { useRecoilValue } from "recoil";

import { useTranslation } from "react-i18next";

export default function WorkListItem({
  work,
  concertID,
  setClickedNodeId,
  setWorkConcertState,
  sortableItemProps,
}) {
  // sortableItemProps は、このコンポーネントが WorkListSortableItem として使用される場合にのみ用いる
  const [openModal, setOpenModal] = useState(false);
  const [editWork, setEditWork] = useState(null);
  const [openCallout, setOpenCallout] = useState(false); // 吹き出し用
  const anchorRef = useRef(null); // 吹き出し用
  const calloutId = useId(); // 吹き出し用。CalloutPopover のアクセシビリティ属性として渡す ID
  const concertList = useRecoilValue(concertListState);
  const { t } = useTranslation();

  // 吹き出しを閉じたとき
  const handleCalloutClose = () => {
    setOpenCallout(false);
    localStorage.setItem("isSortUnderstood", "true");
  };

  // 吹き出しを出すかどうかの判定
  useEffect(() => {
    const targetConcert = concertList.find(concert => concert.works.length >= 2);
    if (targetConcert && targetConcert.id === concertID) {
      const targetWork = targetConcert.works[1];
      if (targetWork && targetWork.id === work.id) {
        const isSortUnderstood = localStorage.getItem("isSortUnderstood") === "true";
        !isSortUnderstood && setOpenCallout(true);
      }
    }
  }, [])

  const handleItemClick = (work) => {
    setClickedNodeId(work.id);
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

  const duration_time = durationFormat(
    !work.selectedMovements ||
      work.workMovementDuration.length <= 1 ||
      work.workMovementDuration[0] === "'"
      ? work.duration
      : work.selectedMovements
        .map((duration) =>
          parseInt(work.workMovementDuration[duration].replace("'", "")),
        )
        .reduce((x, y) => x + y),
  );

  const workFormulaText = getWorkFormulaText(work.workFormula);

  const composer = composersData.find(
    (composer) => composer.name === work.composer,
  );

  return (
    <>
      <Paper
        ref={sortableItemProps?.setNodeRef}
        elevation={0}
        sx={{
          "&:hover": {
            backgroundColor: { sm: "#f5f5f5" },
          },
          cursor: { sm: "pointer" },
          touchAction: "none", // タッチの動作を無効にして、React DnD Kitがタッチイベントを処理できるようにする
        }}
        style={sortableItemProps?.style}
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
                {`${work.composer} ${composer.birthYear || composer.deathYear
                  ? ` (${composer.birthYear || ""}〜${composer.deathYear || ""})`
                  : ""
                  }`}
              </Typography>
              <Typography variant="h6" component="div">
                {work.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {work.year === null ? "" : t("layouts.MyConcert.WorkListItem.yearOfComposition", { year: work.year })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {duration_time && t("layouts.MyConcert.WorkListItem.duration", { duration_time })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {workFormulaText ? t("layouts.MyConcert.WorkListItem.instrumentation", { workFormulaText }) : ""}
              </Typography>
            </Box>
          </Grid>
          <Grid size="auto">
            <IconButton
              aria-label="delete"
              onClick={(e) => handleDeleteClick(e, work)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              ref={sortableItemProps?.setActivatorNodeRef}
              style={{ cursor: sortableItemProps ? "grab" : "grabbing" }}
              disableRipple={true} // ドラッグアイコンのリップルエフェクトは無効にする
              tabIndex={-1} // ドラッグハンドルへのキーボードフォーカスは無効にする
              {...sortableItemProps?.listeners}
              onTouchStart={(e) => e.preventDefault()} // モバイルでタッチスタート時に動作を防止
            >
              <DragIndicatorIcon ref={anchorRef} />
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
                    <Chip key={index} label={work.workMovements[movement]} />
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
                <AddMyConcert
                  work={editWork}
                  open={openModal}
                  setOpen={setOpenModal}
                  concertID={concertID}
                />
              </Box>
            </Stack>
          )}
        </Grid>
      </Paper>
      <CalloutPopover
        id={calloutId}
        open={openCallout}
        anchorEl={anchorRef.current}
        horizontal={"right"}
        right={30}
      >
        <DialogTitle sx={{ fontSize: 16 }}>
          {t("layouts.MyConcert.WorkListItem.rearrangeSongs")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "white", maxWidth: "20em" }}>
            {t("layouts.MyConcert.WorkListItem.rearrangeSongsText")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCalloutClose} sx={{ borderRadius: "2em", borderColor: "white", color: "white" }}>
            {t("layouts.MyConcert.WorkListItem.close")}
          </Button>
        </DialogActions>
      </CalloutPopover>
    </>
  );
}

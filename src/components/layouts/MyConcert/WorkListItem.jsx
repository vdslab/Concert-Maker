import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AddMyConcert from "@/components/layouts/AddMyConcert";

import composersData from "@/assets/data/composers.json";

import { useState } from "react";

import { durationFormat } from "@/utils/calcTime";
import { getWorkFormulaText } from "@/utils/getWorkFormulaText";

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
    <Paper
      ref={sortableItemProps?.setNodeRef}
      elevation={0}
      sx={{
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
        cursor: "pointer",
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
              {`${work.composer} ${
                composer.birthYear || composer.deathYear
                  ? ` (${composer.birthYear || ""} 〜 ${composer.deathYear || ""})`
                  : ""
              }`}
            </Typography>
            <Typography variant="h6" component="div">
              {work.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {work.year === null ? "" : "作曲年: " + work.year + "年"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {duration_time !== "" ? `演奏時間: ${duration_time}` : ""}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {workFormulaText ? "楽器編成: " + workFormulaText : ""}
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
          >
            <DragIndicatorIcon />
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
  );
}

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import { durationFormat } from "@/utils/calcTime";

import { useSetRecoilState, useRecoilValue } from "recoil";
import { workConcertState, concertsState } from "@/components/RecoilStates";
import { useSnackbar } from "notistack";

export default function AddMyConcert(props) {
  const { work, concertID, open, setOpen } = props;
  const concertList = useRecoilValue(concertsState);
  const concerts = useRecoilValue(workConcertState);
  const setConcerts = useSetRecoilState(workConcertState);
  const handleClose = () => setOpen(false);
  const { enqueueSnackbar } = useSnackbar();

  const [movementList, setMovementList] = useState([]);

  const checkedWorkMovements = (workID, concertID) => {
    const concert = concerts.find(
      (workConcert) =>
        workConcert.concert === concertID && workConcert.work === workID,
    );
    return concert ? concert.movements : [];
  };

  useEffect(() => {
    if (work && work.workMovements) {
      const checkedMovements = checkedWorkMovements(work.id, concertID);
      if (checkedMovements.length > 0) {
        setMovementList(checkedMovements);
      } else {
        setMovementList([...Array(work.workMovements.length)].map((_, i) => i));
      }
    }
  }, [work, concertID, concerts]);

  const totalDuration = movementList.reduce((sum, index) => {
    const durationStr = work.workMovementDuration[index]?.replace("'", "");
    return sum + (parseInt(durationStr, 10) || 0);
  }, 0);

  const formattedTotalDuration = durationFormat(totalDuration);

  const Submit = () => {
    const isAlreadyRegistered = concerts.some(
      (workConcert) =>
        workConcert.concert === concertID &&
        workConcert.work === work.id &&
        JSON.stringify(workConcert.movements.slice().sort()) ===
          JSON.stringify(movementList.slice().sort()),
    );

    const concertName = concertList.find(
      (concert) => concert.id === concertID,
    ).name;

    if (isAlreadyRegistered) {
      enqueueSnackbar(`${concertName}には既に追加されています`, {
        variant: "error",
      });
      return;
    }

    if (movementList.length === 0) {
      enqueueSnackbar("楽章が選択されていません", { variant: "error" });
      return;
    } else {
      setConcerts((workConcerts) => {
        const existingIndex = workConcerts.findIndex(
          (workConcert) =>
            workConcert.concert === concertID && workConcert.work === work.id,
        );

        if (existingIndex !== -1) {
          // 既存の要素を更新
          const updatedWorkConcerts = [...workConcerts];
          updatedWorkConcerts[existingIndex] = {
            concert: concertID,
            work: work.id,
            movements:
              movementList.length <= 1
                ? movementList
                : movementList.toSorted((a, b) => a - b),
          };
          enqueueSnackbar(`楽章を変更しました`, {
            variant: "success",
          });
          return updatedWorkConcerts;
        } else {
          enqueueSnackbar(`${concertName}に追加しました！`, {
            variant: "success",
          });
          // 新しい要素を追加
          return [
            ...workConcerts,
            {
              concert: concertID,
              work: work.id,
              movements:
                movementList.length <= 1
                  ? movementList
                  : movementList.toSorted((a, b) => a - b),
            },
          ];
        }
      });

      setOpen(false);
    }
  };

  if (!work || !work.workMovements) {
    return null; // work が null または workMovements が存在しない場合は何も表示しない
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogTitle id="modal-modal-title">
        {work.composer}／{work.title}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="body1" color="textSecondary">
              追加する楽章を選択してください。
            </Typography>
            <FormGroup>
              {work.workMovements.map((movement, index) => {
                const movementDuration = work.workMovementDuration[index];
                const formattedDuration = movementDuration
                  ? `（${durationFormat(
                      parseInt(movementDuration.replace("'", ""), 10),
                    )}）`
                  : "";

                return (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={movementList.includes(index)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMovementList((prev) => [...prev, index]);
                          } else {
                            setMovementList((prev) =>
                              prev.filter((m) => m !== index),
                            );
                          }
                        }}
                      />
                    }
                    label={`${movement} ${formattedDuration}`}
                  />
                );
              })}
            </FormGroup>
          </Grid>
          <Grid
            container
            justifyContent="center"
            alignItems="flex-end"
            flexDirection="column"
            size={12}
          >
            <Box>
              <Grid
                container
                flexDirection="column"
                justifyContent="center"
                alignItems="flex-start"
                columnSpacing={1}
                sx={{ order: { xs: 1, sm: 2 } }}
                size={12}
              >
                <Grid sx={{ order: { xs: 2, sm: 1 } }}>
                  <FormControlLabel
                    key="all"
                    control={
                      <Checkbox
                        checked={
                          movementList.length === work.workMovements.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMovementList(
                              [...Array(work.workMovements.length)].map(
                                (_, i) => i,
                              ),
                            );
                          } else {
                            setMovementList([]);
                          }
                        }}
                      />
                    }
                    label={
                      movementList.length === work.workMovements.length
                        ? "全て選択解除"
                        : "全て選択"
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Typography variant="caption" color="textSecondary">
          <Typography>合計時間: {formattedTotalDuration}</Typography>
        </Typography>
        <Button variant="outlined" onClick={handleClose}>
          キャンセル
        </Button>
        <Button variant="contained" onClick={Submit}>
          決定
        </Button>
      </DialogActions>
    </Dialog>
  );
}

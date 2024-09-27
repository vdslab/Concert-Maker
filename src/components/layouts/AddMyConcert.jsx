import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import { useSetRecoilState } from "recoil";
import { workConcertState } from "@/components/RecoilStates";
import { useSnackbar } from "notistack";

export default function AddMyConcert(props) {
  const { work, concertID, open, setOpen } = props;
  const setConcerts = useSetRecoilState(workConcertState);
  const handleClose = () => setOpen(false);
  const { enqueueSnackbar } = useSnackbar();

  const [movementList, setMovementList] = useState([]);

  useEffect(() => {
    if (work && work.workMovements) {
      setMovementList([...Array(work.workMovements.length)].map((_, i) => i));
    }
  }, [work]);

  const Submit = () => {
    if (movementList.length === 0) {
      enqueueSnackbar("楽章が選択されていません", { variant: "error" });
      return;
    } else {
      setConcerts((workConcerts) => {
        return [
          ...workConcerts.filter(
            (workConcert) =>
              !(
                workConcert.concert === concertID &&
                workConcert.work === work.id
              ),
          ),
          {
            concert: concertID,
            work: work.id,
            movements:
              movementList.length <= 1
                ? movementList
                : movementList.toSorted((a, b) => a - b),
          },
        ];
      });
      enqueueSnackbar("My演奏会に追加しました！", { variant: "success" });
      setOpen(false);
    }
  };

  if (!work || !work.workMovements) {
    return null; // work が null または workMovements が存在しない場合は何も表示しない
  }

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
          width: "75%",
          height: "60%",
          overflow: "auto",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box key={work.id}>
          <h2 key={work.id}>{work.title}</h2>
          <FormGroup>
            {work.workMovements.map((movement, index) => {
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
                            prev.filter((movement) => movement !== index),
                          );
                        }
                      }}
                    />
                  }
                  label={movement}
                />
              );
            })}
          </FormGroup>
        </Box>
        <Button onClick={Submit}>決定</Button>
      </Box>
    </Modal>
  );
}

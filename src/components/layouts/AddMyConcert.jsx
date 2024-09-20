import React, { useState, useEffect } from "react";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { workConcertState } from "@/pages/App";
import { addModal, modalConcertWork } from "@/components/layouts/SplitButton";

export default function AddMyConcert(props) {
  const node = props.node;
  console.log(node);
  const setConcerts = useSetRecoilState(workConcertState);
  const [open, setOpen] = useRecoilState(addModal);
  const concertWork = useRecoilValue(modalConcertWork);
  const handleClose = () => setOpen(false);

  const [movementList, setMovementList] = useState(
    [...Array(node.workMovements.length)].map((_, i) => i),
  );

  const Submit = () => {
    setConcerts((workConcerts) => {
      console.log(workConcerts);
      return [
        ...workConcerts.filter(
          (workConcert) =>
            !(
              workConcert.concert === concertWork.concert &&
              workConcert.work === concertWork.work
            ),
        ),
        {
          concert: concertWork.concert,
          work: concertWork.work,
          movements:
            movementList.length <= 1 ? movementList : movementList.sort(),
        },
      ];
    });
    setOpen(false);
  };

  const work = concertWork.work;

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
        <Box key={node.id}>
          <h2 key={node.id}>{node.title}</h2>
          <FormGroup>
            {node.workMovements.map((movement, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={true}
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
        <Button onClick={Submit}>Submit</Button>
      </Box>
    </Modal>
  );
}

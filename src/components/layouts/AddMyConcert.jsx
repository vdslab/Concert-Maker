import React, { useState } from "react";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";

import { useRecoilState, useSetRecoilState } from "recoil";
import Works from "@/assets/works_v03.json";

import { workConcertState } from "@/pages/App";
import { addModal, modalConcertWork } from "@/components/layouts/SplitButton";
import { Form } from "react-hook-form";

export default function AddMyConcert() {
  const setConcerts = useSetRecoilState(workConcertState);
  const [open, setOpen] = useRecoilState(addModal);
  const [concertWork, setConcertWork] = useRecoilState(modalConcertWork);
  const handleClose = () => setOpen(false);

  console.log("addMyConcert");

  const Submit = () => {
    setConcerts((workConcerts) => {
      if (
        workConcerts.some(
          (workConcert) =>
            workConcert.concert === concertID && workConcert.work === songID,
        )
      ) {
        return workConcerts
          .filter(
            (workConcert) =>
              workConcert.concert !== concertID || workConcert.work !== songID,
          )
          .push({ concert: concertID, work: songID });
      } else {
        return [...workConcerts, { concert: concertID, work: songID }];
      }
    });
    handleClose();
  };

  const work = Works.filter((work) => work.id === concertWork.work);

  if (work.length === 0) {
    handleClose();
    setConcerts((workConcerts) => {
      if (
        workConcerts.some(
          (workConcert) =>
            workConcert.concert === concertID && workConcert.work === songID,
        )
      ) {
        return workConcerts;
      } else {
        return [...workConcerts, { concert: concertID, work: songID }];
      }
    });
    return <div></div>;
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
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        {Works.filter((work) => work.id === concertWork.work).map((work) => (
          <Box>
            <h2 key={work.id}>{work.title}</h2>
            <FormGroup>
              {work.workMovements.map((movement, index) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={true}
                      key={index}
                      onChange={(event) => {
                        // setConcertWork({
                        //   concert: concert.id,
                        //   work: songID,
                        // });
                      }}
                    />
                  }
                  label={movement}
                />
              ))}
            </FormGroup>
          </Box>
        ))}
        <Button onClick={Submit}>Submit</Button>
      </Box>
    </Modal>
  );
}

import React from "react";
import { Button, ButtonGroup, Menu, MenuItem } from "@mui/material";
import AddMyConcert from "@/components/layouts/AddMyConcert";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
  concertsState,
  workConcertState,
  selectedConcertState,
} from "@/components/RecoilStates";

import { useRecoilValue, useSetRecoilState } from "recoil";

import { useSnackbar } from "notistack";

function SplitButton({ workId, node }) {
  const existMovements = !(
    node.workMovements.length <= 0 ||
    (node.workMovements.length === 1 && node.workMovements[0] === "")
  );
  const { enqueueSnackbar } = useSnackbar();

  const concerts = useRecoilValue(concertsState);

  const workConcerts = useRecoilValue(workConcertState);
  const setWorkConcerts = useSetRecoilState(workConcertState);

  const [openModal, setOpenModal] = React.useState(false);

  const [concertID, setConcertID] = React.useState("");

  const mainConcertID = useRecoilValue(selectedConcertState);
  const mainConcert = concerts.find((concert) => concert.id === mainConcertID);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const isAlreadyAdded = (concertId) => {
    return workConcerts.some(
      (workConcert) =>
        workConcert.concert === concertId && workConcert.work === workId
    );
  };

  const addWorkToConcert = (concertID, workID, concertName) => {
    const notYetAdded = !isAlreadyAdded(concertID);
    if (notYetAdded) {
      setWorkConcerts((workConcerts) => {
        return [
          ...workConcerts.filter(
            (workConcert) =>
              !(
                workConcert.concert === concertID && workConcert.work === workID
              )
          ),
          {
            concert: concertID,
            work: workID,
            movements: [],
          },
        ];
      });
      enqueueSnackbar(`${concertName}に追加しました！`, { variant: "success" });
    } else {
      enqueueSnackbar(`${concertName}には既に追加されています。`, {
        variant: "error",
      });
    }
  };

  const handleMenuItemClick = (event, concertId, concertName) => {
    if (existMovements) {
      setOpenModal(true);
      setConcertID(concertId);
    } else {
      addWorkToConcert(concertId, workId, concertName);
    }
    handleClose(event);
  };

  return (
    <React.Fragment>
      <AddMyConcert
        work={node}
        open={openModal}
        setOpen={setOpenModal}
        concertID={concertID}
      />
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        <Button
          onClick={(e) => {
            if (existMovements) {
              setOpenModal(true);
              setConcertID(mainConcert.id);
            } else {
              addWorkToConcert(mainConcert.id, workId, mainConcert.name);
            }
            e.stopPropagation();
          }}
        >
          {mainConcert.name}に追加
        </Button>
        {concerts.length > 1 && (
          <Button
            size="small"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        )}
      </ButtonGroup>
      <Menu
        id="split-button-menu"
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
      >
        {concerts
          .filter((concert) => concert.id !== mainConcertID)
          .map(({ id, name }) => (
            <MenuItem
              key={id}
              onClick={(event) => {
                handleMenuItemClick(event, id, name);
              }}
            >
              {name}
            </MenuItem>
          ))}
      </Menu>
    </React.Fragment>
  );
}

export default SplitButton;

import React from "react";
import { Button, ButtonGroup, Menu, MenuItem } from "@mui/material";
import AddMyConcert from "@/components/layouts/AddMyConcert";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { useSnackbar } from "notistack";

import { v4 as randomUUID } from "uuid";

import { useRecoilState } from "recoil";
import {
  concertsState,
  workConcertState,
  selectedConcertState,
} from "@/components/RecoilStates";

function SplitButton({ workId, node }) {
  const existMovements = !(
    node.workMovements.length <= 0 ||
    (node.workMovements.length === 1 && node.workMovements[0] === "")
  );

  const [concerts, setConcerts] = useRecoilState(concertsState);
  const [mainConcertID, setSelectedConcert] =
    useRecoilState(selectedConcertState);

  const { enqueueSnackbar } = useSnackbar();

  const [workConcerts, setWorkConcerts] = useRecoilState(workConcertState);

  const [openModal, setOpenModal] = React.useState(false);

  const [concertID, setConcertID] = React.useState("");

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

  const addWorkToConcert = (concertID, concertName, workID) => {
    const isAlreadyAdded = (concertId) => {
      return workConcerts.some(
        (workConcert) =>
          workConcert.concert === concertId && workConcert.work === workID
      );
    };

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
      enqueueSnackbar(`${concertName}には既に追加されています`, {
        variant: "error",
      });
    }
  };

  const handleMenuItemClick = (event, concertId, concertName) => {
    event.preventDefault();
    event.stopPropagation();
    if (existMovements) {
      setOpenModal(true);
      setConcertID(concertId);
    } else {
      addWorkToConcert(concertId, concertName, workId);
    }
    handleClose(event);
  };

  const clickHandler = (e) => {
    if (mainConcert === undefined) {
      const newConcertId = randomUUID();
      const concertName = "My演奏会";

      setConcerts((concerts) => [
        ...concerts,
        { id: newConcertId, name: concertName },
      ]);

      setConcertID(newConcertId);

      setSelectedConcert(newConcertId);

      if (existMovements) {
        setOpenModal(true);
      } else {
        addWorkToConcert(newConcertId, concertName, workId);
      }
    } else {
      if (existMovements) {
        setOpenModal(true);
        setConcertID(mainConcert.id);
      } else {
        addWorkToConcert(mainConcert.id, mainConcert.name, workId);
      }
    }
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
        <Button onClick={clickHandler}>
          {mainConcert === undefined
            ? "My演奏会を作成して追加"
            : `${mainConcert.name}に追加`}
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

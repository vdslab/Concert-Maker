import React from "react";
import { Button, ButtonGroup, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { concertsState, selectedConcertState } from "@/pages/App";

import { atom, useRecoilValue, useSetRecoilState } from "recoil";

export const addModal = atom({
  key: "addModal",
  default: false,
});

export const modalConcertWork = atom({
  key: "concertWork",
  default: { concert: "", work: "" },
});

function SplitButton({ workId }) {
  const concerts = useRecoilValue(concertsState);
  const mainConcertID = useRecoilValue(selectedConcertState);

  const setAddModal = useSetRecoilState(addModal);
  const setConcertWork = useSetRecoilState(modalConcertWork);

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

  const handleMenuItemClick = (event, concertID) => {
    event.preventDefault();
    event.stopPropagation();
    setAddModal(true);
    setConcertWork({ concert: concertID, work: workId });
    handleClose(event);
  };

  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        <Button
          onClick={(e) => {
            setAddModal(true);
            setConcertWork({ concert: mainConcert.id, work: workId });
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
                handleMenuItemClick(event, id);
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

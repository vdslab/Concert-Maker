import React from "react";
import { Button, ButtonGroup, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
  concertsState,
  workConcertState,
  selectedConcertState,
} from "@/pages/App";
import { useRecoilValue, useSetRecoilState } from "recoil";

function SplitButton({ songId }) {
  const concerts = useRecoilValue(concertsState);
  const mainConcertID = useRecoilValue(selectedConcertState);
  const setConcerts = useSetRecoilState(workConcertState);

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

  const handleMenuItemClick = (event, concertName) => {
    event.preventDefault();
    event.stopPropagation();
    addMyConcert(concertName, songId);
    handleClose(event);
  };

  const addMyConcert = (concertID, songID) => {
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
            addMyConcert(mainConcert.id, songId);
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
              onClick={(event) => handleMenuItemClick(event, id)}
            >
              {name}
            </MenuItem>
          ))}
      </Menu>
    </React.Fragment>
  );
}

export default SplitButton;

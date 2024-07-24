import React from "react";
import { Button, ButtonGroup, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { concertNamesState, concertsState } from "@/pages/App";
import { useRecoilValue, useSetRecoilState } from "recoil";

function SplitButton({ songId }) {
  const concertNames = useRecoilValue(concertNamesState);
  const setConcerts = useSetRecoilState(concertsState);

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

  const addMyConcert = (concertName, songID) => {
    setConcerts((concerts) => {
      const newConcerts = concerts.map((concert) => {
        if (concert.name === concertName) {
          return {
            ...concert,
            works: new Set([...Array.from(concert.works), songID]),
          };
        }
        return concert;
      });
      return newConcerts;
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
            addMyConcert(concertNames[0], songId);
            e.stopPropagation();
          }}
        >
          {concertNames[0]}に追加
        </Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Menu
        id="split-button-menu"
        anchorEl={anchorRef.current}
        open={open}
        onClose={handleClose}
      >
        {concertNames.map((concertName) => (
          <MenuItem
            key={concertName}
            onClick={(event) => handleMenuItemClick(event, concertName)}
          >
            {concertName}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

export default SplitButton;

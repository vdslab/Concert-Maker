import React from "react";
import { Button, ButtonGroup, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MyConcert from "@/utils/myConcert";

function SplitButton({ songId }) {
  const concertNames = MyConcert.getConcerts().map((concert) => concert.name);
  if (concertNames.length === 0) {
    MyConcert.createConcert("My演奏会");
    concertNames.push("My演奏会");
  }

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
    MyConcert.saveWork(songId, concertName);
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
            MyConcert.saveWork(songId, concertNames[0]);
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

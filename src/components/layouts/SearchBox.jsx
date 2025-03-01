import React, { useState, useEffect, useRef, forwardRef } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Autocomplete from "@mui/material/Autocomplete";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import FilterDialog from "@/components/layouts/FilterDialog";

/**
 * 検索ボックスのコンポーネントです。
 *
 * @returns {JSX.Element}
 */
export default function SearchBox({ Data, setData, setClickedNodeId }) {
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const openPopper = () => setOpen(true);
  const closePopper = () => setOpen(false);

  const [options, setOptions] = useState([]);
  const { nodes } = Data;

  useEffect(() => {
    setOptions(
      nodes?.map((item) => item.name).sort((a, b) => a.localeCompare(b)) || []
    );
  }, [nodes]);

  const handleInputChange = (event, newInputValue) => {
    newInputValue === "" ? closePopper() : openPopper();
    const searchedObject = nodes.find((item) => item.name === newInputValue);
    if (searchedObject) {
      setClickedNodeId(searchedObject.id);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: { xs: "calc(100% - 20px)", sm: 400 },
        borderRadius: open ? "16px" : "100vh",
        overflow: "hidden",
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: 2,
      }}
    >
      <ClickAwayListener onClickAway={closePopper}>
        <Autocomplete
          freeSolo
          options={options}
          onInputChange={handleInputChange}
          fullWidth
          open={open}
          onOpen={() => {
            if (inputRef.current.value !== "") openPopper();
          }}
          onClose={closePopper}
          PopperComponent={(
            { disablePortal: _1, anchorEl: _2, open: _3, ...other } // disablePortal, anchorEl, openは読み捨てる
          ) => (
            <Box
              {...other}
              style={{ width: "100%" }}
              sx={{ borderTop: "1px solid #eaecef" }}
            />
          )}
          PaperComponent={(props) => <Box {...props} />}
          ListboxComponent={forwardRef((props, ref) => (
            <Box {...props} ref={ref} component="ul" />
          ))}
          renderInput={(params) => (
            <Box sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}>
              <TextField
                {...params}
                inputRef={inputRef}
                placeholder="作品を検索する"
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pl: "10px" }}>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                }}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <FilterDialog Data={Data} setData={setData} />
            </Box>
          )}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return (
              <li key={key} {...optionProps} style={{ padding: "8px 16px" }}>
                <Box>{option}</Box>
              </li>
            );
          }}
        />
      </ClickAwayListener>
    </Paper>
  );
}

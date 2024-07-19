import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Autocomplete from "@mui/material/Autocomplete";
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
export default function SearchBox({ Data = [], setClicknode }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(Data.map((item) => item.name));
  }, [Data]);

  const handleInputChange = (event, newInputValue) => {
    const searchedObject = Data.find((item) => item.name === newInputValue);
    if (searchedObject) setClicknode(searchedObject);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 400,
        borderRadius: "100vh",
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: 1,
      }}
    >
      <Autocomplete
        freeSolo
        options={options}
        onInputChange={handleInputChange}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="作品を検索する"
            variant="standard"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              disableUnderline: true,
            }}
          />
        )}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <FilterDialog />
    </Paper>
  );
}

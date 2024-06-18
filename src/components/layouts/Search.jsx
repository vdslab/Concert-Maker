import React, { useState } from "react";
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

function SearchPopup() {
  const [open, setOpen] = useState(true);
  const [composerName, setComposerName] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = () => {
    console.log(`Searching for: ${composerName}`);
    // ここで検索処理を実装します
    handleClose();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Button
        variant="contained"
        startIcon={<SearchIcon />}
        onClick={handleClickOpen}
      >
        Advanced Search
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="sm">
        <DialogTitle>検索</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{ py: 2 }}>
          <Autocomplete
            options={names}
            onChange={(event, value) => {
              setComposerName(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="作曲者名" variant="outlined" />
            )}
          />
          <Stack
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            sx={{ my: 2 }}
          >
            <TextField label="生年" variant="outlined" type="number" />
            <span>〜</span>
            <TextField label="没年" variant="outlined" type="number" />
          </Stack>
          <TextField label="曲名" variant="outlined" />
          <Stack
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            sx={{ my: 2 }}
          >
            <TextField label="作曲年" variant="outlined" type="number" />
            <span>〜</span>
            <TextField label="作曲年" variant="outlined" type="number" />
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            sx={{ my: 2 }}
          >
            <TextField label="演奏時間(min)" variant="outlined" type="number" />
            <span>〜</span>
            <TextField label="演奏時間(max)" variant="outlined" type="number" />
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ my: 2 }}>
            <Checkbox />
            <Typography variant="body2">
              演奏時間データのない項目も表示する
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleSearch}>検索</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SearchPopup;

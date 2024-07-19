import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TuneIcon from "@mui/icons-material/Tune";
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';

/**
 * 検索フィルターのダイアログのコンポーネントです。
 * 
 * @returns {JSX.Element}
 */
export default function FilterDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="検索オプション">
        <IconButton color="primary" sx={{ p: "10px" }} aria-label="検索オプション" onClick={handleClickOpen}>
          <TuneIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>検索オプション</DialogTitle>
        <IconButton
          aria-label="閉じる"
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
        <DialogContent>
          <DialogContentText>
            テストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテスト
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="reset" variant="text" sx={{ borderRadius: "100vh" }}>リセット</Button>
          <Button type="submit" variant="contained" sx={{ borderRadius: "100vh" }}>検索</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

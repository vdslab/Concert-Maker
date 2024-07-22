import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import FilterDialog from "@/components/layouts/FilterDialog";

/**
 * 検索ボックスのコンポーネントです。
 *
 * @param {Object} props - コンポーネントのpropsを格納するオブジェクトです。
 * @param {Object} props.Data - ネットワークのノードリンクデータを保持するstate変数のオブジェクトです。
 * @param {function} props.setData - state変数Dataを更新する関数です。
 * @returns {JSX.Element}
 */
export default function SearchBox({ Data, setData }) {
  return (
    <Paper
      component="form"
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
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="作品を検索する"
        inputProps={{ "aria-label": "作品を検索する" }}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <FilterDialog Data={Data} setData={setData} />
    </Paper>
  );
}

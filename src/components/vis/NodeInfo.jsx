import React from "react";
import { Paper, Divider } from "@mui/material";
import { styled } from "@mui/system";
import BasicInfomation from "./BasicInfomation";
import DetailInfomation from "./DetailInfomation";
import SongPlayedTogether from "./SongsPlayedTogether";
import MusicButton from "./MusicButton";

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "30px",
  left: "10px",
  width: "400px",
  height: "calc(100vh - 100px)",
  // maxHeight: "calc(100vh - 100px)",
  overflowY: "auto",
}));

const NodeInfo = ({ node, onClose, Data, setClicknode }) => {
  if (!node) return null;

  console.log(node);

  return (
    <StyledPaper>
      <BasicInfomation node={node} onClose={onClose} />
      <Divider />
      <DetailInfomation node={node} />
      <Divider />
      <MusicButton node={node} />
      <Divider />
      <SongPlayedTogether node={node} Data={Data} setClicknode={setClicknode} />
    </StyledPaper>
  );
};

export default NodeInfo;

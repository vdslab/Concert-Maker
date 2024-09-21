import React, { useCallback } from "react";
import { Paper, Divider } from "@mui/material";
import { styled } from "@mui/system";
import BasicInfomation from "./BasicInfomation";
import DetailInfomation from "./DetailInfomation";
import SongPlayedTogether from "./SongsPlayedTogether";
import MusicButton from "./MusicButton";
import AddMyConcert from "@/components/layouts/AddMyConcert";

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "70px",
  left: "10px",
  width: "400px",
  height: "calc(100vh - 140px)",
  overflowY: "scroll",
}));

const NodeInfo = ({ node, Data, setClicknode }) => {
  const handleCloseInfo = useCallback(() => {
    setClicknode(null);
  }, [setClicknode]);

  if (!node) return null;

  return (
    <div>
      <AddMyConcert
        node={node}
      />
      <StyledPaper key={node.id}>
        <BasicInfomation node={node} onClose={handleCloseInfo} />
        <Divider />
        <DetailInfomation node={node} />
        <Divider />
        <MusicButton node={node} />
        <Divider />
        <SongPlayedTogether
          node={node}
          Data={Data}
          setClicknode={setClicknode}
        />
      </StyledPaper>
    </div>
  );
};

export default NodeInfo;

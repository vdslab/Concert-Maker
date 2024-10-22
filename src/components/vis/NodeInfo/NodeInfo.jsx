import React, { useCallback } from "react";
import { Paper, Divider } from "@mui/material";
import { styled } from "@mui/system";
import BasicInfomation from "./BasicInfomation";
import DetailInfomation from "./DetailInfomation";
import SongPlayedTogether from "./SongsPlayedTogether";
import MusicButton from "./MusicButton";

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "70px",
  left: "10px",
  width: "400px",
  height: "calc(100vh - 140px)",
  overflowY: "scroll",
}));

const NodeInfo = (props) => {
  const { Data, node, setClickNodeId } = props;
  const handleCloseInfo = useCallback(() => {
    setClickNodeId(null);
  }, [setClickNodeId]);

  if (!node) return null;

  return (
    <div>
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
          setClickNodeId={setClickNodeId}
        />
      </StyledPaper>
    </div>
  );
};

export default NodeInfo;

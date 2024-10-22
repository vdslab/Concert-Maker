import React, { useCallback, useState } from "react";
import { Paper, Divider, Box } from "@mui/material";
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
  const { Data, node, setClickedNodeId } = props;
  const [isScrolled, setIsScrolled] = useState(false);

  const handleCloseInfo = useCallback(() => {
    setClickedNodeId(null);
  }, [setClickedNodeId]);

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 10);
  };

  if (!node) return null;

  return (
    <div>
      <StyledPaper key={node.id} onScroll={handleScroll}>
        <BasicInfomation
          node={node}
          onClose={handleCloseInfo}
          showBorder={isScrolled}
        />
        <Divider />
        <DetailInfomation node={node} />
        <Divider />
        <MusicButton node={node} />
        <Divider />
        <SongPlayedTogether
          node={node}
          Data={Data}
          setClickedNodeId={setClickedNodeId}
        />
      </StyledPaper>
    </div>
  );
};

export default NodeInfo;

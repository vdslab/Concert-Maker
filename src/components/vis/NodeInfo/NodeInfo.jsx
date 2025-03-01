import React, { useCallback, useState } from "react";
import { Paper, Divider, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import BasicInfomation from "@/components/vis/NodeInfo/BasicInfomation";
import DetailInfomation from "@/components/vis/NodeInfo/DetailInfomation";
import SongPlayedTogether from "@/components/vis/NodeInfo/SongPlayedTogether";
import MusicButton from "@/components/vis/NodeInfo/MusicButton";
import SiteButton from "@/components/vis/NodeInfo/SiteButton";

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isMobile",
})(({ theme, isMobile }) => ({
  position: isMobile ? "relative" : "absolute",
  top: isMobile ? 0 : "70px",
  left: isMobile ? 0 : "10px",
  width: isMobile ? "100%" : "400px",
  height: isMobile ? "100%" : "calc(100vh - 140px)",
  overflowY: "scroll",
}));

const NodeInfo = (props) => {
  const { Data, node, setClickedNodeId } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isScrolled, setIsScrolled] = useState(false);

  const handleClose = useCallback(() => {
    setClickedNodeId(null);
  }, [setClickedNodeId]);

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 10);
  };

  return (
    <StyledPaper isMobile={isMobile} key={node.id} onScroll={handleScroll}>
      <BasicInfomation
        node={node}
        onClose={handleClose}
        showBorder={isScrolled}
      />
      <Divider />
      <DetailInfomation node={node} />
      <Divider />
      <MusicButton node={node} />
      <Divider />
      <SiteButton node={node} />
      <Divider />
      <SongPlayedTogether
        node={node}
        Data={Data}
        setClickedNodeId={setClickedNodeId}
      />
    </StyledPaper>
  );
};

export default NodeInfo;

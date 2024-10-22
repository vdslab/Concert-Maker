import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box } from "@mui/material";
import ForceGraphWrapper from "./ForceGraphWrapper";
import SearchBox from "../layouts/SearchBox";
import NodeInfo from "./NodeInfo/NodeInfo";

const NodeLinkDiagram = (props) => {
  const { clickNodeId, setClickNodeId, graphData, setGraphData } = props;
  const [clickNode, setClickNode] = useState(null);
  const [height, setHeight] = useState(0);
  const parentDivRef = useRef(null);

  useEffect(() => {
    const updateHeight = () => {
      if (parentDivRef.current) {
        setHeight(parentDivRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const updateGraphData = useCallback((newData) => {
    setGraphData((prevData) => ({
      ...prevData,
      ...newData,
      links: newData.links.map((link) => ({
        ...link,
        source: typeof link.source === "object" ? link.source.id : link.source,
        target: typeof link.target === "object" ? link.target.id : link.target,
      })),
    }));
  }, []);

  useEffect(() => {
    if (clickNodeId) {
      const node = graphData.nodes.find((node) => node.id === clickNodeId);
      if (node) setClickNode(node);
    } else setClickNode(null);
  }, [clickNodeId]);

  return (
    <Box ref={parentDivRef} position="relative" height="100%">
      <ForceGraphWrapper
        data={graphData}
        height={height}
        clicknode={clickNode}
        setClickNodeId={setClickNodeId}
      />
      <SearchBox
        Data={graphData}
        setData={updateGraphData}
        setClickNodeId={setClickNodeId}
      />
      <NodeInfo
        node={clickNode}
        Data={graphData}
        setClickNodeId={setClickNodeId}
      />
    </Box>
  );
};

export default NodeLinkDiagram;

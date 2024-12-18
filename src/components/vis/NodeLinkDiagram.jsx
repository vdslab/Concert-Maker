import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box } from "@mui/material";
import ForceGraphWrapper from "./ForceGraphWrapper";
import SearchBox from "../layouts/SearchBox";
import NodeInfo from "./NodeInfo/NodeInfo";

const NodeLinkDiagram = (props) => {
  const { clickedNodeId, setClickedNodeId, graphData, setGraphData } = props;
  const [clickNode, setClickNode] = useState(null);
  const [height, setHeight] = useState(0);
  const parentDivRef = useRef(null);

  console.log("clickNode", clickNode);
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
    if (clickedNodeId) {
      const node = graphData.nodes.find((node) => node.id === clickedNodeId);
      if (node) setClickNode(node);
    } else setClickNode(null);
  }, [clickedNodeId]);

  return (
    <Box ref={parentDivRef} position="relative" height="100%">
      <ForceGraphWrapper
        data={graphData}
        height={height}
        clicknode={clickNode}
        setClickedNodeId={setClickedNodeId}
      />
      <SearchBox
        Data={graphData}
        setData={updateGraphData}
        setClickedNodeId={setClickedNodeId}
      />
      <NodeInfo
        node={clickNode}
        Data={graphData}
        setClickedNodeId={setClickedNodeId}
      />
    </Box>
  );
};

export default NodeLinkDiagram;

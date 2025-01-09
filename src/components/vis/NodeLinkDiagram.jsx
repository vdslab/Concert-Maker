import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import ForceGraphWrapper from "./ForceGraphWrapper";
import SearchBox from "../layouts/SearchBox";
import NodeInfo from "./NodeInfo/NodeInfo";

const NodeLinkDiagram = (props) => {
  const { clickedNodeId, setClickedNodeId, graphData, setGraphData } = props;
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

  // props.graphDataの値変更だけではclickNodeは不変のため、メモ化しておく
  const clickNode = useMemo(() => {
    return clickedNodeId
      ? graphData.nodes.find((node) => node.id === clickedNodeId)
      : null;
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
      {clickedNodeId &&
        <>
          <div style={{ position: "absolute", top: "70px", left: "10px", height: "calc(100vh - 140px)", width: "calc(100% - 20px)", zIndex: "-1" }} data-tour-id="a-02">
          </div>
          <NodeInfo
            node={clickNode}
            Data={graphData}
            setClickedNodeId={setClickedNodeId}
          />
        </>}
    </Box>
  );
};

export default NodeLinkDiagram;

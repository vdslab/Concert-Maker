import React, {
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  useMemo,
} from "react";
import { Box } from "@mui/material";
import ForceGraphWrapper from "./ForceGraphWrapper";
import SearchBox from "../layouts/SearchBox";
import NodeInfo from "./NodeInfo/NodeInfo";

const NodeLinkDiagram = (props) => {
  const { clickedNodeId, setClickedNodeId, graphData, setGraphData } = props;
  const [clickNode, setClickNode] = useState(null);
  const [height, setHeight] = useState(0);
  const parentDivRef = useRef(null);

  const updateHeight = useCallback(() => {
    if (parentDivRef.current) {
      setHeight(parentDivRef.current.offsetHeight);
    }
  }, []);

  useLayoutEffect(() => {
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [updateHeight]);

  const updateGraphData = useCallback(
    (newData) => {
      setGraphData((prevData) => ({
        ...prevData,
        ...newData,
        links: newData.links.map((link) => ({
          ...link,
          source:
            typeof link.source === "object" ? link.source.id : link.source,
          target:
            typeof link.target === "object" ? link.target.id : link.target,
        })),
      }));
    },
    [setGraphData],
  );

  const clickNodeMemo = useMemo(() => {
    if (clickedNodeId) {
      return graphData.nodes.find((node) => node.id === clickedNodeId) || null;
    }
    return null;
  }, [clickedNodeId, graphData.nodes]);

  return (
    <Box ref={parentDivRef} position="relative" height="100%">
      <ForceGraphWrapper
        data={graphData}
        height={height}
        clicknode={clickNodeMemo}
        setClickedNodeId={setClickedNodeId}
      />
      <SearchBox
        Data={graphData}
        setData={updateGraphData}
        setClickedNodeId={setClickedNodeId}
      />
      <NodeInfo
        node={clickNodeMemo}
        Data={graphData}
        setClickedNodeId={setClickedNodeId}
      />
    </Box>
  );
};

export default NodeLinkDiagram;

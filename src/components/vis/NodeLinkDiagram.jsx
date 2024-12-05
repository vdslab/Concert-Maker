import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Box } from "@mui/material";
import ForceGraphWrapper from "./ForceGraphWrapper";
import SearchBox from "../layouts/SearchBox";
import NodeInfo from "./NodeInfo/NodeInfo";

const NodeLinkDiagram = ({
  clicknode,
  setClicknode,
  graphData,
  setGraphData,
}) => {
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

  return (
    <Box ref={parentDivRef} position="relative" height="100%">
      <ForceGraphWrapper
        data={graphData}
        height={height}
        clicknode={clicknode}
        setClicknode={setClicknode}
      />
      <SearchBox
        Data={graphData}
        setData={updateGraphData}
        setClicknode={setClicknode}
      />
      <NodeInfo node={clicknode} Data={graphData} setClicknode={setClicknode} />
    </Box>
  );
};

export default NodeLinkDiagram;

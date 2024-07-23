import React, { useEffect, useRef, useState, useMemo } from "react";
import { Box } from "@mui/material";
import { processData, createGraphData } from "./DataProcessing";
import ForceGraphWrapper from "./ForceGraphWrapper";
import SearchBox from "../layouts/SearchBox";
import NodeInfo from "./NodeInfo/NodeInfo";

const NodeLinkDiagram = () => {
  const [Data, setData] = useState([]);
  const [clicknode, setClicknode] = useState(null);
  const [height, setHeight] = useState(0);
  const parentDivRef = useRef(null);

  const { allPlayedWithWorkIds, linkData } = useMemo(() => processData(), []);
  const data = useMemo(
    () => createGraphData(allPlayedWithWorkIds, linkData),
    [allPlayedWithWorkIds, linkData]
  );

  useEffect(() => {
    setData(data);
  }, [data, setData]);

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

  return (
    <Box ref={parentDivRef} position="relative" height="100%">
      <ForceGraphWrapper
        data={data}
        height={height}
        clicknode={clicknode}
        setClicknode={setClicknode}
      />
      <SearchBox Data={Data} setData={setData} />
      <NodeInfo node={clicknode} Data={Data} setClicknode={setClicknode} />
    </Box>
  );
};

export default NodeLinkDiagram;

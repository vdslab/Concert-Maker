import "./App.css";
import Box from "@mui/material/Box";
import NodeLinkDiagram from "@/components/vis/NodeLinkDiagram";
import MyConcertCardList from "@/components/layouts/MyConcertCardList";

import { useState, useMemo } from "react";
import { processData, createGraphData } from "@/components/vis/DataProcessing";

import Share from "@/components/layouts/MyConcert/Share.jsx";

function PC() {
  const [clickedNodeId, setClickedNodeId] = useState(null);
  const { linkData } = useMemo(() => processData(), []);
  const [graphData, setGraphData] = useState(() => createGraphData(linkData));

  return (
    <div className="container">
      <Share />
      <Box width={2 / 3} className="left-half" sx={{ position: "relative" }}>
        <NodeLinkDiagram
          clickedNodeId={clickedNodeId}
          setClickedNodeId={setClickedNodeId}
          graphData={graphData}
          setGraphData={setGraphData}
        />
      </Box>
      <Box width={1 / 3} className="right-half" sx={{ overflow: "auto" }}>
        <MyConcertCardList
          Data={graphData}
          setClickedNodeId={setClickedNodeId}
        />
      </Box>
    </div>
  );
}

export default PC;

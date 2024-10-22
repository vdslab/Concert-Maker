import "./App.css";
import Box from "@mui/material/Box";
import NodeLinkDiagram from "@/components/vis/NodeLinkDiagram";
import MyConcertCardList from "@/components/layouts/MyConcertCardList";

import { useState, useMemo } from "react";
import { processData, createGraphData } from "@/components/vis/DataProcessing";

function App() {
  const [clickNodeId, setClickNodeId] = useState(null);
  const { allPlayedWithWorkIds, linkData } = useMemo(() => processData(), []);
  const [graphData, setGraphData] = useState(() =>
    createGraphData(allPlayedWithWorkIds, linkData, [])
  );

  return (
    <div className="container">
      <Box width={2 / 3} className="left-half" sx={{ position: "relative" }}>
        <NodeLinkDiagram
          clickNodeId={clickNodeId}
          setClickNodeId={setClickNodeId}
          graphData={graphData}
          setGraphData={setGraphData}
        />
      </Box>
      <Box width={1 / 3} className="right-half" sx={{ overflow: "auto" }}>
        <MyConcertCardList Data={graphData} setClickNodeId={setClickNodeId} />
      </Box>
    </div>
  );
}

export default App;

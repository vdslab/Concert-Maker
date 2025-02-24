import "./App.css";
import { useTheme, useMediaQuery } from "@mui/material";
import PC from "@/pages/PC";
import Mobile from "@/pages/Mobile";

import { useState, useMemo } from "react";
import { processData, createGraphData } from "@/components/vis/DataProcessing";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [clickedNodeId, setClickedNodeId] = useState(null);
  const { linkData } = useMemo(() => processData(), []);
  const [graphData, setGraphData] = useState(() => createGraphData(linkData));

  if (isMobile) {
    return (
      <Mobile
        clickedNodeId={clickedNodeId}
        setClickedNodeId={setClickedNodeId}
        graphData={graphData}
        setGraphData={setGraphData}
      />
    );
  } else {
    return (
      <PC
        clickedNodeId={clickedNodeId}
        setClickedNodeId={setClickedNodeId}
        graphData={graphData}
        setGraphData={setGraphData}
      />
    );
  }
}

export default App;

import "./App.css";
import Box from "@mui/material/Box";
import NodeLinkDiagram from "@/components/vis/NodeLinkDiagram";
import MyConcertCardList from "@/components/layouts/MyConcertCardList";

import Share from "@/components/layouts/MyConcert/Share.jsx";

function PC(props) {
  const { linkData, clickedNodeId, setClickedNodeId, graphData, setGraphData } =
    props;
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

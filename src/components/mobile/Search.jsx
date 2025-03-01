import React from "react";
import NodeLinkDiagram from "../vis/NodeLinkDiagram";

function Search(props) {
  const { clickedNodeId, setClickedNodeId, graphData, setGraphData } = props;

  return (
    <div>
      <NodeLinkDiagram
        clickedNodeId={clickedNodeId}
        setClickedNodeId={setClickedNodeId}
        graphData={graphData}
        setGraphData={setGraphData}
      />
    </div>
  );
}

export default Search;

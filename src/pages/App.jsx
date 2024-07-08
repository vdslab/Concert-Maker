import { useState } from "react";
import "./App.css";
import NodeLinkDiagram from "../components/vis/NodeLinkDiagram";
import DetailCard from "../components/layouts/DetailCard";

function App() {
  const [clicknode, setClicknode] = useState(null);
  const [Data, setData] = useState([]);

  return (
    <>
      <div className="container">
        <div className="left-half">
          <NodeLinkDiagram setClicknode={setClicknode} setData={setData} />
        </div>
        <div className="right-half">
          <DetailCard clicknode={clicknode} />
        </div>
      </div>
    </>
  );
}

export default App;

import { useState } from "react";
import "./App.css";
import NodeLinkDiagram from "../components/vis/NodeLinkDiagram";
import DetailCardList from "../components/layouts/DetailCardList";

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
          <DetailCardList clicknode={clicknode} Data={Data} />
        </div>
      </div>
    </>
  );
}

export default App;

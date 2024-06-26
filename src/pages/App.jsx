import { useState } from "react";
import "./App.css";
import NodeLinkDiagram from "../components/vis/NodeLinkDiagram";
import DetailCard from "../components/layouts/DetailCard";

function App() {
  return (
    <>
      <div className="container">
        <div className="left-half">
          <NodeLinkDiagram />
        </div>
        <div className="right-half">
          <DetailCard />
          <DetailCard />
          <DetailCard />
          <DetailCard />
          <DetailCard />
        </div>
      </div>
    </>
  );
}

export default App;

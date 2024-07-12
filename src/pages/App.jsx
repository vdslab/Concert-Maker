import { useState } from "react";
import "./App.css";
import Box from "@mui/material/Box";
import NodeLinkDiagram from "../components/vis/NodeLinkDiagram";
import DetailCardList from "../components/layouts/DetailCardList";

function App() {
  const [clicknode, setClicknode] = useState(null);
  const [Data, setData] = useState([]);
  return (
    <>
      <div className="container">
        <Box width={2 / 3} className="left-half">
          <NodeLinkDiagram setClicknode={setClicknode} setData={setData} />
        </Box>
        <Box width={1 / 3} className="right-half">
          {/* <DetailCardList clicknode={clicknode} Data={Data} /> */}
          <p>hello</p>
        </Box>
      </div>
    </>
  );
}

export default App;

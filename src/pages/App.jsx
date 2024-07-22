import "./App.css";
import { useState } from "react";
import Box from "@mui/material/Box";
import SearchBox from "@/components/layouts/SearchBox";
import NodeLinkDiagram from "../components/vis/NodeLinkDiagram";
import MyConcertCardList from "@/components/layouts/MyConcertCardList";

function App() {
  const [clicknode, setClicknode] = useState(null);
  const [Data, setData] = useState([]);
  return (
    <>
      <div className="container">
        <Box width={2 / 3} className="left-half" sx={{ position: "relative" }}>
          <SearchBox Data={Data} setData={setData} />
          <NodeLinkDiagram
            clicknode={clicknode}
            setClicknode={setClicknode}
            Data={Data}
            setData={setData}
          />
        </Box>
        <Box width={1 / 3} className="right-half" sx={{ overflow: "auto" }}>
          <MyConcertCardList />
        </Box>
      </div>
    </>
  );
}

export default App;

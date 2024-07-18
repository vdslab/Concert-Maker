import "./App.css";
import Box from "@mui/material/Box";
import NodeLinkDiagram from "../components/vis/NodeLinkDiagram";
import MyConcertCardList from "@/components/layouts/MyConcertCardList";

function App() {
  return (
    <>
      <div className="container">
        <Box width={2 / 3} className="left-half">
          <NodeLinkDiagram />
        </Box>
        <Box width={1 / 3} className="right-half">
          {/* <DetailCardList clicknode={clicknode} Data={Data} /> */}
          <MyConcertCardList />
        </Box>
      </div>
    </>
  );
}

export default App;

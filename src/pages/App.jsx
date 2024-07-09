import { useState } from "react";
import "./App.css";

import Box from "@mui/material/Box";

import DetailCard from "@/components/layouts/DetailCard";
import SearchTabs from "@/components/layouts/SearchTabs";

function App() {
  const [clicknode, setClicknode] = useState(null);
  return (
    <>
      <div className="container">
        <Box width={2 / 3}>
          <SearchTabs setClicknode={setClicknode} />
        </Box>
        <Box width={1 / 3}>
          <DetailCard clicknode={clicknode} />
        </Box>
      </div>
    </>
  );
}

export default App;

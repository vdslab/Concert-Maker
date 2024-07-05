import { useState } from "react";
import "./App.css";

import DetailCard from "@/components/layouts/DetailCard";
import SearchTabs from "@/components/layouts/SearchTabs";

function App() {
  const [clicknode, setClicknode] = useState(null);
  return (
    <>
      <div className="container">
        <div className="left-half">
          <SearchTabs setClicknode={setClicknode} />
        </div>
        <div className="right-half">
          <DetailCard clicknode={clicknode} />
        </div>
      </div>
    </>
  );
}

export default App;

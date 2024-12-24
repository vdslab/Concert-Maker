import "./App.css";
import Box from "@mui/material/Box";
import NodeLinkDiagram from "@/components/vis/NodeLinkDiagram";
import MyConcertCardList from "@/components/layouts/MyConcertCardList";

import { useState, useEffect, useMemo } from "react";
import { processData, createGraphData } from "@/components/vis/DataProcessing";

// driver.js 関連のインポート
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

import Share from "@/components/layouts/MyConcert/Share.jsx";

function App() {
  const [clickedNodeId, setClickedNodeId] = useState(null);
  const { linkData } = useMemo(() => processData(), []);
  const [graphData, setGraphData] = useState(() => createGraphData(linkData));

  useEffect(() => {
    const driverObj = driver({
      nextBtnText: '次へ →',
      prevBtnText: '← 前へ',
      doneBtnText: '完了',
      showProgress: true,
      progressText: "{{current}} / {{total}}",
      steps: [
        { element: '[data-tour-id="a-01"]', popover: { title: '共演度ネットワーク', description: 'ここに説明を入力' } },
        { element: '[data-tour-id="a-02"]', popover: { title: '検索ボックス', description: 'ここから曲を検索できます' } },
      ]
    });

    driverObj.drive();
  }, []);

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

export default App;

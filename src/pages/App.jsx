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
    const isTutorialCompleted = localStorage.getItem("isTutorialCompleted") === "true";

    if (!isTutorialCompleted) {
      const driverObj = driver({
        nextBtnText: '次へ →',
        prevBtnText: '← 前へ',
        doneBtnText: '完了',
        showProgress: true,
        progressText: "{{current}} / {{total}}",
        steps: [
          {
            popover: {
              title: 'Concert Maker へようこそ！',
              description: 'まずはじめに、Concert Maker の内容について簡単にご案内します。',
            }
          }, {
            element: '[data-tour-id="a-01"]',
            popover: {
              title: '共演度ネットワーク',
              description: 'オーケストラの曲を表す円が、よく一緒に演奏される曲同士で結ばれています。',
              onNextClick: () => {
                setClickedNodeId(1780); // ドヴォルザークの新世界へフォーカス
                setTimeout(() => driverObj.moveNext()); // レンダリングが完了してから次へ
              }
            }
          }, {
            element: '[data-tour-id="a-02"]',
            popover: {
              title: '楽曲の詳細',
              description: '曲を表す円をクリックすると、楽曲の詳細が表示されます。',
              align: 'center',
              onPrevClick: () => {
                setClickedNodeId(null);
                setTimeout(() => driverObj.movePrevious());
              }
            }
          }, {
            element: '[data-tour-id="a-03"]',
            popover: {
              title: 'My演奏会への追加ボタン',
              description: 'ここをクリックすると、楽曲をMy演奏会に追加できます。'
            }
          }, {
            element: '[data-tour-id="a-04"]',
            popover: {
              title: 'My演奏会の分析表示',
              description: '<img style="max-width: 100%" src="./src/assets/img/tour-insights.png" />ここをクリックすると、作成したMy演奏会の分析結果が確認できます。',
            }
          }, {
            element: '[data-tour-id="a-05"]',
            popover: {
              title: 'フィルター検索',
              description: '<img style="max-width: 100%" src="./src/assets/img/tour-filter.png" />フィルター検索をクリックすると、作曲者名や楽器編成でフィルタリングできます。',
              side: "right"
            }
          }, {
            popover: {
              title: 'Finish!',
              description: 'それでは、自分だけの演奏会を作ってみましょう！',
              onNextClick: () => {
                localStorage.setItem("isTutorialCompleted", "true");
                driverObj.moveNext();
              }
            }
          }
        ],
        allowClose: false,
        onPopoverRender: (popover) => {
          popover.closeButton.style.display = ''
        }
      });

      driverObj.drive();

      return () => driverObj.destroy();
    }
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

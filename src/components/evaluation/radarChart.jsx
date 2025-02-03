// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/radar
import { ResponsiveRadar } from "@nivo/radar";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

import * as Eval from "@/utils/Evaluation.js";

// const data = [
//   {
//     category: "国籍の近さ",
//     value: 3,
//   },
//   {
//     category: "作曲年の近さ",
//     value: 1,
//   },
//   {
//     category: "一緒に演奏されている度合い",
//     value: 3,
//   },
//   {
//     category: "平均有名度",
//     value: 4,
//   },
// ];

export function Radar(props) {
  const { works } = props;

  const data = [
    {
      category: "国籍の近さ",
      value: Eval.DistEval(works) || 0,
    },
    {
      category: "作曲年の近さ",
      value: Eval.YearEval(works) || 0,
    },
    {
      category: "一緒に演奏されている度合い",
      value: Eval.PlayedWithEval(works) || 0,
    },
    {
      category: "平均有名度",
      value: Eval.OrchPopularityEval(works),
    },
  ];

  return (
    <ResponsiveRadar
      data={data}
      keys={["value"]}
      indexBy="category"
      valueFormat=">-.2f"
      margin={{ top: 70, right: 80, bottom: 70, left: 80 }}
      borderColor={{ from: "color" }}
      gridLabelOffset={36}
      layers={["grid", "layers", "slices", "dots"]}
      enableDots={false}
      dotSize={10}
      dotColor={{ theme: "background" }}
      dotBorderWidth={2}
      colors={{ scheme: "accent" }}
      blendMode="multiply"
      animate={false}
      motionConfig="wobbly"
      sliceTooltip={(slice) => {
        return (
          <div
            style={{
              padding: "12px 16px",
              background: "#fff",
              borderRadius: "4px",
              boxShadow: "0 3px 9px rgba(0,0,0,0.25)",
            }}
          >
            <div>
              <strong>{slice.index}</strong>
            </div>
            <div>{slice.data[0].value.toFixed(1)} 点</div>
          </div>
        );
      }}
    />
  );
}

export default Radar;

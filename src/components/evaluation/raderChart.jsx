// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/radar
import { ResponsiveRadar } from "@nivo/radar";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const data = [
  {
    taste: "国籍の近さ",
    value: 3,
  },
  {
    taste: "作曲年の近さ",
    value: 1,
  },
  {
    taste: "一緒に演奏されている度合い",
    value: 3,
  },
  {
    taste: "平均有名度",
    value: 4,
  },
];

export function Radar() {
  return (
    <ResponsiveRadar
      data={data}
      keys={["value"]}
      indexBy="taste"
      valueFormat=">-.2f"
      margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
      borderColor={{ from: "color" }}
      gridLabelOffset={36}
      layers={["grid", "layers", "slices", "dots"]}
      enableDots={false}
      dotSize={10}
      dotColor={{ theme: "background" }}
      dotBorderWidth={2}
      colors={{ scheme: "accent" }}
      blendMode="multiply"
      motionConfig="wobbly"
      sliceTooltip={(slice) => {
        return (
          <div
            style={{
              background: "white",
              padding: "9px 12px",
              border: "1px solid #ccc",
            }}
          >
            <div>
              <strong>{slice.index}</strong>
            </div>
            <div>
              {slice.data[0].value} 点
            </div>
          </div>
        );
      }}
      legends={[
        {
          anchor: "top-left",
          direction: "column",
          translateX: -50,
          translateY: -40,
          itemWidth: 80,
          itemHeight: 20,
          itemTextColor: "#999",
          symbolSize: 12,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );
}

export default Radar;

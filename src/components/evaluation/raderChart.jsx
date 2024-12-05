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
    taste: "fruity",
    chardonay: 60,
    carmenere: 108,
    syrah: 39,
  },
  {
    taste: "bitter",
    chardonay: 113,
    carmenere: 22,
    syrah: 50,
  },
  {
    taste: "heavy",
    chardonay: 30,
    carmenere: 98,
    syrah: 119,
  },
  {
    taste: "strong",
    chardonay: 112,
    carmenere: 45,
    syrah: 65,
  },
  {
    taste: "sunny",
    chardonay: 20,
    carmenere: 115,
    syrah: 82,
  },
];

export function MyResponsiveRadar() {
  <ResponsiveRadar
    data={data}
    keys={["chardonay", "carmenere", "syrah"]}
    indexBy="taste"
    valueFormat=">-.2f"
    margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
    borderColor={{ from: "color" }}
    gridLabelOffset={36}
    enableDots={false}
    dotSize={10}
    dotColor={{ theme: "background" }}
    dotBorderWidth={2}
    colors={{ scheme: "nivo" }}
    blendMode="multiply"
    motionConfig="wobbly"
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
  />;
}

export default MyResponsiveRadar;

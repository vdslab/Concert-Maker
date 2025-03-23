import { ResponsiveBar } from "@nivo/bar";
import { useTranslation } from "react-i18next";
import { durationFormat } from "@/utils/calcTime";

const CustomTooltip = ({ id, value, color }) => (
  <div
    style={{
      padding: "12px 16px",
      background: "#fff",
      borderRadius: "4px",
      boxShadow: "0 3px 9px rgba(0,0,0,0.25)",
    }}
  >
    <strong>
      {id}
      {value === 2.5 ? "" : `: ${durationFormat(value)}`}
    </strong>
  </div>
);

const calculateDifferences = (tickValues) => {
  return tickValues.slice(1).map((value, index) => value - tickValues[index]);
};

const computeCumulativeTickValues = (data, keys) => {
  const cumulative = [0];
  keys.reduce((acc, key) => {
    const val = data[0][key] || 0;
    const newAcc = acc + val;
    cumulative.push(newAcc);
    return newAcc;
  }, 0);
  return cumulative;
};

const DifferenceLayer = ({
  xScale,
  innerWidth,
  innerHeight,
  margin,
  tickValues,
  differences,
}) => {
  const { t } = useTranslation();
  
  return differences.map((diff, index) => {
    const prevTick = tickValues[index];
    const currentTick = tickValues[index + 1];
    const midpoint =
      xScale(currentTick) - (xScale(currentTick) - xScale(prevTick)) / 2;

    return (
      <text
        key={`diff-${index}`}
        x={midpoint}
        y={innerHeight + margin.bottom - 40}
        textAnchor="middle"
        fill="#000"
        fontSize={12}
      >
        {diff === 2.5 ? t("evaluation.RectangularGraph.unknown") : durationFormat(diff)}
      </text>
    );
  });
};

const ConnectTicksLayer = ({
  xScale,
  innerWidth,
  innerHeight,
  margin,
  tickValues,
}) => {
  const points = tickValues.map((value) => xScale(value));

  const lines = points.slice(1).map((x, index) => {
    const prevX = points[index];
    return (
      <line
        key={`connect-${index}`}
        x1={prevX}
        y1={innerHeight + margin.bottom - 55}
        x2={x}
        y2={innerHeight + margin.bottom - 55}
        stroke="#000"
        strokeWidth={1}
      />
    );
  });

  return <g>{lines}</g>;
};

const RectangularGraph = (props) => {
  const { works } = props;

  const keys = works.map((work) => work.title);

  const data = [
    {
      group: "Works",
      ...works.reduce((acc, work) => {
        const duration_time =
          !work.selectedMovements ||
          work.workMovementDuration.length <= 1 ||
          work.workMovementDuration[0] === "'"
            ? work.duration
            : work.selectedMovements
                .map((movement) =>
                  parseInt(
                    work.workMovementDuration[movement].replace("'", ""),
                    10
                  )
                )
                .reduce((x, y) => x + y, 0);

        acc[work.title] = duration_time === null ? 2.5 : duration_time;
        return acc;
      }, {}),
    },
  ];

  const customLabel = ({ id, value }) => {
    const maxLength = 15;
    const truncatedId =
      id.length > maxLength ? `${id.slice(0, maxLength)}...` : id;
    return `${truncatedId}`;
  };

  const tickValues = computeCumulativeTickValues(data, keys);
  const differences = calculateDifferences(tickValues);

  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy="group"
      layout="horizontal"
      margin={{ top: 0, right: 30, bottom: 60, left: 30 }}
      padding={0.3}
      axisBottom={{
        tickSize: 10,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: 40,
        tickValues: tickValues,
        format: () => "",
      }}
      axisLeft={null}
      label={customLabel}
      labelSkipWidth={100}
      tooltip={CustomTooltip}
      animate={false}
      layers={[
        "grid",
        "axes",
        "bars",
        "markers",
        (props) => (
          <DifferenceLayer
            {...props}
            tickValues={tickValues}
            differences={differences}
          />
        ),
        (props) => <ConnectTicksLayer {...props} tickValues={tickValues} />,
      ]}
    />
  );
};

export default RectangularGraph;

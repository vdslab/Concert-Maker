import ForceGraph2D from "react-force-graph-2d";
import Data from "../../assets/works1.json";

const drawCircle = (ctx, x, y, radius, color) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.stroke();
};

const drawStar = (ctx, x, y, radius, points, inset, color) => {
  ctx.beginPath();
  ctx.moveTo(x, y - radius);
  for (let i = 0; i < points; i++) {
    ctx.rotate(Math.PI / points);
    ctx.lineTo(x, y - radius * inset);
    ctx.rotate(Math.PI / points);
    ctx.lineTo(x, y - radius);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.stroke();
};

const drawLabel = (ctx, x, y, label, globalScale) => {
  const fontSize = 12 / globalScale;
  ctx.font = `${fontSize}px Sans-Serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "black";
  ctx.fillText(label, x, y + 15 / globalScale);
};

const nodeData = Data.map((work) => ({
  id: work.workId,
  composerName: work.composerName,
  name: work.composer + " / " + work.title,
  // name: work.composerName + " / " + work.title,
  group: 0,
}));

const linkData = Data.flatMap((work) =>
  work.playedWith
    .filter((playedWith) => playedWith.workId > work.workId)
    .map((playedWith) => ({
      source: work.workId,
      target: playedWith.workId,
      // value: 1,
    }))
);

const NodeLinkDiagram = () => {
  console.log(linkData);
  const data = {
    nodes: nodeData,
    links: linkData,
  };
  return (
    <ForceGraph2D
      graphData={data}
      nodeCanvasObject={(node, ctx, globalScale) => {
        if (node.group === 0)
          drawCircle(ctx, node.x, node.y, 10 / globalScale, "blue");
        else if (node.group === 1)
          drawStar(ctx, node.x, node.y, 10 / globalScale, 5, 0.5, "yellow");

        // drawLabel(ctx, node.x, node.y, node.name, globalScale);
      }}
    />
  );
};

export default NodeLinkDiagram;

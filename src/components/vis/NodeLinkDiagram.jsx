import ForceGraph2D from "react-force-graph-2d";
import Data from "../../assets/works1.json";
import Data1 from "../../assets/playedWith.json";
import React, { useEffect, useRef } from "react";

const drawCircle = (ctx, x, y, radius, color) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.stroke();
};

const drawStar = (ctx, cx, cy, outerRadius, color) => {
  const spikes = 5;
  const innerRadius = outerRadius / 2;
  const step = Math.PI / spikes;
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.lineWidth = 1;
  ctx.fillStyle = color;
  ctx.fill();
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
  id: work.id,
  composerName: work.composerName,
  name: work.composer + " / " + work.title,
  // name: work.composerName + " / " + work.title,
  group: 0,
}));

const getMatchedDataByIds = () => {
  const workIds = Data1.map((item) => item.workId);
  const matched = Data.filter((item) => workIds.includes(item.id));

  return matched.map((work) => ({
    id: work.id,
    composerName: work.composerName,
    name: work.composer + " / " + work.title,
    group: 0,
  }));
};

const linkData = Data1.flatMap((work) =>
  work.playedWith
    .filter((playedWith) => playedWith.workId > work.workId)
    .map((playedWith) => ({
      source: work.workId,
      target: playedWith.workId,
      distance: (100 * 1.0) / (1.0 * playedWith.amount),
    }))
);

const NodeLinkDiagram = () => {
  const fgRef = useRef();
  const data = {
    nodes: getMatchedDataByIds(),
    links: linkData,
  };

  useEffect(() => {
    fgRef.current.d3Force("link").distance((link) => link.distance);
  }, []);

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={data}
      nodeCanvasObject={(node, ctx, globalScale) => {
        const size = 10 / globalScale;

        if (node.group === 0) {
          drawCircle(ctx, node.x, node.y, size, "blue");
        } else if (node.group === 1) {
          drawStar(ctx, node.x, node.y, size * 2, "gold");
        }

        // drawLabel(ctx, node.x, node.y, node.name, globalScale);
      }}
    />
  );
};

export default NodeLinkDiagram;

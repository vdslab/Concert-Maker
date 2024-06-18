import ForceGraph2D from "react-force-graph-2d";
import Works from "../../assets/works_v02.json";
import PlayedWith from "../../assets/playedWith.json";
import Composer from "../../assets/composers_v02.json";
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

const getComposerFromName = (composerName) => {
  const composer = Composer.find((item) => item.name === composerName);
  return composer ? composer : "NULL";
};

const getComposerFromId = (composerId) => {
  const work = getMatchedDataByIds().find((item) => item.id === composerId);
  return work ? work : "NULL";
};

const nodeData = Works.map((work) => ({
  id: work.id,
  composerName: work.composerName,
  name: work.composer + " / " + work.title,
  // name: work.composerName + " / " + work.title,
  group: 0,
}));

const getMatchedDataByIds = () => {
  const getItemsWithPlayedWith = PlayedWith.filter(
    (item) => item.playedWith.length > 0
  );
  const workIds = getItemsWithPlayedWith.map((item) => item.workId);
  const matched = Works.filter((item) => workIds.includes(item.id));

  return (
    matched
      // .filter((item) => item.year > 1800)
      .map((work) => ({
        id: work.id,
        composerName: work.composer,
        year: work.year,
        name:
          getComposerFromName(work.composer).nationality +
          "/" +
          work.year +
          "/" +
          work.composer +
          " / " +
          work.title,
        group: 0,
        latitude: getComposerFromName(work.composer).latitude,
        longitude: getComposerFromName(work.composer).longitude,
      }))
  );
};

const R = Math.PI / 180;

function distance(lat1, lng1, lat2, lng2) {
  lat1 *= R;
  lng1 *= R;
  lat2 *= R;
  lng2 *= R;
  return (
    Math.acos(
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
        Math.sin(lat1) * Math.sin(lat2)
    ) / Math.PI
  );
}

// 直接worksを参照してない。
const linkData = PlayedWith.flatMap((work) =>
  work.playedWith
    .filter(
      (playedWith) =>
        playedWith.workId > work.workId &&
        Math.pow(
          1 -
            Math.pow(
              distance(
                getComposerFromId(work.workId).latitude,
                getComposerFromId(work.workId).longitude,
                getComposerFromId(playedWith.workId).latitude,
                getComposerFromId(playedWith.workId).longitude
              ),
              1 / 2
            ),
          2
        ) > 0.6
    )
    .map((playedWith) => ({
      source: work.workId,
      target: playedWith.workId,
      distance: (100 * 1.0) / (1.0 * playedWith.amount),
      sourceData: getComposerFromId(work.workId),
      targetData: getComposerFromId(playedWith.workId),
      // test: distance(
      //   getComposerFromId(work.workId).latitude,
      //   getComposerFromId(work.workId).longitude,
      //   getComposerFromId(playedWith.workId).latitude,
      //   getComposerFromId(playedWith.workId).longitude
      // ),
    }))
);

const NodeLinkDiagram = () => {
  const fgRef = useRef();

  const data = {
    nodes: getMatchedDataByIds(),
    links: linkData.filter((link) => {
      // console.log(Math.abs(link.sourceData.year - link.targetData.year));
      return (
        Math.pow(
          1.1,
          -1 * Math.abs(link.sourceData.year - link.targetData.year)
        ) > 0.1
      );
    }),
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
      }}
    />
  );
};

export default NodeLinkDiagram;

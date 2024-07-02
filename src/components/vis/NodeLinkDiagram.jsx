import React, { useEffect, useRef, useState, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import Works from "../../assets/works_v02.json";
import PlayedWithData from "../../assets/playedWith.json";
import Composer from "../../assets/composers_v02.json";
import * as d3 from "d3";

const drawCircle = (ctx, x, y, radius, color) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.stroke();
};

const getComposerFromId = (composerId) => {
  const work = matchedDataByIds.find((item) => item.id === composerId);
  return work ? work : { lat: null, lon: null };
};

const matchedDataByIds = Works.map((work) => {
  const composerInfo = Composer.find((c) => c.name === work.composer);

  return {
    composer: work.composer,
    id: work.id,
    title: work.title,
    year: work.year,
    lat: composerInfo ? composerInfo.latitude : null,
    lon: composerInfo ? composerInfo.longitude : null,
    nationality: composerInfo ? composerInfo.nationality : null,
    name:
      (composerInfo ? composerInfo.nationality : "Unknown") +
      "/" +
      work.year +
      "/" +
      work.composer +
      "/" +
      work.title,
  };
});

function distance(lat1, lng1, lat2, lng2) {
  if (lat1 === null || lng1 === null || lat2 === null || lng2 === null)
    return Infinity;

  const R = Math.PI / 180;
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

const enhancedPlayedWithData = PlayedWithData.map((item) => {
  const baseWork = Works.find((work) => work.id === item.workId);
  const baseComposer = Composer.find((c) => c.name === baseWork.composer);

  const enhancedPlayedWith = item.playedWith.map((pw) => {
    const relatedWork = Works.find((work) => work.id === pw.workId);
    const relatedComposer = Composer.find(
      (c) => c.name === relatedWork.composer
    );
    return {
      ...pw,
      lat: relatedComposer ? relatedComposer.latitude : null,
      lon: relatedComposer ? relatedComposer.longitude : null,
      year: relatedWork ? relatedWork.year : null,
    };
  });

  return {
    ...item,
    playedWith: enhancedPlayedWith,
    lat: baseComposer ? baseComposer.latitude : null,
    lon: baseComposer ? baseComposer.longitude : null,
    year: baseWork ? baseWork.year : null,
  };
});

const linkData = enhancedPlayedWithData.flatMap((work) =>
  work.playedWith
    .filter((playedWith) => playedWith.workId > work.workId)
    .map((playedWith) => ({
      source: work.workId,
      target: playedWith.workId,
      distance: (100 * 1.0) / (1.0 * playedWith.amount),
      sourceData: getComposerFromId(work.workId),
      targetData: getComposerFromId(playedWith.workId),
    }))
);

const allPlayedWithWorkIds = new Set(
  PlayedWithData.flatMap((item) => [
    item.workId,
    ...item.playedWith.map((pw) => pw.workId),
  ])
);

const NodeLinkDiagram = ({ setClicknode }) => {
  // const [clicknode, setClicknode] = useState(null);
  const fgRef = useRef();

  const filteredWorks = useMemo(
    () => matchedDataByIds.filter((work) => allPlayedWithWorkIds.has(work.id)),
    []
  );

  const data = useMemo(
    () => ({
      nodes: filteredWorks,
      links: linkData.filter((link) => {
        const sourceData = getComposerFromId(link.source);
        const targetData = getComposerFromId(link.target);

        return (
          sourceData.lat !== null &&
          sourceData.lon !== null &&
          targetData.lat !== null &&
          targetData.lon !== null &&
          Math.pow(1.1, -1 * Math.abs(sourceData.year - targetData.year)) *
            Math.pow(
              1 -
                Math.pow(
                  distance(
                    sourceData.lat,
                    sourceData.lon,
                    targetData.lat,
                    targetData.lon
                  ),
                  1 / 2
                ),
              2
            ) >
            0.1
        );
      }),
    }),
    [filteredWorks]
  );

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force("link").distance((link) => link.distance);
      fgRef.current.d3Force("x", d3.forceX(0).strength(0.05));
      fgRef.current.d3Force("y", d3.forceY(0).strength(0.05));
      fgRef.current.d3Force("charge").strength(-100);
    }
  }, []);

  // console.log("clicknode", clicknode);

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={data}
      width={window.innerWidth * 0.6}
      nodeCanvasObject={(node, ctx, globalScale) => {
        const size = 5 / globalScale;
        drawCircle(ctx, node.x, node.y, size, "blue");
      }}
      onNodeClick={(node) => {
        setClicknode(node);
      }}
    />
  );
};

export default NodeLinkDiagram;

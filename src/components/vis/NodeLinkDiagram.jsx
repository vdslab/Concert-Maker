import ForceGraph2D from "react-force-graph-2d";
import Works from "../../assets/works_v02.json";
import PlayedWithData from "../../assets/playedWith.json";
import Composer from "../../assets/composers_v02.json";
import React, { useEffect, useRef, useState } from "react";
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
    work: work,
  };
});

const R = Math.PI / 180;

function distance(lat1, lng1, lat2, lng2) {
  if (lat1 === null || lng1 === null || lat2 === null || lng2 === null) {
    return Infinity;
  }
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

const NodeLinkDiagram = () => {
  const fgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);

  const filteredWorks = matchedDataByIds.filter((work) =>
    allPlayedWithWorkIds.has(work.id)
  );

  const data = {
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
  };

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force("link").distance((link) => link.distance);
      fgRef.current.d3Force("x", d3.forceX(0).strength(0.05));
      fgRef.current.d3Force("y", d3.forceY(0).strength(0.05));
      fgRef.current.d3Force("charge").strength(-100);
    }
  }, []);

  return (
    <div>
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const size = 5 / globalScale;
          drawCircle(ctx, node.x, node.y, size, "blue");
        }}
        onNodeClick={(node) => {
          setSelectedNode(node);
        }}
      />
      {selectedNode && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "#fff",
            padding: 10,
            border: "1px solid #ccc",
          }}
        >
          <h3>Node Details</h3>
          <p>
            <strong>ID:</strong> {selectedNode.id}
          </p>
          <p>
            <strong>Composer:</strong> {selectedNode.composer}
          </p>
          <p>
            <strong>Title:</strong> {selectedNode.title}
          </p>
          <p>
            <strong>Year:</strong> {selectedNode.year}
          </p>
          <p>
            <strong>Latitude:</strong> {selectedNode.lat}
          </p>
          <p>
            <strong>Longitude:</strong> {selectedNode.lon}
          </p>
          <p>
            <strong>Nationality:</strong> {selectedNode.nationality}
          </p>
          <p>
            <strong>works:</strong> {selectedNode.work.workFormula}
          </p>
        </div>
      )}
    </div>
  );
};

export default NodeLinkDiagram;

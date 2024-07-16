import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import ForceGraph2D from "react-force-graph-2d";
import Works from "../../assets/works_v03.json";
import PlayedWithData from "../../assets/playedWith.json";
import Composer from "../../assets/composers_v02.json";
import * as d3 from "d3";
import { Box } from "@mui/material";
import { getComposerFromId, matchedDataByIds } from "./utils";
import DrawCircle from "./DrawCircle";
import Distance from "./Distance";
import NodeInfo from "./NodeInfo";

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

const NodeLinkDiagram = ({ setClicknode, setData }) => {
  const [clickedNode, setClickedNode] = useState(null);
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
                  Distance(
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

  useEffect(() => {
    setData(data);
  }, [data, setData]);

  const parentDivRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (parentDivRef.current) {
        setHeight(parentDivRef.current.offsetHeight);
      }
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleNodeClick = useCallback(
    (node) => {
      fgRef.current.centerAt(node.x - 100, node.y, 1000);
      fgRef.current.zoom(2, 1000);

      setClickedNode(node);
      setClicknode(node);
    },
    [setClicknode]
  );

  const handleCloseInfo = useCallback(() => {
    setClickedNode(null);
    setClicknode(null);
  }, [setClicknode]);

  return (
    <Box ref={parentDivRef} position="relative" height="100%">
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        width={window.innerWidth * 0.6}
        height={height}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const size = 5 / globalScale;
          const color = node.id === clickedNode?.id ? "red" : "blue";
          DrawCircle(ctx, node.x, node.y, size, color, color);
        }}
        onNodeClick={handleNodeClick}
      />
      <NodeInfo node={clickedNode} onClose={handleCloseInfo} />
    </Box>
  );
};

export default NodeLinkDiagram;

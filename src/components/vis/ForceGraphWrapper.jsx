import React, { useRef, useEffect, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";
import DrawCircle from "./DrawCircle";
import { configureGraph } from "./GraphConfig";

const ForceGraphWrapper = ({ data, height, clicknode, setClicknode }) => {
  const fgRef = useRef();

  useEffect(() => {
    configureGraph(fgRef);
  }, []);

  useEffect(() => {
    if (clicknode && fgRef.current) {
      fgRef.current.centerAt(clicknode.x - 100, clicknode.y, 1000);
      fgRef.current.zoom(2, 1000);
    }
  }, [clicknode]);

  const handleNodeClick = useCallback(
    (node) => {
      setClicknode(node);
    },
    [setClicknode]
  );

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={data}
      width={window.innerWidth * 0.6}
      height={height}
      nodeCanvasObject={(node, ctx, globalScale) => {
        const size = 5 / globalScale;
        const color = node.id === clicknode?.id ? "red" : "blue";
        DrawCircle(ctx, node.x, node.y, size, color, color);
      }}
      onNodeClick={handleNodeClick}
    />
  );
};

export default ForceGraphWrapper;

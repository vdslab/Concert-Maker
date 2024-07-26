import React, { useRef, useEffect, useCallback } from "react";
import * as d3 from "d3";
import ForceGraph2D from "react-force-graph-2d";
import DrawCircle from "./DrawCircle";

const ForceGraphWrapper = ({ data, height, clicknode, setClicknode }) => {
  const fgRef = useRef();

  const configureGraph = (fgRef) => {
    if (fgRef.current) {
      fgRef.current.d3Force("link").distance((link) => link.distance);
      fgRef.current.d3Force("x", d3.forceX(0).strength(0.05));
      fgRef.current.d3Force("y", d3.forceY(0).strength(0.05));
      fgRef.current.d3Force("charge").strength(-100);
    }
  };

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
        const color = node.filter === 0 ? "hsl(240 50% 85%)" : "blue";
        const nodeColor = node.id === clicknode?.id ? "red" : color;
        DrawCircle(ctx, node.x, node.y, size, nodeColor, nodeColor);
      }}
      onNodeClick={handleNodeClick}
    />
  );
};

export default ForceGraphWrapper;

import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";
import * as d3 from "d3";
import ForceGraph2D from "react-force-graph-2d";
import DrawCircle from "./DrawCircle";

import Popularity from "@/assets/data/orchPopularity.json";

const ForceGraphWrapper = (props) => {
  const { data, height, clicknode, setClickedNodeId, isMobile } = props;
  const fgRef = useRef();
  const maxZoom = 3;

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: null,
    y: null,
    content: "",
  });

  const calculateInitialPositions = (data) => {
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance((link) => link.distance)
      )
      .force("x", d3.forceX(0).strength(0.05))
      .force("y", d3.forceY(0).strength(0.05))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("collide", d3.forceCollide().radius(13).iterations(1));

    for (let i = 0; i < 300; ++i) simulation.tick();
    simulation.stop();

    data.nodes.forEach((node) => {
      node.fx = node.x;
      node.fy = node.y;
    });

    return data;
  };

  const processedData = useMemo(() => calculateInitialPositions(data), [data]);

  useEffect(() => {
    if (clicknode) {
      setClickedNodeId(clicknode.id);
    }
  }, [clicknode, setClickedNodeId]);

  useEffect(() => {
    if (clicknode && fgRef.current) {
      const zoomOffset = isMobile ? 1 : 2;
      const targetZoom = Math.min(zoomOffset, maxZoom);
      const xOffset = isMobile ? 0 : 100;
      const yOffset = isMobile ? 120 : 0;
      fgRef.current.centerAt(
        clicknode.x - xOffset,
        clicknode.y + yOffset,
        1000
      );
      fgRef.current.zoom(targetZoom, 1000);
    }
  }, [clicknode]);

  const handleNodeClick = useCallback(
    (node) => {
      setClickedNodeId(node.id);
    },
    [setClickedNodeId]
  );

  const connectedNodeIds = useMemo(() => {
    if (!clicknode) return new Set();
    return new Set(
      processedData.links
        .filter(
          (link) =>
            link.source.id === clicknode.id || link.target.id === clicknode.id
        )
        .flatMap((link) => [link.source.id, link.target.id])
    );
  }, [clicknode, processedData.links]);

  const handleNodeHover = useCallback((node) => {
    if (node) {
      const { x, y } = fgRef.current.graph2ScreenCoords(node.x, node.y);
      setTooltip({
        visible: true,
        x: window.innerWidth / 2 - x < 0 ? x - 150 : x + 10,
        y: window.innerHeight - y < 200 ? y - 30 : y + 10,
        content: node.name,
      });
    } else {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }
  }, []);

  const getPopularity = (id) => {
    return Popularity[id] || 0;
  };

  const allFiltersAreOne = useMemo(() => {
    return processedData.nodes.every((node) => node.filter === 1);
  }, [processedData.nodes]);

  const determineLinkColor = (link) => {
    if (allFiltersAreOne) return "rgba(0, 0, 0, 0.2)";

    const sourceFilter = link.source.filter;
    const targetFilter = link.target.filter;

    if (sourceFilter === 1 || targetFilter === 1) {
      return "rgba(0, 0, 0, 0.3)";
    }
    return "rgba(0, 0, 0, 0.1)";
  };

  const containerStyle = isMobile
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }
    : {
        position: "relative",
        width: "100%",
        height,
      };

  const getNodeSize = (nodeId, globalScale) => {
    const popularity = getPopularity(nodeId);
    return 8 * popularity + 2 / globalScale;
  };

  return (
    <div style={containerStyle} data-tour-id="a-01">
      <ForceGraph2D
        ref={fgRef}
        graphData={processedData}
        width={isMobile ? window.innerWidth : window.innerWidth * 0.6}
        height={isMobile ? window.innerHeight : height}
        maxZoom={maxZoom}
        cooldownTicks={0}
        enablePanInteraction={true}
        enableNodeDrag={false}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const isConnected =
            clicknode &&
            (node.id === clicknode.id || connectedNodeIds.has(node.id));

          const size = getNodeSize(node.id, globalScale);

          const color = node.filter === 0 ? "hsl(240, 50%, 85%)" : "blue";
          const nodeColor = (() => {
            if (node.id === clicknode?.id) {
              return "red";
            }
            if (isConnected) {
              if (node.filter === 1) {
                return "#F80";
              } else {
                return "#FFCF99";
              }
            } else {
              return color;
            }
          })();

          const strokeColor = (() => {
            if (nodeColor === "red") {
              return "black";
            }
            if (!isConnected) {
              return nodeColor;
            }
            if (node.filter === 0) {
              return "#444";
            }
            return "black";
          })();
          DrawCircle(ctx, node.x, node.y, size, nodeColor, strokeColor);
        }}
        nodePointerAreaPaint={(node, color, ctx, globalScale) => {
          const size = getNodeSize(node.id, globalScale);
          const hitAreaSize = size * 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, hitAreaSize, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        linkWidth={(link) => {
          if (
            clicknode &&
            (link.source.id === clicknode.id || link.target.id === clicknode.id)
          )
            return 5;
          return 1;
        }}
        linkColor={determineLinkColor}
        nodeLabel={() => null}
        linkLabel={() => null}
      />
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y,
            left: tooltip.x,
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            pointerEvents: "none",
            whiteSpace: "normal",
            maxWidth: "300px",
            wordBreak: "break-word",
            zIndex: 10,
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default ForceGraphWrapper;

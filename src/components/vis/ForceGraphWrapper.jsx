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

const ForceGraphWrapper = (props) => {
  const { data, height, clicknode, setClickedNodeId } = props;
  const fgRef = useRef();
  const maxZoom = 3;

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
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
      .force("charge", d3.forceManyBody().strength(-100));

    for (let i = 0; i < 300; ++i) simulation.tick();
    simulation.stop();

    data.nodes.forEach((node) => {
      node.fx = node.x;
      node.fy = node.y;
    });

    return data;
  };

  const processedData = useMemo(() => calculateInitialPositions(data), [data]);

  const configureGraph = (fgRef) => {
    if (fgRef.current) {
      fgRef.current.d3Force("drag", null);

      fgRef.current.d3Force("link").distance((link) => link.distance);
      fgRef.current.d3Force("x", d3.forceX(0).strength(0.05));
      fgRef.current.d3Force("y", d3.forceY(0).strength(0.05));
      fgRef.current.d3Force("charge").strength(-100);

      const zoom = d3.zoom().scaleExtent([0.1, maxZoom]);
      d3.select(fgRef.current.canvas)
        .call(zoom)
        .on("wheel", (event) => {
          if (event.deltaY < 0 && fgRef.current.zoom() >= maxZoom) {
            event.preventDefault();
          }
        });
    }
  };

  useEffect(() => {
    if (clicknode) {
      setClickedNodeId(clicknode.id);
    }
  }, [clicknode, setClickedNodeId]);

  useEffect(() => {
    configureGraph(fgRef);
  }, []);

  useEffect(() => {
    if (clicknode && fgRef.current) {
      const targetZoom = Math.min(2, maxZoom);
      fgRef.current.centerAt(clicknode.x - 100, clicknode.y, 1000);
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

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={processedData}
        width={window.innerWidth * 0.6}
        height={height}
        maxZoom={maxZoom}
        cooldownTicks={0}
        enableNodeDrag={false}
        enablePanInteraction={true}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const isConnected =
            clicknode &&
            (node.id === clicknode.id || connectedNodeIds.has(node.id));

          const size = (isConnected ? 8 : 5) / globalScale;

          const color = node.filter === 0 ? "hsl(240, 50%, 85%)" : "blue";
          const nodeColor = node.id === clicknode?.id ? "red" : color;
          DrawCircle(
            ctx,
            node.x,
            node.y,
            size,
            nodeColor,
            isConnected ? "black" : nodeColor
          );
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
            whiteSpace: "nowrap",
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

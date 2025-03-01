import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import ForceGraphWrapper from "./ForceGraphWrapper";
import SearchBox from "../layouts/SearchBox";
import NodeInfo from "./NodeInfo/NodeInfo";

const NodeLinkDiagram = (props) => {
  const { clickedNodeId, setClickedNodeId, graphData, setGraphData } = props;
  const [height, setHeight] = useState(0);
  const [drawerHeight, setDrawerHeight] = useState(50);
  const parentDivRef = useRef(null);
  const handleRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  useEffect(() => {
    if (!isMobile || !clickedNodeId) return;

    const handleTouchStart = (e) => {
      // ハンドル要素がタッチされた場合のみ処理
      const handleElement = handleRef.current;
      if (!handleElement) return;

      let targetElement = e.target;
      let isHandle = false;
      while (targetElement) {
        if (targetElement === handleElement) {
          isHandle = true;
          break;
        }
        targetElement = targetElement.parentElement;
      }

      if (!isHandle) return;

      isDraggingRef.current = true;
      startYRef.current = e.touches[0].clientY;
      startHeightRef.current = drawerHeight;
      e.preventDefault();
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current) return;

      const deltaY = startYRef.current - e.touches[0].clientY;
      const newHeightVh =
        startHeightRef.current + (deltaY / window.innerHeight) * 100;

      const limitedHeight = Math.max(20, Math.min(90, newHeightVh));
      setDrawerHeight(limitedHeight);
      e.preventDefault();
    };

    const handleTouchEnd = (e) => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        e.preventDefault();
      }
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, clickedNodeId, drawerHeight]);

  const updateGraphData = useCallback(
    (newData) => {
      setGraphData((prevData) => ({
        ...prevData,
        ...newData,
        links: newData.links.map((link) => ({
          ...link,
          source:
            typeof link.source === "object" ? link.source.id : link.source,
          target:
            typeof link.target === "object" ? link.target.id : link.target,
        })),
      }));
    },
    [setGraphData],
  );

  // props.graphData の値変更だけでは clickNode は不変のため、メモ化しておく
  const clickNode = useMemo(() => {
    return clickedNodeId
      ? graphData.nodes.find((node) => node.id === clickedNodeId)
      : null;
  }, [clickedNodeId, graphData.nodes]);

  return (
    <Box ref={parentDivRef} position="relative" height="100%">
      <ForceGraphWrapper
        data={graphData}
        height={height}
        clicknode={clickNode}
        setClickedNodeId={setClickedNodeId}
        isMobile={isMobile}
      />
      <SearchBox
        Data={graphData}
        setData={updateGraphData}
        setClickedNodeId={setClickedNodeId}
      />
      {clickedNodeId && (
        <>
          {isMobile ? (
            <SwipeableDrawer
              anchor="bottom"
              open={Boolean(clickedNodeId)}
              onClose={() => setClickedNodeId(null)}
              onOpen={() => {}}
              PaperProps={{
                style: {
                  height: `${drawerHeight}vh`,
                  transition: "height 0.1s",
                  overscrollBehavior: "none",
                },
              }}
              hideBackdrop
              disableSwipeToOpen
              disableRestoreFocus
              variant="persistent"
            >
              <Box
                ref={handleRef}
                sx={{
                  width: "100%",
                  height: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "ns-resize",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                  backgroundColor: theme.palette.background.paper,
                  touchAction: "none",
                }}
              >
                <Box
                  sx={{
                    width: "40px",
                    height: "4px",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    borderRadius: "4px",
                  }}
                />
              </Box>
              <NodeInfo
                node={clickNode}
                Data={graphData}
                setClickedNodeId={setClickedNodeId}
              />
            </SwipeableDrawer>
          ) : (
            <>
              <div
                style={{
                  position: "absolute",
                  top: "70px",
                  left: "10px",
                  height: "calc(100vh - 140px)",
                  width: "calc(100% - 20px)",
                  zIndex: "-1",
                }}
                data-tour-id="a-02"
              ></div>
              <NodeInfo
                node={clickNode}
                Data={graphData}
                setClickedNodeId={setClickedNodeId}
              />
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default NodeLinkDiagram;

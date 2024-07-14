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
import SpotifyIcon from "../../assets/Spotify_Icon.png";
import YoutubeIcon from "../../assets/YouTube_Music.png";
import AmazonIcon from "../../assets/Amazon_Music.png";
import AppleIcon from "../../assets/Apple_Music_Icon.svg";
import { Button, ButtonGroup } from "@mui/material";
import * as d3 from "d3";
import MyConcert from "@/utils/myConcert";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

function SplitButton({ songId }) {
  console.log(songId);

  const concertNames = MyConcert.getConcerts().map((concert) => concert.name);
  if (concertNames.length === 0) {
    MyConcert.createConcert("My演奏会");
    concertNames.push("My演奏会");
  }
  console.log(concertNames);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleMenuItemClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleClose(event);
  };

  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Amazonといっしょにしました。 */}
        <Button
          onClick={(e) => {
            MyConcert.saveWork(songId, concertNames[0]);
            e.stopPropagation();
          }}
        >
          {concertNames[0]}に追加
        </Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {concertNames.map((concertName) => (
                    <MenuItem
                      key={concertName}
                      onClick={
                        (MyConcert.saveWork(songId, concertName),
                        handleMenuItemClick)
                      }
                    >
                      {concertName}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}

const drawCircle = (ctx, x, y, radius, color, strokeColor) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
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

const NodeLinkDiagram = ({ setClicknode, setData }) => {
  const [clickedNode, setClickedNode] = useState(null);
  const fgRef = useRef();
  console.log(clickedNode);

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

  const NodeInfo = ({ node, onClose }) => {
    if (!node) return null;

    const musicServices = [
      { name: "Spotify", icon: SpotifyIcon },
      { name: "YouTube Music", icon: YoutubeIcon },
      { name: "Apple Music", icon: AmazonIcon },
      { name: "Amazon Music", icon: AppleIcon },
    ];

    const relatedWorks = [
      {
        title: node.title,
        composer: node.composer,
        duration: "33分",
        id: "2022-2200-tmp-str",
      },
      {
        title: node.title,
        composer: node.composer,
        duration: "33分",
        id: "2022-2200-tmp-str",
      },
      {
        title: node.title,
        composer: node.composer,
        duration: "33分",
        id: "2022-2200-tmp-str",
      },
    ];

    return (
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "10px",
          background: "white",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          width: "300px",
          maxHeight: "calc(100vh - 60px)",
          overflowY: "auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "sticky",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            float: "right",
            zIndex: 1,
          }}
        >
          ×
        </button>
        <div style={{ padding: "20px" }}>
          <h2 style={{ margin: "0 0 10px 0" }}>{node.title}</h2>
          <p style={{ margin: "0 0 5px 0" }}>演奏時間: 33分</p>
          <p style={{ margin: "0 0 15px 0", color: "#666" }}>
            {node.workFormulaStr}
          </p>
          {/* <button
            style={{
              background: "#4285F4",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            演奏会に追加 ▼
          </button> */}
          <SplitButton songId={node.id} />
        </div>
        <div style={{ borderTop: "1px solid #eee", padding: "20px" }}>
          <h3 style={{ margin: "0 0 10px 0" }}>詳細情報</h3>
          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
            {[
              "I. Un poco sostenuto; Allegro",
              "II. Andante sostenuto",
              "III. Un poco allegretto e grazioso",
              "IV. Adagio; Più andante; Allegro non troppo, ma con brio",
            ].map((movement, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <span>{movement}</span>
                <span>
                  {index === 0
                    ? "13分"
                    : index === 1
                    ? "10分"
                    : index === 2
                    ? "5分"
                    : "17分"}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ borderTop: "1px solid #eee", padding: "20px" }}>
          <h3 style={{ margin: "0 0 10px 0" }}>聴く</h3>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {musicServices.map((service, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <img
                  src={service.icon}
                  alt={service.name}
                  style={{ width: "40px", height: "40px", marginBottom: "5px" }}
                />
                <p style={{ margin: 0, fontSize: "12px" }}>{service.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid #eee", padding: "20px" }}>
          <h3 style={{ margin: "0 0 10px 0" }}>よく一緒に演奏されている曲</h3>
          {relatedWorks.map((work, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <h4 style={{ margin: "0 0 5px 0" }}>{work.title}</h4>
              <p style={{ margin: "0 0 5px 0" }}>{work.composer}</p>
              <p style={{ margin: "0", color: "#666" }}>
                演奏時間: {work.duration} | {work.id}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div ref={parentDivRef} style={{ position: "relative", height: "100%" }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        width={window.innerWidth * 0.6}
        height={height}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const size = 5 / globalScale;
          const color = node.id === clickedNode?.id ? "red" : "blue";
          drawCircle(ctx, node.x, node.y, size, color, color);
        }}
        onNodeClick={handleNodeClick}
      />
      <NodeInfo node={clickedNode} onClose={handleCloseInfo} />
    </div>
  );
};

export default NodeLinkDiagram;

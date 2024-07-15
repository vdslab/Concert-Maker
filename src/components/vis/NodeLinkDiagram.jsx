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
import * as d3 from "d3";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import SplitButton from "./SplitButton";

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "30px",
  left: "10px",
  width: "400px",
  height: "calc(100vh - 100px)",
  maxHeight: "calc(100vh - 100px)",
  overflowY: "auto",
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "10px",
  right: "10px",
}));

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

const NodeInfo = ({ node, onClose }) => {
  if (!node) return null;

  const musicServices = [
    {
      name: "Spotify",
      icon: SpotifyIcon,
      url: "https://open.spotify.com/search/",
    },
    {
      name: "YouTube Music",
      icon: YoutubeIcon,
      url: "https://music.youtube.com/search?q=",
    },
    {
      name: "Apple Music",
      icon: AppleIcon,
      url: "https://music.apple.com/search?term=",
    },
    {
      name: "Amazon Music",
      icon: AmazonIcon,
      url: "https://music.amazon.com/search/",
    },
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
    <StyledPaper>
      <Box p={2}>
        <StyledIconButton onClick={onClose}>
          <CloseIcon />
        </StyledIconButton>
        <Typography variant="h5" gutterBottom>
          {node.title}
        </Typography>
        <Typography variant="body2" gutterBottom>
          演奏時間: 33分
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {node.workFormulaStr}
        </Typography>
        <SplitButton songId={node.id} />
      </Box>
      <Divider />
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          詳細情報
        </Typography>
        <List>
          {[
            "I. Un poco sostenuto; Allegro",
            "II. Andante sostenuto",
            "III. Un poco allegretto e grazioso",
            "IV. Adagio; Più andante; Allegro non troppo, ma con brio",
          ].map((movement, index) => (
            <ListItem key={index} dense>
              <ListItemText
                primary={movement}
                secondary={
                  index === 0
                    ? "13分"
                    : index === 1
                    ? "10分"
                    : index === 2
                    ? "5分"
                    : "17分"
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          聴く
        </Typography>
        <Grid container spacing={2} justifyContent="space-between">
          {musicServices.map((service, index) => (
            <Grid item key={index}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <img
                  src={service.icon}
                  alt={service.name}
                  style={{ width: 40, height: 40, marginBottom: 5 }}
                />
                <Typography variant="caption">{service.name}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Divider />
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          よく一緒に演奏されている曲
        </Typography>
        {relatedWorks.map((work, index) => (
          <Box key={index} mb={2}>
            <Typography variant="subtitle1">{work.title}</Typography>
            <Typography variant="body2">{work.composer}</Typography>
            <Typography variant="body2" color="textSecondary">
              演奏時間: {work.duration} | {work.id}
            </Typography>
          </Box>
        ))}
      </Box>
    </StyledPaper>
  );
};

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
          drawCircle(ctx, node.x, node.y, size, color, color);
        }}
        onNodeClick={handleNodeClick}
      />
      <NodeInfo node={clickedNode} onClose={handleCloseInfo} />
    </Box>
  );
};

export default NodeLinkDiagram;

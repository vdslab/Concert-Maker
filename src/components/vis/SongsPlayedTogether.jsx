import React from "react";
import { Typography, Box } from "@mui/material";

const SongPlayedTogether = ({ node, Data }) => {
  const { links } = Data;

  const linkNodes = new Set();

  if (links != null && links.length !== 0) {
    links.forEach((link) => {
      if (link.source === node || link.target === node) {
        linkNodes.add(link.source);
        linkNodes.add(link.target);
      }
    });
    linkNodes.delete(node);
  }

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        よく一緒に演奏されている曲
      </Typography>
      {Array.from(linkNodes).map((work, index) => (
        <Box key={index} mb={2}>
          <Typography variant="subtitle1">{work.title}</Typography>
          <Typography variant="body2">{work.composer}</Typography>
          <Typography variant="body2" color="textSecondary">
            演奏時間: {work.duration}分
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {work.workFormulaStr}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default SongPlayedTogether;

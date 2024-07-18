import React from "react";
import { Typography, Box, Button } from "@mui/material";

const SongPlayedTogether = ({ node, Data, onSongClick }) => {
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
        <Button
          key={index}
          onClick={() => console.log(work)}
          sx={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "8px",
            mb: 2,
            backgroundColor: "transparent",
            border: "none",
            borderRadius: 0,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
            "&:focus": {
              outline: "none",
              backgroundColor: "rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            {work.title}
          </Typography>
          <Typography variant="body2" component="div">
            {work.composer}
          </Typography>
          <Typography variant="body2" component="div" color="text.secondary">
            演奏時間: {work.duration}
          </Typography>
          <Typography variant="body2" component="div" color="text.secondary">
            {work.workFormulaStr}
          </Typography>
        </Button>
      ))}
    </Box>
  );
};

export default SongPlayedTogether;

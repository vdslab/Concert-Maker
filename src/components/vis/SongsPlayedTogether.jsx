import React from "react";
import { Typography, Box } from "@mui/material";

const SongPlayedTogether = ({ node }) => {
  const relatedWorks = [
    {
      title: node.title,
      composer: node.composer,
      duration: `${node.duration}分`,
      workFormulaStr: node.workFormulaStr,
    },
  ];

  return (
    <>
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          よく一緒に演奏されている曲
        </Typography>
        {relatedWorks.map((work, index) => (
          <Box key={index} mb={2}>
            <Typography variant="subtitle1">{work.title}</Typography>
            <Typography variant="body2">{work.composer}</Typography>
            <Typography variant="body2" color="textSecondary">
              演奏時間: {work.duration}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {work.workFormulaStr}
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default SongPlayedTogether;

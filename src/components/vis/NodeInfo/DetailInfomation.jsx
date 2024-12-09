import React, { useState } from "react";
import { Typography, Box, Grid, Button } from "@mui/material";

const DetailInfomation = ({ node }) => {
  if (!node.workMovements || node.workMovements[0] === "") return null;

  const [showAll, setShowAll] = useState(false);
  const maxVisible = 5;
  const hasMore = node.workMovements.length > maxVisible;

  const movementsWithDurations = node.workMovements.map((movement, index) => ({
    movement,
    duration: node.workMovementDuration[index],
  }));

  const displayedItems = showAll
    ? movementsWithDurations
    : movementsWithDurations.slice(0, maxVisible);

  const handleToggle = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        楽章情報
      </Typography>
      <Grid container spacing={2}>
        {displayedItems.map((item, index) => (
          <Grid item xs={12} container key={index}>
            <Grid item xs={10}>
              <Typography>{item.movement}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography align="right">
                {item.duration?.replace("'", "分")}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
      {hasMore && (
        <Box mt={2} textAlign="center">
          <Button onClick={handleToggle} variant="text" color="primary">
            {showAll ? "表示を折りたたむ" : "さらに表示"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DetailInfomation;

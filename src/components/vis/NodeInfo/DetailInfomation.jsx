import React from "react";
import { Typography, Box, Grid } from "@mui/material";

const DetailInfomation = ({ node }) => {
  if (node.workMovements[0] === "") return;
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        楽章情報
      </Typography>
      <Grid container spacing={2}>
        {node.workMovements.map((movement, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12} container>
              <Grid item xs={10}>
                <Typography>{movement}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography align="right">
                  {node.workMovementDuration[index]?.replace("'", "分")}
                </Typography>
              </Grid>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  );
};

export default DetailInfomation;

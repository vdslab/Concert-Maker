import React from "react";
import { Typography, Box, Grid } from "@mui/material";

const DetailInfomation = ({ node }) => {
  return (
    <>
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          詳細情報
        </Typography>
        <Grid container spacing={2}>
          {node.workMovements.map((movement, index) => (
            <>
              <Grid item xs={12} container>
                <Grid item xs={10}>
                  <Typography>{movement}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="right">
                    {node.workMovementDuration[index]}
                  </Typography>
                </Grid>
              </Grid>
            </>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default DetailInfomation;

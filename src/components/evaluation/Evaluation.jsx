import React from "react";
import Box from "@mui/material/Box";
import Radar from "@/components/evaluation/radarChart.jsx";
import RectangularGraph from "@//components/evaluation/RectangularGraph.jsx";

export default function Evaluation(props) {
  const { works } = props;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "7fr 3fr",
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "95%",
          border: "1px solid #0f0",
        }}
      >
        <Radar works={works} />
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "95%",
          border: "1px solid #00f",
        }}
      >
        <RectangularGraph works={works} />
      </Box>
    </Box>
  );
}

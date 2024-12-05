import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";

import Radar from "@/components/evaluation/radarChart.jsx";

export default function Evaluation() {
  return (
    <Grid
      container
      spacing={3}
      direction="column"
      justifyContent="space-between"
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Grid size="grow">
        <Box
          sx={{
            width: "100%",
            height: "90%",
            border: "1px solid #0f0",
          }}
        >
          <Radar />
        </Box>
      </Grid>
      <Grid size="auto">
        <Box
          sx={{
            width: "100%",
            height: "100%",
            border: "1px solid #00f",
          }}
        >
          <p>ここに帯グラフ</p>
        </Box>
      </Grid>
    </Grid>
  );
}

import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";

import Radar from "@/components/evaluation/radarChart.jsx";
import RectangularGraph from "./rectangularGraph";

export default function Evaluation(props) {
  const { works } = props;
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
          <Radar works={works} />
        </Box>
      </Grid>
      <Grid size="grow">
        <Box
          sx={{
            width: "100%",
            height: "90%",
            border: "1px solid #00f",
          }}
        >
          <RectangularGraph works={works} />
        </Box>
      </Grid>
    </Grid>
  );
}

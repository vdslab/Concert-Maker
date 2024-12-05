import Box from "@mui/material/Box";

import Radar from "@/components/evaluation/raderChart.jsx";

export default function Evaluation() {
  return (
    <Box sx={{ width: "100%", height: "75%", border: "1px solid #0f0" }}>
      <Radar />
    </Box>
  );
}

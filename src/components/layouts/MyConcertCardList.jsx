import Box from "@mui/material/Box";

import MyConcertCard from "@/components/layouts/MyConcertCard";
import myConcert from "@/utils/myConcert";

export default function MyConcertCardList() {
  const concerts = myConcert.getConcerts();

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      width="100%"
      height="100%"
      border="4px solid orange"
    >
      {concerts.map((concert) => (
        <MyConcertCard key={concert.name} concert={concert} />
      ))}
      <Box border="4px dashed blue" sx={{ flexGrow: 1 }}>
        この部分に新しいコンサートを追加するボタンを配置する
      </Box>
    </Box>
  );
}

import Box from "@mui/material/Box";

import MyConcertCard from "@/components/layouts/MyConcert/Card";
import myConcert from "@/utils/myConcert";

export default function MyConcertCardList() {
  const concerts = myConcert.getConcerts();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {concerts.map((concert) => (
        <MyConcertCard key={concert.name} concert={concert} />
      ))}
      <Box border="4px dashed blue" minHeight="300px" sx={{ flexGrow: 1 }}>
        この部分に新しいコンサートを追加するボタンを配置する
      </Box>
    </Box>
  );
}

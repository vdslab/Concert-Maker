import Box from "@mui/material/Box";

import MyConcertCard from "@/components/layouts/MyConcert/Card";
import NewConcert from "@/components/layouts/MyConcert/NewConcert";

import { concertListState } from "@/pages/App";
import { useRecoilValue } from "recoil";

export default function MyConcertCardList() {
  const concerts = useRecoilValue(concertListState);
  console.log(concerts);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {concerts.map((concert) => (
        <MyConcertCard key={concert.id} concert={concert} />
      ))}
      <NewConcert />
    </Box>
  );
}

import Box from "@mui/material/Box";

import MyConcertCard from "@/components/layouts/MyConcert/Card";
import NewConcert from "@/components/layouts/MyConcert/NewConcert";

import { concertListState } from "@/components/RecoilStates";
import { useRecoilValue } from "recoil";

export default function MyConcertCardList({ Data, clicknode, setClicknode }) {
  const concerts = useRecoilValue(concertListState);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {concerts.map((concert) => (
        <MyConcertCard
          key={concert.id}
          concert={concert}
          clicknode={clicknode}
          setClicknode={setClicknode}
          Data={Data}
        />
      ))}
      <NewConcert />
    </Box>
  );
}

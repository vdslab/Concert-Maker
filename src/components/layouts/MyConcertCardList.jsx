import { useState } from "react";
import Box from "@mui/material/Box";

import MyConcertCard from "@/components/layouts/MyConcert/Card";
import NewConcert from "@/components/layouts/MyConcert/NewConcert";

import myConcert from "@/utils/myConcert";

export default function MyConcertCardList() {
  const [concerts, updateConcerts] = useState(myConcert.getConcerts());

  const createMyConcert = () => {
    myConcert.createConcert("My Concert5");
    updateConcerts(myConcert.getConcerts());
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {concerts.map((concert) => (
        <MyConcertCard key={concert.name} concert={concert} />
      ))}
      <NewConcert buttonAction={createMyConcert} />
    </Box>
  );
}

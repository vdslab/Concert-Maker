import { useState, useEffect } from "react";
import Box from "@mui/material/Box";

import MyConcertCard from "@/components/layouts/MyConcert/Card";
import NewConcert from "@/components/layouts/MyConcert/NewConcert";

import myConcert from "@/utils/myConcert";

export default function MyConcertCardList() {
  const [concerts, updateConcerts] = useState(myConcert.getConcerts());

  useEffect(() => {
    const interval = setInterval(() => {
      updateConcerts(myConcert.getConcerts());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const createMyConcert = () => {
    const existingConcertNames = concerts.map((concert) => concert.name);
    const newConcertNumber = findUniqueNumber(existingConcertNames, "My演奏会");
    const newConcertName = `My演奏会${newConcertNumber}`;

    myConcert.createConcert(newConcertName);
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

function findUniqueNumber(existingNames, prefix) {
  let number = 1;
  while (existingNames.includes(`${prefix}${number}`)) {
    number++;
  }
  return number;
}

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import Stack from "@mui/material/Stack";

import { v4 as randomUUID } from "uuid";

import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import {
  concertsState,
  concertNamesState,
  selectedConcertState,
} from "@/components/RecoilStates";

const BoxButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  borderRadius: "30px",
  color: "dimgray",
  textAlign: "justify",
  [theme.breakpoints.down("sm")]: {
    width: "100% !important", // Overrides inline-style
    minHeight: 100,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
}));

export default function NewConcert() {
  const setConcerts = useSetRecoilState(concertsState);
  const existingNames = useRecoilValue(concertNamesState);

  const [selected_concert, setSelectedConcert] = useRecoilState(selectedConcertState);

  return (
    <Box
      border="4px dashed dimgray"
      minHeight="300px"
      borderRadius="30px"
      sx={{
        flexGrow: 1,
        display: "flex",
        flexWrap: "wrap",
        m: { xs: 1, sm: 0 },
      }}
    >
      <BoxButton
        focusRipple
        style={{
          width: "100%",
        }}
        onClick={() => {
          const newConcertNumber = findUniqueNumber(existingNames, "My演奏会");
          const newConcertName = `My演奏会 ${newConcertNumber}`;
          const newConcertId = randomUUID();

          setConcerts((concerts) => [
            ...concerts,
            { id: newConcertId, name: newConcertName },
          ]);

          if (selected_concert === null) {
            setSelectedConcert(newConcertId);
          }
        }}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Stack>
            <Typography variant="body1" sx={{ fontSize: 20 }}>
              ここをクリックしてMy演奏会を作成
            </Typography>
          </Stack>
          <Stack>
            <AddCircleOutlineIcon
              sx={{
                fontSize: 50,
              }}
            />
          </Stack>
        </Stack>
      </BoxButton>
    </Box>
  );
}

function findUniqueNumber(existingNames, prefix) {
  let number = 1;
  while (existingNames.includes(`${prefix} ${number}`)) {
    number++;
  }
  return number;
}

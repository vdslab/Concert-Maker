import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PropTypes from "prop-types"; // Import PropTypes

import myConcert from "@/utils/myConcert";

import Stack from "@mui/material/Stack";

const BoxButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  borderRadius: "30px",
  color: "dimgray",
  textAlign: "justify",
  [theme.breakpoints.down("sm")]: {
    width: "100% !important", // Overrides inline-style
    height: 100,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
}));

export default function NewConcert(props) {
  const buttonAction = props.buttonAction;
  return (
    <Box
      border="4px dashed dimgray"
      minHeight="300px"
      borderRadius="30px"
      sx={{
        flexGrow: 1,
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <BoxButton
        focusRipple
        style={{
          width: "100%",
        }}
        onClick={buttonAction}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Stack>
            <Typography variant="body1" sx={{ fontSize: 20 }}>
              新しく My演奏会を作成する？？
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

NewConcert.propTypes = {
  buttonAction: PropTypes.func.isRequired, // Add prop validation for buttonAction prop
};

import "./App.css";
import { useTheme, useMediaQuery } from "@mui/material";
import PC from "@/pages/PC";
import Mobile from "@/pages/Mobile";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    return <Mobile />;
  } else {
    return <PC />;
  }
}

export default App;

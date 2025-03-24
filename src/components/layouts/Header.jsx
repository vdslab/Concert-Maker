import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";


function ResponsiveAppBar() {
  const { t, i18n } = useTranslation();
  console.log(i18n.language, i18n.languages, i18n.resolvedLanguage);
  return (
    <AppBar position="sticky" sx={{ px: 2 }}>
      <Toolbar disableGutters>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: "flex", md: "flex" },
            alignItems: "center",
            // fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
            textOverflow: "ellipsis",
          }}
        >
          <Icon sx={{ textAlign: "center", mr: "8px" }} fontSize={"large"}>
            <img style={{ height: "100%" }} src="/logo.svg" alt="Logo" />
          </Icon>
          Orchestra Concert Maker
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
export default ResponsiveAppBar;

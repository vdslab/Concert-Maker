import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

const navItems = [
  // { item: "Search", link: "/", target: "_self" },
  // { item: "MyConcert", link: "/my-concert", target: "_self" },
  // {
  //   item: "Shirashoji",
  //   link: "https://github.com/Shirashoji/",
  //   target: "_blank",
  // },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

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

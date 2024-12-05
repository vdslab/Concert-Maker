import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { RecoilRoot } from "recoil";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { jaJP } from "@mui/material/locale";
import Box from "@mui/material/Box";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import App from "@/pages/App.jsx";
import ResponsiveAppBar from "./components/layouts/Header.jsx";

import Share from "@/components/layouts/MyConcert/Share.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/share",
    element: <Share />,
  },
  {
    path: "/app",
    element: <App />,
  },
  {
    path: "/box",
    element: (
      <Box
        sx={{
          width: 100,
          height: 100,
          margin: 0,
          bgcolor: "lightpink",
          border: "6px solid yellow",
        }}
      >
        Box
      </Box>
    ),
  },
]);

export const themeOptions = responsiveFontSizes(
  createTheme(
    {
      palette: {
        mode: "light",
        primary: {
          main: "#263238",
        },
        secondary: {
          main: "#ffa000",
        },
        background: {
          default: "#eeeeee",
          paper: "#ffffff",
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            "::-webkit-scrollbar": {
              // スクロールバー全体
              width: "8px",
              height: "8px",
            },
            "::-webkit-scrollbar-button": {
              // スクロールバーの上下の矢印ボタン
              height: 0,
              width: 0,
            },
            "::-webkit-scrollbar-thumb": {
              // ドラッグ可能なスクロールハンドル
              background: grey[400],
              backgroundClip: "padding-box",
              border: "none",
              borderRadius: "100px",
              minHeight: "28px",
              padding: "100px 0 0",
              boxShadow:
                "inset 1px 1px 0 rgba(0, 0, 0, .1), inset 0 -1px 0 rgba(0, 0, 0, .07)",
            },
            "::-webkit-scrollbar-thumb:hover": {
              // ドラッグ可能なスクロールハンドル
              background: grey[600],
            },
            "::-webkit-scrollbar-track": {
              // スクロールバーのトラック（プログレスバー）
              backgroundClip: "padding-box",
              border: "solid transparent",
              borderWidth: "0 0 0 4px",
            },
            "::-webkit-scrollbar-corner": {
              // 水平スクロールバーと垂直スクロールバーの両方が合わさるところ
              background: "transparent",
            },
          },
        },
      },
    },
    jaJP,
  ),
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <SnackbarProvider maxSnack={3}>
        <Box
          display="flex"
          flexDirection="column"
          height="100vh"
          sx={{
            overflow: "auto", // Add this line to enable scrolling
          }}
        >
          <ThemeProvider theme={themeOptions}>
            <CssBaseline />
            <ResponsiveAppBar />
            <Box height="100%" overflow="auto">
              <RouterProvider router={router} />
            </Box>
          </ThemeProvider>
        </Box>
      </SnackbarProvider>
    </RecoilRoot>
  </React.StrictMode>,
);

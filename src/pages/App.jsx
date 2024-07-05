import { useState } from "react";
import "./App.css";
import NodeLinkDiagram from "../components/vis/NodeLinkDiagram";
import DetailCard from "../components/layouts/DetailCard";

function App() {
  const [clicknode, setClicknode] = useState(null);
  return (
    <>
      <div className="container">
        <SearchTabs setClicknode={setClicknode} />
        <div className="right-half">
          <DetailCard clicknode={clicknode} />
        </div>
      </div>
    </>
  );
}

import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

SearchTabs.propTypes = {
  setClicknode: PropTypes.func.isRequired,
};

function SearchTabs({ setClicknode }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "65%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="グラフ" {...a11yProps(0)} />
          <Tab label="一覧" {...a11yProps(1)} />
          <Tab label="お気に入り" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {/* <div className="left-half"> */}
        <NodeLinkDiagram setClicknode={setClicknode} />
        {/* </div> */}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        一覧
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        お気に入り
      </CustomTabPanel>
    </Box>
  );
}

export default App;

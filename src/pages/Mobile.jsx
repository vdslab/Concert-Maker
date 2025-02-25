import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import SearchIcon from "@mui/icons-material/Search";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";
import Search from "@/components/mobile/Search";
import MyConcert from "@/components/mobile/MyConcert";

function TabPanel(props) {
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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function Mobile(props) {
  const [value, setValue] = React.useState(0);
  const { clickedNodeId, setClickedNodeId, graphData, setGraphData } = props;

  return (
    <Box sx={{ width: 500 }}>
      <TabPanel value={value} index={0}>
        <Search
          clickedNodeId={clickedNodeId}
          setClickedNodeId={setClickedNodeId}
          graphData={graphData}
          setGraphData={setGraphData}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MyConcert />
      </TabPanel>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{
            "& .Mui-selected, .Mui-selected > svg": {
              color: "#1565c0",
            },
          }}
        >
          <BottomNavigationAction label="検索" icon={<SearchIcon />} />
          <BottomNavigationAction
            label="My 演奏会"
            icon={<FormatListNumberedIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default Mobile;

import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";

import works from "@/assets/works_v03.json";

function getWorks(page) {
  works.sort((a, b) => {
    if (a.composer < b.composer) {
      return -1;
    }
    if (a.composer > b.composer) {
      return 1;
    }
    return 0;
  });
  return works.slice(page * 100, page * 100 + 100);
}

export default function PinnedSubheaderList() {
  const works = getWorks(0);
  const composers = Array.from(new Set(works.map((work) => work.composer)));
  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        position: "relative",
        overflow: "auto",
        maxHeight: "80vh",
        "& ul": { padding: 0 },
      }}
      subheader={<li />}
    >
      {composers.map((composer) => (
        <li key={`section-${composer.replace(/\s+/g, "-")}`}>
          <ul>
            <ListSubheader>{composer}</ListSubheader>
            {works
              .filter((work) => work.composer === composer)
              .map((work) => (
                <ListItem key={`item-${work.id}`}>
                  <ListItemText primary={work.title} />
                </ListItem>
              ))}
          </ul>
        </li>
      ))}
    </List>
  );
}

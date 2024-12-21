import React from "react";
import { Typography, Box, Button, Divider } from "@mui/material";
import { durationFormat } from "@/utils/calcTime";
import { getWorkFormulaText } from "@/utils/getWorkFormulaText";

const SongPlayedTogether = (props) => {
  const { node, Data, setClickedNodeId } = props;
  const { links } = Data;

  const linkNodes = new Set();

  if (links != null && links.length !== 0) {
    links.forEach((link) => {
      if (link.source === node || link.target === node) {
        linkNodes.add(link.source);
        linkNodes.add(link.target);
      }
    });
    linkNodes.delete(node);
  }

  const linkNodesArray = Array.from(linkNodes);

  if (linkNodesArray.length === 0) return;

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        よく一緒に演奏されている曲
      </Typography>
      {linkNodesArray.map((work, index) => {
        const workFormulaText = getWorkFormulaText(work.workFormula);

        return (
          <Button
            key={index}
            onClick={() => {
              setClickedNodeId(work.id);
            }}
            sx={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "8px",
              mb: 2,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              "&:focus": {
                outline: "none",
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              },
            }}
          >
            <Typography variant="body2" component="div">
              {`${work.composer} ${
                work.birth || work.death
                  ? ` (${work.birth || ""} 〜 ${work.death || ""})`
                  : ""
              }`}
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {work.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {work.year === null ? "" : "作曲年: " + work.year + "年"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {work.duration === null
                ? ""
                : "演奏時間: " + durationFormat(work.duration)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {workFormulaText ? "楽器編成: " + workFormulaText : ""}
            </Typography>
          </Button>
        );
      })}
    </Box>
  );
};

export default SongPlayedTogether;

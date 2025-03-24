import React from "react";
import { Typography, Box, Button, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { durationFormat } from "@/utils/calcTime";
import { getWorkFormulaText } from "@/utils/getWorkFormulaText";

const SongPlayedTogether = (props) => {
  const { node, Data, setClickedNodeId } = props;
  const { links } = Data;
  const { t, i18n } = useTranslation();

  const linkNodes = new Set();

  if (links != null && links.length !== 0) {
    links.forEach((link) => {
      if (link.source === node || link.target === node) {
        linkNodes.add({
          ...link.target,
          amount: link.amount,
        });
        linkNodes.add({
          ...link.source,
          amount: link.amount,
        });
      }
    });
    for (const linkNode of linkNodes) {
      if (linkNode.id === node.id) {
        linkNodes.delete(linkNode);
      }
    }
  }

  const linkNodesArray = Array.from(linkNodes).sort((a, b) => {
    return b.amount - a.amount;
  });

  if (linkNodesArray.length === 0) return;
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        {t("vis.NodeInfo.SongPlayedTogether.performedTogether")}
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
              {`${work.composer} ${work.birth || work.death
                ? ` (${work.birth || ""}${t("common.tilde")}${work.death || ""})`
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
            <Typography variant="body2" color="text.secondary">
              {(() => {
                if (work.amount == null) return "";
                else if (work.amount <= 2) return t("vis.NodeInfo.SongPlayedTogether.degreeOfCoperformance", { degree: "★☆☆" });
                else if (work.amount <= 4) return t("vis.NodeInfo.SongPlayedTogether.degreeOfCoperformance", { degree: "★★☆" });
                else return t("vis.NodeInfo.SongPlayedTogether.degreeOfCoperformance", { degree: "★★★" });
              })()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {work.year === null ? "" : t("vis.NodeInfo.SongPlayedTogether.yearOfComposition", { year: work.year })}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {work.duration === null
                ? ""
                : t("vis.NodeInfo.SongPlayedTogether.duration", { duration_time: durationFormat(work.duration, i18n.resolvedLanguage) })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {workFormulaText ? t("vis.NodeInfo.SongPlayedTogether.instrumentation", { workFormulaText }) : ""}
            </Typography>
          </Button>
        );
      })}
    </Box>
  );
};

export default SongPlayedTogether;

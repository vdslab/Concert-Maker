import React from "react";
import {
  Paper,
  Typography,
  Divider,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import { musicServices } from "./musicServices";
import BasicInfomation from "./BasicInfomation";
import DetailInfomation from "./DetailInfomation";

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "30px",
  left: "10px",
  width: "400px",
  height: "calc(100vh - 100px)",
  // maxHeight: "calc(100vh - 100px)",
  overflowY: "auto",
}));

const NodeInfo = ({ node, onClose }) => {
  if (!node) return null;

  console.log(node);

  const relatedWorks = [
    {
      title: node.title,
      composer: node.composer,
      duration: `${node.duration}分`,
      workFormulaStr: node.workFormulaStr,
    },
  ];

  return (
    <StyledPaper>
      <BasicInfomation node={node} onClose={onClose} />
      <Divider />
      <DetailInfomation node={node} />
      <Divider />
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          聴く
        </Typography>
        <Grid container spacing={2} justifyContent="space-between">
          {musicServices.map((service, index) => (
            <Grid item key={index}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <img
                  src={service.icon}
                  alt={service.name}
                  style={{ width: 40, height: 40, marginBottom: 5 }}
                />
                <Typography variant="caption">{service.name}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Divider />
      {/* クリックされたノードと関連する曲を取り出す作業を行う予定 */}
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          よく一緒に演奏されている曲
        </Typography>
        {relatedWorks.map((work, index) => (
          <Box key={index} mb={2}>
            <Typography variant="subtitle1">{work.title}</Typography>
            <Typography variant="body2">{work.composer}</Typography>
            <Typography variant="body2" color="textSecondary">
              演奏時間: {work.duration} | {work.workFormulaStr}
            </Typography>
          </Box>
        ))}
      </Box>
    </StyledPaper>
  );
};

export default NodeInfo;

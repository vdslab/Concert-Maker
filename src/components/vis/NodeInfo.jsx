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
import CloseIcon from "@mui/icons-material/Close";
import SplitButton from "./SplitButton";
import { musicServices } from "./musicServices";

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "30px",
  left: "10px",
  width: "400px",
  height: "calc(100vh - 100px)",
  // maxHeight: "calc(100vh - 100px)",
  overflowY: "auto",
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "10px",
  right: "10px",
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
      <Box p={2} position="relative">
        <StyledIconButton onClick={onClose}>
          <CloseIcon />
        </StyledIconButton>
        <Box mt={5}>
          <Typography variant="body">{node.composer}</Typography>
          <Typography variant="h6" gutterBottom>
            {node.title}
          </Typography>
          <Typography variant="body2" gutterBottom>
            演奏時間: {node.duration}分
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {node.workFormulaStr}
          </Typography>
        </Box>
        <SplitButton songId={node.workFormulaStr} />
      </Box>
      <Divider />
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          詳細情報
        </Typography>
        <Grid container spacing={2}>
          {node.workMovements.map((movement, index) => (
            <>
              <Grid item xs={12} container>
                <Grid item xs={10}>
                  <Typography>{movement}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="right">
                    {node.workMovementDuration[index]}
                  </Typography>
                </Grid>
              </Grid>
            </>
          ))}
        </Grid>
      </Box>
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

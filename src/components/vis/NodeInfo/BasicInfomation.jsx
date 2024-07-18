import { Typography, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SplitButton from "../SplitButton";
import { styled } from "@mui/system";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "5px",
  right: "5px",
}));

const BasicInfomation = ({ node, onClose }) => {
  return (
    <>
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
        <SplitButton songId={node.id} />
      </Box>
    </>
  );
};

export default BasicInfomation;

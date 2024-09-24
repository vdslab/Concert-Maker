import { Typography, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SplitButton from "@/components/layouts/SplitButton";
import { styled } from "@mui/system";
import { durationFormat } from "@/utils/calcTime";

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
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {node.duration === null
              ? ""
              : "演奏時間: " + durationFormat(node.duration)}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {node.workFormulaStr === ""
              ? ""
              : "楽器編成: " + node.workFormulaStr.replace(/\n/g, " / ")}
          </Typography>
        </Box>
        <SplitButton
          workId={node.id}
          node={node}
        />
      </Box>
    </>
  );
};

export default BasicInfomation;

import { Typography, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SplitButton from "@/components/layouts/SplitButton";
import { styled } from "@mui/system";
import { durationFormat } from "@/utils/calcTime";
import { getWorkFormulaText } from "@/utils/getWorkFormulaText";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "8px",
  right: "12px",
  color: "rgba(0, 0, 0, 0.3)",
  transition: "color 0.2s ease",
  "&:hover": {
    color: "rgba(0, 0, 0, 0.87)",
  },
}));

const FixedHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== "showBorder",
})(({ showBorder }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: "white",
  zIndex: 1,
  padding: "12px 16px",
  paddingBottom: "4px",
  transition: "border-bottom 0.3s ease",
  borderBottom: showBorder ? "1px solid rgba(0, 0, 0, 0.12)" : "none",
}));

const TitleBox = styled(Box)({
  marginTop: 0,
});

const ScrollableContent = styled(Box)({
  padding: "16px",
  paddingTop: "4px",
});

const BasicInfomation = ({ node, onClose, showBorder }) => {
  const workFormulaText = getWorkFormulaText(node.workFormula);

  return (
    <>
      <FixedHeader showBorder={showBorder}>
        <StyledIconButton onClick={onClose}>
          <CloseIcon />
        </StyledIconButton>
        <TitleBox>
          <Typography variant="body">
            {`${node.composer} ${
              node.birth || node.death
                ? ` (${node.birth || ""}〜${node.death || ""})`
                : ""
            }`}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ marginBottom: 1 }}>
            {node.title}
          </Typography>
        </TitleBox>
      </FixedHeader>
      <ScrollableContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {node.year === null ? "" : "作曲年: " + node.year + "年"}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {node.duration === null
            ? ""
            : "演奏時間: " + durationFormat(node.duration)}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {workFormulaText ? "楽器編成: " + workFormulaText : ""}
        </Typography>
        <SplitButton workId={node.id} node={node} />
      </ScrollableContent>
    </>
  );
};

export default BasicInfomation;

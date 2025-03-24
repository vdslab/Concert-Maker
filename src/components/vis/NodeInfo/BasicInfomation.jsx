import { Typography, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SplitButton from "@/components/layouts/SplitButton";
import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import { durationFormat } from "@/utils/calcTime";
import { getWorkFormulaText } from "@/utils/getWorkFormulaText";
import { getWorksJson } from "@/utils/processJson";

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
  const data = getWorksJson();
  console.log(data);
  const { t, i18n } = useTranslation();
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
                ? ` (${node.birth || ""}${t("common.tilde")}${node.death || ""})`
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
          {node.year === null ? "" : t("vis.NodeInfo.BasicInfomation.yearOfComposition", { year: node.year })}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {node.duration === null
            ? ""
            : t("vis.NodeInfo.BasicInfomation.duration", { duration_time: durationFormat(node.duration, i18n.resolvedLanguage) })}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {workFormulaText ? t("vis.NodeInfo.BasicInfomation.instrumentation", { workFormulaText }) : ""}
        </Typography>
        <SplitButton workId={node.id} node={node} />
      </ScrollableContent>
    </>
  );
};

export default BasicInfomation;

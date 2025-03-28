import Google from "@/assets/img/google.svg";
import Wiki from "@/assets/img/wikipedia.svg";
import { Typography, Box, Stack, Tooltip, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";

const getMusicServices = () => {
  const { t } = useTranslation();
  return [
    {
      name: t("vis.NodeInfo.SiteButton.google"),
      icon: Google,
      url: "https://www.google.com/search?q=",
      enabled: true,
    },
    {
      name: t("vis.NodeInfo.SiteButton.wikipedia"),
      icon: Wiki,
      url: "https://ja.wikipedia.org/w/index.php?search=",
      enabled: true,
    },
    {
      name: t("vis.NodeInfo.SiteButton.imslp"),
      icon: "https://upload.wikimedia.org/wikipedia/commons/9/98/IMSLP_logo_(2016).svg",
      url: "https://www.google.com/search?q=site:imslp.org+",
      enabled: true,
    },
  ]
};

const MusicButton = ({ node }) => {
  const { t } = useTranslation();
  const { title, composer } = node;
  const searchQuery = encodeURIComponent(`${title} (${composer})`);

  return (
    <Box p={2}>
      <Typography variant="h6">{t("vis.NodeInfo.SiteButton.search")}</Typography>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-evenly"
        alignItems="center"
      >
        {getMusicServices().map((service, index) => {
          const button = (
            <Box display="flex" flexDirection="column" alignItems="center">
              <IconButton
                href={`${service.url}${searchQuery}`}
                target="_blank"
                disabled={!service.enabled}
                aria-label={service.name}
                sx={{
                  width: 60,
                  height: 60,
                  cursor: "pointer",
                }}
              >
                <img
                  src={service.icon}
                  alt={service.name}
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: "contain",
                    filter: service.enabled ? "none" : "grayscale(100%)",
                  }}
                />
              </IconButton>
              <Typography variant="caption">{service.name}</Typography>
            </Box>
          );

          return service.enabled ? (
            <Box key={index}>{button}</Box>
          ) : (
            <Tooltip key={index} title={t("vis.NodeInfo.SiteButton.serviceUnavailable")}>
              {button}
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
};

export default MusicButton;

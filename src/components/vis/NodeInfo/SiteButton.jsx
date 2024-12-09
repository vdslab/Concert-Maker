import Google from "@/assets/img/google.svg";
import { Typography, Box, Grid, Tooltip } from "@mui/material";

const musicServices = [
  {
    name: "Google",
    icon: Google,
    url: "https://www.google.com/search?q=",
    enabled: true,
  },
  {
    name: "IMSLP",
    icon: "https://upload.wikimedia.org/wikipedia/commons/9/98/IMSLP_logo_(2016).svg",
    url: "https://www.google.com/search?q=site:imslp.org+",
    enabled: true,
  },
  {
    name: "Wikipedia",
    icon: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Wikipedia-logo-v2-en.svg",
    url: "https://ja.wikipedia.org/w/index.php?search=",
    enabled: true,
  },
];

const SiteButton = ({ node }) => {
  const { title, composer } = node;
  const searchQuery = encodeURIComponent(`${composer}: ${title}`);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        調べる
      </Typography>
      <Grid container spacing={2} justifyContent="space-evenly">
        {musicServices.map((service, index) => {
          const buttonContent = (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                cursor: service.enabled ? "pointer" : "not-allowed",
              }}
            >
              <img
                src={service.icon}
                alt={service.name}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "contain",
                  filter: service.enabled ? "none" : "grayscale(100%)",
                }}
              />
              <Typography variant="caption">{service.name}</Typography>
            </Box>
          );

          return (
            <Grid item key={index} xs={4}>
              {service.enabled ? (
                <a
                  href={`${service.url}${searchQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {buttonContent}
                </a>
              ) : (
                <Tooltip title="このサービスは現在利用できません">
                  <Box>{buttonContent}</Box>
                </Tooltip>
              )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SiteButton;

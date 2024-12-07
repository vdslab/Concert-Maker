import SpotifyIcon from "@/assets/img/Spotify_Icon.png";
import YoutubeIcon from "@/assets/img/YouTube.png";
import AmazonIcon from "@/assets/img/Amazon_Music.png";
import AppleIcon from "@/assets/img/Apple_Music_Icon.svg";
import { Typography, Box, Grid, Tooltip } from "@mui/material";

const musicServices = [
  {
    name: "YouTube",
    icon: YoutubeIcon,
    url: "https://www.youtube.com/results?search_query=",
    enabled: true,
  },
  {
    name: "Apple Music",
    icon: AppleIcon,
    url: "https://music.apple.com/jp/search?term=",
    enabled: true,
  },
  {
    name: "Spotify",
    icon: SpotifyIcon,
    url: "https://open.spotify.com/search/",
    enabled: true,
  },
  {
    name: "Amazon Music",
    icon: AmazonIcon,
    url: "https://music.amazon.com/search/",
    enabled: false,
  },
];

const MusicButton = ({ node }) => {
  const { title, composer } = node;
  const searchQuery = encodeURIComponent(`${composer}: ${title}`);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        聴く
      </Typography>
      <Grid container spacing={2} justifyContent="space-between">
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
                  width: 40,
                  height: 40,
                  marginBottom: 5,
                  objectFit: "contain",
                  filter: service.enabled ? null : "grayscale(100%)",
                }}
              />
              <Typography variant="caption">{service.name}</Typography>
            </Box>
          );

          return (
            <Grid item key={index}>
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

export default MusicButton;

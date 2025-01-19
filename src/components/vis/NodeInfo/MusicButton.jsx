import SpotifyIcon from "@/assets/img/Spotify_Icon.png";
import YoutubeIcon from "@/assets/img/YouTube.png";
import AmazonIcon from "@/assets/img/Amazon_Music.png";
import AppleIcon from "@/assets/img/Apple_Music_Icon.svg";
import { Typography, Box, Stack, Tooltip, IconButton } from "@mui/material";

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
    enabled: true,
  },
];

const MusicButton = ({ node }) => {
  const { title, composer } = node;
  const searchQuery = encodeURIComponent(`${composer}: ${title}`);

  return (
    <Box p={2}>
      <Typography variant="h6">聴く</Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-evenly"
        alignItems="center"
      >
        {musicServices.map((service, index) => {
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
            <Tooltip key={index} title="このサービスは現在利用できません">
              {button}
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
};

export default MusicButton;

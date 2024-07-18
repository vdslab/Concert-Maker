import SpotifyIcon from "../../assets/Spotify_Icon.png";
import YoutubeIcon from "../../assets/YouTube_Music.png";
import AmazonIcon from "../../assets/Amazon_Music.png";
import AppleIcon from "../../assets/Apple_Music_Icon.svg";
import { Typography, Box, Grid, IconButton } from "@mui/material";

const musicServices = [
  {
    name: "Spotify",
    icon: SpotifyIcon,
    url: "https://open.spotify.com/search/",
  },
  {
    name: "YouTube Music",
    icon: YoutubeIcon,
    url: "https://music.youtube.com/search?q=",
  },
  {
    name: "Apple Music",
    icon: AppleIcon,
    url: "https://music.apple.com/search?term=",
  },
  {
    name: "Amazon Music",
    icon: AmazonIcon,
    url: "https://music.amazon.com/search/",
  },
];

const MusicButton = () => {
  const handleClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        聴く
      </Typography>
      <Grid container spacing={2} justifyContent="space-between">
        {musicServices.map((service, index) => (
          <Grid item key={index}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <IconButton onClick={() => handleClick(service.url)}>
                <img
                  src={service.icon}
                  alt={service.name}
                  style={{ width: 40, height: 40 }}
                />
              </IconButton>
              <Typography variant="caption">{service.name}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MusicButton;

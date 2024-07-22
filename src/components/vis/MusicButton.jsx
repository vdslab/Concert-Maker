import SpotifyIcon from "../../assets/Spotify_Icon.png";
import YoutubeIcon from "../../assets/YouTube_Music.png";
import AmazonIcon from "../../assets/Amazon_Music.png";
import AppleIcon from "../../assets/Apple_Music_Icon.svg";
import { Typography, Box, Grid } from "@mui/material";

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
    url: "https://music.apple.com/jp/search?term=",
  },
  {
    name: "Amazon Music",
    icon: AmazonIcon,
    url: "https://music.amazon.com/search/",
  },
];

const MusicButton = ({ node }) => {
  const { title, composer } = node;
  const searchQuery = encodeURIComponent(`${title} ${composer}`);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        聴く
      </Typography>
      <Grid container spacing={2} justifyContent="space-between">
        {musicServices.map((service, index) => (
          <Grid item key={index}>
            <a
              href={`${service.url}${searchQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <img
                  src={service.icon}
                  alt={service.name}
                  style={{ width: 40, height: 40, marginBottom: 5 }}
                />
                <Typography variant="caption">{service.name}</Typography>
              </Box>
            </a>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MusicButton;

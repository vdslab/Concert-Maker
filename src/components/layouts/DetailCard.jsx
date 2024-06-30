import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Works from "../../assets/works_v03.json";
import AppleMusic from "../../assets/Apple_Music_Icon.svg";
import Spotify from "../../assets/Spotify_Icon.png";
import YouTube from "../../assets/YouTube_Music.png";
import AmazonMusic from "../../assets/Amazon_Music.png";

const DetailCard = ({ clicknode }) => {
  let Data = null;
  if (clicknode) Data = Works.find((item) => item.id === clicknode.id);
  else return <div></div>;

  const handleButtonClick = (event) => {
    event.stopPropagation();
    console.log(Data);
  };

  const buttonStyle = {
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    minWidth: "60px",
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginBottom: "8px",
  };

  const imageStyle = {
    width: "70%",
    height: "70%",
    objectFit: "contain",
  };

  return (
    <div style={{ margin: "20px" }}>
      <Accordion sx={{ backgroundColor: "#e0e0e0" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Grid>
            <Typography sx={{ fontSize: "1.2rem" }}>
              {Data.composer}/{Data.title}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              演奏時間：{Data.duration}分
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {/* 未対応 Vn.I: 14, Vn.II: 12, Va.: 10, Vc.: 8, Cb: 6, Fl.: 2, Ob.:
              2, Cl.: 2, Bsn.:3[1.2.cbn], Hrn.: 4, Trp.: 2, Trb.: 3, Tub.: 0 */}
              {Data.workFormulaStr}
            </Typography>
            <button onClick={handleButtonClick}>登録ボタン実装予定</button>
          </Grid>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "#f0f0f0" }}>
          <Grid container spacing={2}>
            {Data.workMovements.map((movement, index) => (
              <Grid item xs={12} container key={index}>
                <Grid item xs={10}>
                  <Typography>{movement}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography align="right">
                    {Data.workMovementDuration[index]}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography>聴く</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            container
            spacing={2}
            justifyContent="center"
            alignItems="flex-start"
          >
            {[
              {
                name: "Spotify",
                icon: Spotify,
                url: "https://open.spotify.com/",
              },
              {
                name: "YouTube",
                icon: YouTube,
                url: "https://music.youtube.com/",
              },
              {
                name: "Apple Music",
                icon: AppleMusic,
                url: "https://music.apple.com/jp/",
              },
              {
                name: "Amazon Music",
                icon: AmazonMusic,
                url: "https://music.amazon.co.jp/",
              },
            ].map((service) => (
              <Grid
                key={service.name}
                item
                xs={3}
                container
                direction="column"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  sx={buttonStyle}
                  onClick={() => window.open(service.url)}
                >
                  <img
                    src={service.icon}
                    alt={service.name}
                    style={imageStyle}
                  />
                </Button>
                <Typography align="center" variant="caption">
                  {service.name}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default DetailCard;

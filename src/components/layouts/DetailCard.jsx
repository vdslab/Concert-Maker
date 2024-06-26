import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DetailCard = () => {
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
              ブラームス／交響曲第1番 op68 ハ短調
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              演奏時間：45分
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Vn.I: 14, Vn.II: 12, Va.: 10, Vc.: 8, Cb: 6, Fl.: 2, Ob.: 2, Cl.:
              2, Bsn.:3[1.2.cbn], Hrn.: 4, Trp.: 2, Trb.: 3, Tub.: 0
            </Typography>
          </Grid>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "#f0f0f0" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} container>
              <Grid item xs={10}>
                <Typography>I. Un poco sostenuto; Allegro</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography align="right">13分</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={10}>
                <Typography>II. Andante sostenuto</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography align="right">10分</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={10}>
                <Typography>III. Un poco allegretto e grazioso</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography align="right">5分</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={10}>
                <Typography>
                  IV. Adagio; Più andante; Allegro non troppo, ma con brio
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography align="right">17分</Typography>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default DetailCard;

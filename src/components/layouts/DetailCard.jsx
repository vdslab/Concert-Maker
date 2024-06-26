import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Works from "../../assets/works_v02.json";

const DetailCard = ({ clicknode }) => {
  let Data = null;
  if (clicknode) Data = Works.find((item) => item.id === clicknode.id);
  else return <div></div>;

  const handleButtonClick = (event) => {
    event.stopPropagation();
    console.log(Data);
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
              未対応 Vn.I: 14, Vn.II: 12, Va.: 10, Vc.: 8, Cb: 6, Fl.: 2, Ob.:
              2, Cl.: 2, Bsn.:3[1.2.cbn], Hrn.: 4, Trp.: 2, Trb.: 3, Tub.: 0
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
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default DetailCard;

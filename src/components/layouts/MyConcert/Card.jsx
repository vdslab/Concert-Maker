import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { sumDurationFormat, durationFormat } from "@/utils/calcTime";

import PropTypes from "prop-types";

MyConcertCard.propTypes = {
  concert: PropTypes.shape({
    name: PropTypes.string.isRequired,
    works: PropTypes.arrayOf(
      PropTypes.shape({
        composer: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        duration: PropTypes.number.isRequired,
        workFormulaStr: PropTypes.string.isRequired,
        workFormula: PropTypes.arrayOf(PropTypes.string).isRequired,
        workFormula_perc: PropTypes.string,
        workMovements: PropTypes.arrayOf(PropTypes.string).isRequired,
        workMovementDuration: PropTypes.arrayOf(PropTypes.string),
        workSources: PropTypes.arrayOf(PropTypes.string).isRequired,
        playedWith: PropTypes.array,
        strYear: PropTypes.string,
        year: PropTypes.number.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default function MyConcertCard(props) {
  const { concert } = props;
  const { name, works } = concert;

  const sum_duration = sumDurationFormat(works.map((work) => work.duration));

  return (
    <Card elevation={3}>
      <Box sx={{ p: 2 }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Button variant="contained" color="secondary" size="small">
                Main
              </Button>
              <Typography gutterBottom variant="h5" component="div">
                {name}
              </Typography>
            </Stack>
          </Grid>

          <Grid item>
            <Typography gutterBottom variant="h6" component="div">
              {sum_duration}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <WorkList works={works} />
      </Box>
    </Card>
  );
}

WorkList.propTypes = {
  works: PropTypes.arrayOf(
    PropTypes.shape({
      composer: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      workFormulaStr: PropTypes.string.isRequired,
      workFormula: PropTypes.arrayOf(PropTypes.string).isRequired,
      workFormula_perc: PropTypes.string,
      workMovements: PropTypes.arrayOf(PropTypes.string).isRequired,
      workMovementDuration: PropTypes.arrayOf(PropTypes.string),
      workSources: PropTypes.arrayOf(PropTypes.string).isRequired,
      playedWith: PropTypes.array,
      strYear: PropTypes.string,
      year: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

function WorkList(props) {
  const { works } = props;

  if (works.length === 0) {
    return (
      <Typography variant="body1" align="center">
        曲を追加してください
      </Typography>
    );
  }

  return (
    <Box>
      {works.map((work, index) => {
        const duration_time = durationFormat(work.duration);
        return (
          <div key={work.id}>
            {index !== 0 && <Divider />}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" component="div">
                {work.title}
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Typography variant="body1" component="div">
                  {work.composer}
                </Typography>
                <Typography variant="body2" component="div">
                  {duration_time}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" component="div">
                  {work.workFormulaStr.split("\n").map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </Typography>
              </Stack>
            </Box>
          </div>
        );
      })}
    </Box>
  );
}

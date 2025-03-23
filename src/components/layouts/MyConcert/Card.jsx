/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useId } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import ConcertMenus from "./ConcertMenus";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InsightsIcon from "@mui/icons-material/Insights";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import CalloutPopover from "@/components/layouts/CalloutPopover";
import InsightsModal from "@/components/layouts/MyConcert/InsightsModal";
import WorkList from "@/components/layouts/MyConcert/WorkList";

import { sumDurationFormat } from "@/utils/calcTime";

import {
  selectedConcertState,
  concertsState,
  concertListState,
} from "@/components/RecoilStates";
import { useSetRecoilState, useRecoilValue } from "recoil";

import { useTranslation } from "react-i18next";

export default function MyConcertCard(props) {
  const { concert, setClickedNodeId, Data } = props;
  const { id, name, works } = concert;
  const [editMode, setEditMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [openInsight, setOpenInsight] = useState(false);

  const [openCallout, setOpenCallout] = useState(false); // 吹き出し用
  const anchorRef = useRef(null); // 吹き出し用
  const calloutId = useId(); // 吹き出し用。CalloutPopover のアクセシビリティ属性として渡す ID

  const workList = useRecoilValue(concertListState);
  const selectConcert = useSetRecoilState(selectedConcertState);
  const setConcerts = useSetRecoilState(concertsState);

  const { t, i18n } = useTranslation();

  const sum_duration = sumDurationFormat(
    works.map((work) =>
      !work.selectedMovements ||
        work.workMovementDuration.length <= 1 ||
        work.workMovementDuration[0] === "'"
        ? work.duration
        : work.selectedMovements
          .map((duration) =>
            parseInt(work.workMovementDuration[duration].replace("'", ""))
          )
          .reduce((x, y) => x + y)
    ),
    i18n.resolvedLanguage
  );

  const InsightsWorks = {
    concert: id,
    name: workList.find((work) => work.id === id).name,
    works: works.map((work) => {
      return {
        work: work.id,
        movements: work.selectedMovements,
      };
    }),
  };

  // 吹き出しを閉じたとき
  const handleCalloutClose = () => {
    setOpenCallout(false);
    localStorage.setItem("isMainUnderstood", "true");
  };

  // 吹き出しを出すかどうかの判定
  useEffect(() => {
    const targetConcert = workList.find((item) => !item.main);
    if (targetConcert && targetConcert.id === id) {
      const isMainUnderstood =
        localStorage.getItem("isMainUnderstood") === "true";
      !isMainUnderstood && setOpenCallout(true);
    }
  }, []);

  // モバイル用のコンテンツレンダリング
  const renderMobileContent = () => (
    <>
      {editMode ? (
        <TextField
          id="my-concert-name"
          label={t("layouts.MyConcert.Card.myConcertName")}
          variant="standard"
          defaultValue={name}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              const newName = e.target.value.trim();
              if (newName === "") {
                // 空欄の場合は元の名前に戻す
                e.target.value = name;
              } else {
                setConcerts((concerts) =>
                  concerts.map((concert) =>
                    concert.id === id ? { ...concert, name: newName } : concert
                  )
                );
              }
              setEditMode(false);
            }
          }}
          helperText={t("layouts.MyConcert.Card.toConfirm")}
        />
      ) : (
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={0}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h5"
              component="div"
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
              sx={{ mb: 0.5 }}
            >
              {name}
            </Typography>
            <IconButton
              aria-label="edit"
              onClick={() => {
                setEditMode(true);
              }}
              sx={{ ml: 1 }}
            >
              <EditIcon />
            </IconButton>
          </Box>
          <Typography
            variant="h6"
            component="div"
            color="text.secondary"
            whiteSpace="nowrap"
          >
            {sum_duration}
          </Typography>
        </Stack>
      )}
    </>
  );

  // PC用のコンテンツレンダリング
  const renderDesktopContent = () => (
    <>
      {editMode ? (
        <TextField
          id="my-concert-name"
          label={t("layouts.MyConcert.Card.myConcertName")}
          variant="standard"
          defaultValue={name}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              const newName = e.target.value.trim();
              if (newName === "") {
                // 空欄の場合は元の名前に戻す
                e.target.value = name;
              } else {
                setConcerts((concerts) =>
                  concerts.map((concert) =>
                    concert.id === id ? { ...concert, name: newName } : concert
                  )
                );
              }
              setEditMode(false);
            }
          }}
          helperText={t("layouts.MyConcert.Card.toConfirm")}
        />
      ) : (
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            textOverflow="ellipsis"
            overflow="hidden"
            whiteSpace="nowrap"
          >
            {name}
          </Typography>
          <IconButton
            aria-label="edit"
            onClick={() => {
              setEditMode(true);
            }}
          >
            <EditIcon />
          </IconButton>
        </Stack>
      )}
    </>
  );

  return (
    <>
      <Card
        elevation={3}
        sx={{
          m: { xs: 1, sm: 0 },
        }}
      >
        <InsightsModal
          myConcert={InsightsWorks}
          open={openInsight}
          setOpen={setOpenInsight}
        />
        <Box sx={{ p: 2 }}>
          {isMobile ? (
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems={isMobile ? "flex-start" : "center"}
              spacing={2}
            >
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                <Grid size="auto">
                  <Button
                    variant="contained"
                    color={concert.main ? "secondary" : "inherit"}
                    size="small"
                    onClick={() => {
                      selectConcert(id);
                    }}
                    ref={anchorRef}
                  >
                    {t("layouts.MyConcert.Card.main")}
                  </Button>
                </Grid>
                <Grid size="grow">
                  {isMobile ? renderMobileContent() : renderDesktopContent()}
                </Grid>
                <Grid size="auto">
                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                  >
                    {!isMobile && (
                      <Typography gutterBottom variant="h6" component="div">
                        {sum_duration}
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      color="info"
                      style={{ borderRadius: 20 }}
                      startIcon={<InsightsIcon />}
                      onClick={() => {
                        setOpenInsight(true);
                      }}
                      data-tour-id="a-04"
                    >
                      {t("layouts.MyConcert.Card.analyze")}
                    </Button>
                    <ConcertMenus id={id} />
                  </Stack>
                </Grid>
              </Stack>
            </Grid>
          ) : (
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems={isMobile ? "flex-start" : "center"}
              spacing={2}
            >
              <Grid size="auto">
                <Button
                  variant="contained"
                  color={concert.main ? "secondary" : "inherit"}
                  size="small"
                  onClick={() => {
                    selectConcert(id);
                  }}
                  ref={anchorRef}
                >
                  {t("layouts.MyConcert.Card.main")}
                </Button>
              </Grid>
              <Grid size="grow">
                {isMobile ? renderMobileContent() : renderDesktopContent()}
              </Grid>
              <Grid size="auto">
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                >
                  {!isMobile && (
                    <Typography gutterBottom variant="h6" component="div">
                      {sum_duration}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    color="info"
                    style={{ borderRadius: 20 }}
                    startIcon={<InsightsIcon />}
                    onClick={() => {
                      setOpenInsight(true);
                    }}
                    data-tour-id="a-04"
                  >
                    {t("layouts.MyConcert.Card.analyze")}
                  </Button>
                  <ConcertMenus id={id} />
                </Stack>
              </Grid>
            </Grid>
          )}
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <WorkList
            works={works}
            concertID={id}
            setClickedNodeId={setClickedNodeId}
          />
        </Box>
      </Card>
      <CalloutPopover
        id={calloutId}
        open={openCallout}
        anchorEl={anchorRef.current}
        horizontal={"left"}
        left={30}
      >
        <DialogTitle sx={{ fontSize: 16 }}>{t("layouts.MyConcert.Card.changeWhereToAdd")}</DialogTitle>
        <DialogContent> 
          <DialogContentText sx={{ color: "white", maxWidth: "20em" }}>
            {t("layouts.MyConcert.Card.changeWhereToAddText")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleCalloutClose}
            sx={{ borderRadius: "2em", borderColor: "white", color: "white" }}
          >
            {t("layouts.MyConcert.Card.close")}
          </Button>
        </DialogActions>
      </CalloutPopover>
    </>
  );
}

import { useState, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from '@mui/material/Grid2';

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useTranslation } from "react-i18next";

const applyFilter = (filterValues, Data, setData) => {
  // ここでfilterValuesをDataに反映させる

  const checkFilters = (filterValues, node) => {
    // 入力されたフィルター値のみを対象にする
    const activeFilters = Object.entries(filterValues).filter(
      ([key, value]) => {
        if (typeof value === "object" && value !== null) {
          return value.since !== null || value.until !== null;
        }
        return value !== "" && value !== null;
      }
    );

    // すべてのアクティブなフィルターに対してチェックを行う
    return activeFilters.every(([key, value]) => {
      switch (key) {
        case "composer":
          return node.composer.toLowerCase().includes(value.toLowerCase());
        case "title":
          return node.title.toLowerCase().includes(value.toLowerCase());
        case "birth":
        case "death":
        case "composed":
          return checkDateRange(node["year"], value);
        case "duration":
          if (filterValues.durationIncludeNoData && node.duration === null)
            return true;
          return checkNumberRange(node.duration, value);
        case "flute":
        case "oboe":
        case "clarinet":
        case "bassoon":
        case "horn":
        case "trumpet":
        case "trombone":
        case "tuba":
        case "timpani":
        case "percussion":
        case "harp":
        case "keyboard":
          return checkNumberRange(node[key], value);
        case "strings":
          return checkStr(node.str, value);
        default:
          return true;
      }
    });
  };

  const checkStr = (nodeValue, filterData) => {
    if (filterData === null) return true;
    if (nodeValue === null) return false;
    return nodeValue === filterData;
  };

  // 日付範囲のチェック用関数
  const checkDateRange = (nodeDate, filterRange) => {
    if (!nodeDate) return false;
    const date = new Date(nodeDate);
    if (filterRange.since && date < new Date(filterRange.since)) return false;
    if (filterRange.until && date > new Date(filterRange.until)) return false;
    return true;
  };

  // 数値範囲のチェック用関数
  const checkNumberRange = (nodeValue, filterRange) => {
    if (nodeValue === null) return false;
    if (filterRange.since !== null && nodeValue < filterRange.since)
      return false;
    if (filterRange.until !== null && nodeValue > filterRange.until)
      return false;
    return true;
  };

  const updatedNodes = Data.nodes.map((node) => ({
    ...node,
    filter: checkFilters(filterValues, node) ? 1 : 0,
  }));

  const updatedData = {
    ...Data,
    nodes: updatedNodes,
  };

  setData(updatedData);
};

/**
 * 数値範囲入力のコンポーネントです。
 *
 * @param {Object} props - コンポーネントのpropsを格納するオブジェクトです。
 * @param {string} props.name - 数値を格納するプロパティ名の文字列です。
 * @param {string} props.unit - 数値の単位を表す文字列です。
 * @param {number} props.min - 数値の下限値です。
 * @param {number} props.max - 数値の上限値です。
 * @param {boolean} props.displayOnlyOneUnit - unitを末尾にのみ表示するかを表す真偽値です。
 * @param {Object} props.control - react-hook-formで使用するcontrolオブジェクトです。
 * @returns {JSX.Element}
 */
function NumberRangeInput({ name, unit, min, max, displayOnlyOneUnit, control }) {
  const { t } = useTranslation();

  const validateNumberRange = (from, to) => {
    from = from ?? min;
    to = to ?? Infinity;

    if (from >= min && to >= min) {
      if (from <= to) {
        return true;
      } else {
        return t("layouts.FilterDialog.invalidNumericRange");
      }
    } else {
      return t("layouts.FilterDialog.specifyRange", { min });
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value) => validateNumberRange(value.since, value.until),
      }}
      render={({
        field: { onChange, onBlur, value },
        formState: { errors },
      }) => (
        <Stack>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <OutlinedInput
              error={name in errors}
              type="number"
              id={`${name}-input`}
              aria-describedby={`${name}-helper-text`}
              onBlur={onBlur}
              onChange={(e) =>
                onChange({
                  ...value,
                  since: e.target.value !== "" ? Number(e.target.value) : null, // ToDo: 数式文字列も除外する
                })
              }
              value={value.since ?? ""}
              placeholder={t("layouts.FilterDialog.notSpec")}
              inputProps={{ min, max }}
              sx={{ width: "12ch", mr: "8px" }}
            />
            {displayOnlyOneUnit ? "" : unit} ～
            <OutlinedInput
              error={name in errors}
              type="number"
              aria-describedby={`${name}-helper-text`}
              onBlur={onBlur}
              onChange={(e) =>
                onChange({
                  ...value,
                  until: e.target.value !== "" ? Number(e.target.value) : null, // ToDo: 数式文字列も除外する
                })
              }
              value={value.until ?? ""}
              placeholder={t("layouts.FilterDialog.notSpec")}
              inputProps={{ min, max }}
              sx={{ width: "12ch", mx: "8px" }}
            />
            {unit}
          </Box>
          <FormHelperText id={`${name}-helper-text`} error>
            {errors[name]?.message}
          </FormHelperText>
        </Stack>
      )}
    />
  );
}

/**
 * 検索フィルターのダイアログのコンポーネントです。
 *
 * @param {Object} props - コンポーネントのpropsを格納するオブジェクトです。
 * @param {Object} props.Data - ネットワークのノードリンクデータを保持するstate変数のオブジェクトです。
 * @param {function} props.setData - state変数Dataを更新する関数です。
 * @returns {JSX.Element}
 */
export default function FilterDialog({ Data, setData }) {
  const { t, i18n } = useTranslation();

  const defaultFilterValues = {
    composer: "",
    title: "",
    birth: { since: null, until: null },
    death: { since: null, until: null },
    lifespan: { since: null, until: null },
    composed: { since: null, until: null },
    duration: { since: null, until: null },
    durationIncludeNoData: true,
    flute: { since: null, until: null },
    oboe: { since: null, until: null },
    clarinet: { since: null, until: null },
    bassoon: { since: null, until: null },
    horn: { since: null, until: null },
    trumpet: { since: null, until: null },
    trombone: { since: null, until: null },
    tuba: { since: null, until: null },
    timpani: { since: null, until: null },
    percussion: { since: null, until: null },
    harp: { since: null, until: null },
    keyboard: { since: null, until: null },
    strings: null,
  };

  const [open, setOpen] = useState(false);
  const [filterValues, setFilterValues] = useState(defaultFilterValues);
  const { control, handleSubmit, reset, setValue } = useForm({
    mode: "onBlur",
    defaultValues: filterValues,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInterruption = () => {
    handleClose();
    for (const name in filterValues) {
      setValue(name, filterValues[name]);
    }
  };

  const copyLifespanDatesToBirth = (newFilterValues) => {
    newFilterValues.birth.since = newFilterValues.lifespan.since;
    newFilterValues.birth.until = newFilterValues.lifespan.until;
  };

  const onSubmit = handleSubmit((newFilterValues, event) => {
    event.preventDefault();
    copyLifespanDatesToBirth(newFilterValues);
    applyFilter(newFilterValues, Data, setData);
    setFilterValues(newFilterValues);
    setOpen(false);
  });

  const onReset = () => {
    reset();
  };

  const countableInstrumentList = [
    { name: "flute", str: t("layouts.FilterDialog.flute") },
    { name: "oboe", str: t("layouts.FilterDialog.oboe") },
    { name: "clarinet", str: t("layouts.FilterDialog.clarinet") },
    { name: "bassoon", str: t("layouts.FilterDialog.bassoon") },
    { name: "horn", str: t("layouts.FilterDialog.horn") },
    { name: "trumpet", str: t("layouts.FilterDialog.trumpet") },
    { name: "trombone", str: t("layouts.FilterDialog.trombone") },
    { name: "tuba", str: t("layouts.FilterDialog.tuba") },
    { name: "timpani", str: t("layouts.FilterDialog.timpani") },
    { name: "percussion", str: t("layouts.FilterDialog.percussion") },
    { name: "harp", str: t("layouts.FilterDialog.harp") },
    { name: "keyboard", str: t("layouts.FilterDialog.keyboard") },
  ];

  return (
    <>
      {/* ダイアログを開くボタン */}
      <Tooltip title={t("layouts.FilterDialog.searchOptions")} data-tour-id="a-05">
        <IconButton
          color="primary"
          sx={{ p: "10px" }}
          onClick={handleClickOpen}
        >
          <TuneIcon />
        </IconButton>
      </Tooltip>
      {/* ダイアログの中身 */}
      <Dialog
        open={open}
        onClose={handleInterruption}
        PaperProps={{ component: "form", onSubmit, onReset }}
      >
        <DialogTitle>{t("layouts.FilterDialog.searchOptions")}</DialogTitle>
        <Tooltip title={t("layouts.FilterDialog.close")}>
          <IconButton
            onClick={handleInterruption}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
        <DialogContent>
          <Stack spacing={2}>
            {/* 作曲者名 */}
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 3 }}>
                <InputLabel
                  htmlFor="composer-input"
                  sx={{ fontWeight: 700, pt: { xs: 0, sm: "16.5px" } }}
                >
                  {t("layouts.FilterDialog.composer")}
                </InputLabel>
              </Grid>
              <Grid size={{ xs: 12, sm: 9 }}>
                <Controller
                  name="composer"
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput
                      {...field}
                      id="composer-input"
                      placeholder={t("layouts.FilterDialog.composerEnter")}
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
            {/* 存命期間 */}
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 3 }}>
                <InputLabel
                  htmlFor="lifespan-input"
                  sx={{ fontWeight: 700, pt: { xs: 0, sm: "16.5px" } }}
                >
                  {t("layouts.FilterDialog.lifespan")}
                </InputLabel>
              </Grid>
              <Grid size={{ xs: 12, sm: 9 }}>
                <NumberRangeInput
                  name="lifespan"
                  unit={t("layouts.FilterDialog.years")}
                  min={1000}
                  max={null}
                  displayOnlyOneUnit={i18n.resolvedLanguage !== "ja"}
                  control={control}
                />
              </Grid>
            </Grid>
            {/* 曲名 */}
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 3 }}>
                <InputLabel
                  htmlFor="title-input"
                  sx={{ fontWeight: 700, pt: { xs: 0, sm: "16.5px" } }}
                >
                  {t("layouts.FilterDialog.workTitle")}
                </InputLabel>
              </Grid>
              <Grid size={{ xs: 12, sm: 9 }}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput
                      {...field}
                      id="title-input"
                      placeholder={t("layouts.FilterDialog.workTitleEnter")}
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
            {/* 作曲年 */}
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 3 }}>
                <InputLabel
                  htmlFor="composed-input"
                  sx={{ fontWeight: 700, pt: { xs: 0, sm: "16.5px" } }}
                >
                  {t("layouts.FilterDialog.compositionYear")}
                </InputLabel>
              </Grid>
              <Grid size={{ xs: 12, sm: 9 }}>
                <NumberRangeInput
                  name="composed"
                  unit={t("layouts.FilterDialog.years")}
                  min={1000}
                  max={null}
                  displayOnlyOneUnit={i18n.resolvedLanguage !== "ja"}
                  control={control}
                />
              </Grid>
            </Grid>
            {/* 演奏時間 */}
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 3 }}>
                <InputLabel
                  htmlFor="duration-input"
                  sx={{ fontWeight: 700, pt: { xs: 0, sm: "16.5px" } }}
                >
                  {t("layouts.FilterDialog.duration")}
                </InputLabel>
              </Grid>
              <Grid size={{ xs: 12, sm: 9 }}>
                <NumberRangeInput
                  name="duration"
                  unit={t("layouts.FilterDialog.mins")}
                  min={0}
                  max={null}
                  displayOnlyOneUnit={i18n.resolvedLanguage !== "ja"}
                  control={control}
                />
                <Controller
                  name="durationIncludeNoData"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      {...field}
                      checked={field.value}
                      control={<Checkbox />}
                      label={t("layouts.FilterDialog.includeNoDuration")}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Stack>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {t("layouts.FilterDialog.instrumentation")}
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {/* 数値範囲で指定する楽器群 */}
                {countableInstrumentList.map((countableInstrument) => (
                  <Grid key={countableInstrument.name} container spacing={1}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <InputLabel
                        htmlFor={`${countableInstrument.name}-input`}
                        sx={{ fontWeight: 700, pt: { xs: 0, sm: "16.5px" } }}
                      >
                        {countableInstrument.str}
                      </InputLabel>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 9 }}>
                      <NumberRangeInput
                        name={countableInstrument.name}
                        unit={t("layouts.FilterDialog.players")}
                        min={0}
                        max={null}
                        displayOnlyOneUnit={i18n.resolvedLanguage !== "ja"}
                        control={control}
                      />
                    </Grid>
                  </Grid>
                ))}

                {/* 弦楽器 */}
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex", alignItems: "center" }}>
                    <InputLabel sx={{ fontWeight: 700 }}>{t("layouts.FilterDialog.strings")}</InputLabel>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 9 }}>
                    <Controller
                      name="strings"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          {...field}
                          onChange={(e) =>
                            field.onChange(JSON.parse(e.target.value))
                          }
                          row
                        >
                          <FormControlLabel
                            value="null"
                            control={<Radio />}
                            label={t("layouts.FilterDialog.unspecified")}
                          />
                          <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label={t("layouts.FilterDialog.yes")}
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label={t("layouts.FilterDialog.no")}
                          />
                        </RadioGroup>
                      )}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions>
          <Button type="reset" variant="text" sx={{ borderRadius: "100vh" }}>
            {t("layouts.FilterDialog.reset")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ borderRadius: "100vh" }}
          >
            {t("layouts.FilterDialog.search")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

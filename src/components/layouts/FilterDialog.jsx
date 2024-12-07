import { useState, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

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
 * @param {Object} props.control - react-hook-formで使用するcontrolオブジェクトです。
 * @returns {JSX.Element}
 */
function NumberRangeInput({ name, unit, min, max, control }) {
  const validateNumberRange = (from, to) => {
    from = from ?? min;
    to = to ?? Infinity;

    if (from >= min && to >= min) {
      if (from <= to) {
        return true;
      } else {
        return "数値の範囲が無効です。";
      }
    } else {
      return `${min}以上の範囲で指定してください。`;
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
              placeholder="指定なし"
              inputProps={{ min, max }}
              sx={{ width: "12ch", mr: "8px" }}
            />
            {unit} ～
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
              placeholder="指定なし"
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
 * @param {function} props.setIsFiltering - フィルタリング状態を更新する関数です。
 * @returns {JSX.Element}
 */
export default function FilterDialog({ Data, setData, setIsFiltering }) {
  const defaultFilterValues = {
    composer: "",
    title: "",
    birth: { since: null, until: null },
    death: { since: null, until: null },
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

  const onSubmit = handleSubmit((newFilterValues, event) => {
    event.preventDefault();
    applyFilter(newFilterValues, Data, setData);
    setFilterValues(newFilterValues);

    // フィルターがデフォルトと異なるかどうかを比較
    if (
      JSON.stringify(defaultFilterValues) !== JSON.stringify(newFilterValues)
    ) {
      setIsFiltering(true);
    } else {
      setIsFiltering(false);
    }

    setOpen(false);
  });

  const onReset = () => {
    reset();
  };

  const countableInstrumentList = [
    { name: "flute", str: "フルート" },
    { name: "oboe", str: "オーボエ" },
    { name: "clarinet", str: "クラリネット" },
    { name: "bassoon", str: "ファゴット" },
    { name: "horn", str: "ホルン" },
    { name: "trumpet", str: "トランペット" },
    { name: "trombone", str: "トロンボーン" },
    { name: "tuba", str: "チューバ" },
    { name: "timpani", str: "ティンパニ" },
    { name: "percussion", str: "パーカッション" },
    { name: "harp", str: "ハープ" },
    { name: "keyboard", str: "鍵盤楽器" },
  ];

  return (
    <>
      {/* ダイアログを開くボタン */}
      <Tooltip title="検索オプション">
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
        <DialogTitle>検索オプション</DialogTitle>
        <Tooltip title="閉じる">
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
          <Grid container spacing={2}>
            {/* 作曲者名 */}
            <Grid item xs={3}>
              <InputLabel
                htmlFor="composer-input"
                sx={{ fontWeight: 700, pt: "16.5px" }}
              >
                作曲者名
              </InputLabel>
            </Grid>
            <Grid item xs={9}>
              <Controller
                name="composer"
                control={control}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    id="composer-input"
                    placeholder="作曲者名を入力"
                    fullWidth
                  />
                )}
              />
            </Grid>
            {/* 曲名 */}
            <Grid item xs={3}>
              <InputLabel
                htmlFor="title-input"
                sx={{ fontWeight: 700, pt: "16.5px" }}
              >
                曲名
              </InputLabel>
            </Grid>
            <Grid item xs={9}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    id="title-input"
                    placeholder="曲名を入力"
                    fullWidth
                  />
                )}
              />
            </Grid>
            {/* 生年 */}
            <Grid item xs={3}>
              <InputLabel
                htmlFor="birth-input"
                sx={{ fontWeight: 700, pt: "16.5px" }}
              >
                作曲者の生年
              </InputLabel>
            </Grid>
            <Grid item xs={9}>
              <NumberRangeInput
                name="birth"
                unit="年"
                min={1000}
                max={null}
                control={control}
              />
            </Grid>
            {/* 没年 */}
            <Grid item xs={3}>
              <InputLabel
                htmlFor="death-input"
                sx={{ fontWeight: 700, pt: "16.5px" }}
              >
                作曲者の没年
              </InputLabel>
            </Grid>
            <Grid item xs={9}>
              <NumberRangeInput
                name="death"
                unit="年"
                min={1000}
                max={null}
                control={control}
              />
            </Grid>
            {/* 作曲年 */}
            <Grid item xs={3}>
              <InputLabel
                htmlFor="composed-input"
                sx={{ fontWeight: 700, pt: "16.5px" }}
              >
                作曲年
              </InputLabel>
            </Grid>
            <Grid item xs={9}>
              <NumberRangeInput
                name="composed"
                unit="年"
                min={1000}
                max={null}
                control={control}
              />
            </Grid>
            {/* 演奏時間 */}
            <Grid item xs={3}>
              <InputLabel
                htmlFor="duration-input"
                sx={{ fontWeight: 700, pt: "16.5px" }}
              >
                演奏時間
              </InputLabel>
            </Grid>
            <Grid item xs={9}>
              <NumberRangeInput
                name="duration"
                unit="分"
                min={0}
                max={null}
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
                    label="演奏時間データがない曲も含める"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              楽器編成
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {/* 数値範囲で指定する楽器群 */}
                {countableInstrumentList.map((countableInstrument) => (
                  <Fragment key={countableInstrument.name}>
                    <Grid item xs={3}>
                      <InputLabel
                        htmlFor={`${countableInstrument.name}-input`}
                        sx={{ fontWeight: 700, pt: "16.5px" }}
                      >
                        {countableInstrument.str}
                      </InputLabel>
                    </Grid>
                    <Grid item xs={9}>
                      <NumberRangeInput
                        name={countableInstrument.name}
                        unit="人"
                        min={0}
                        max={null}
                        control={control}
                      />
                    </Grid>
                  </Fragment>
                ))}

                {/* 弦楽器 */}
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <InputLabel sx={{ fontWeight: 700 }}>弦楽器</InputLabel>
                </Grid>
                <Grid item xs={9}>
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
                          label="指定なし"
                        />
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label="あり"
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          label="なし"
                        />
                      </RadioGroup>
                    )}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions>
          <Button type="reset" variant="text" sx={{ borderRadius: "100vh" }}>
            リセット
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ borderRadius: "100vh" }}
          >
            検索
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/* eslint-disable react/prop-types */
import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ShareIcon from "@mui/icons-material/Share";
import { useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";

import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import {
  workConcertState,
  concertListState,
  concertsState,
  selectedConcertState,
} from "@/components/RecoilStates";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { v4 as randomUUID } from "uuid";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function ConcertMenus(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const open = Boolean(anchorEl);

  const workList = useRecoilValue(concertListState);
  const setConcerts = useSetRecoilState(concertsState);
  const setWorkConcert = useSetRecoilState(workConcertState);

  const [, setSelectedConcertId] = useRecoilState(selectedConcertState);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const duplicateConcert = () => {
    const newId = randomUUID();

    setConcerts((oldConcerts) => {
      const newConcerts = [...oldConcerts];
      const existingNames = oldConcerts.map((concert) => concert.name);
      const concert = {
        ...oldConcerts.find((concert) => concert.id === id),
        name: generateCopyName(
          existingNames,
          oldConcerts.find((concert) => concert.id === id).name,
        ),
        id: newId,
      };
      const oldIndex = oldConcerts.findIndex((concert) => concert.id === id);
      newConcerts.splice(oldIndex + 1, 0, concert);
      return newConcerts;
    });

    const addWorks = workList
      .find((work) => work.id === id)
      .works.map((work) => {
        return {
          concert: newId,
          work: work.id,
          movements: [...work.selectedMovements],
        };
      });

    setWorkConcert((oldWorks) => {
      return [...oldWorks, ...addWorks];
    });

    handleClose();
    enqueueSnackbar("複製に成功しました！", { variant: "success" });
  };

  const deleteConcert = () => {
    const workIndex = workList.findIndex((work) => work.id === id);
    const nextConcertId = workList[workIndex + 1]?.id ?? null;
    const prevConcertId = workList[workIndex - 1]?.id ?? null;

    if (workList[workIndex]?.main) {
      setSelectedConcertId(nextConcertId || prevConcertId || null);
    }

    setConcerts((oldConcerts) => {
      const newConcerts = oldConcerts.filter((concert) => concert.id !== id);
      return newConcerts;
    });

    setWorkConcert((oldWorks) => {
      const newWorks = oldWorks.filter((work) => work.concert !== id);
      return newWorks;
    });

    handleClose();
  };

  const shareConcert = () => {
    const shareWorks = {
      concert: id,
      name: workList.find((work) => work.id === id).name,
      works: workList
        .find((work) => work.id === id)
        .works.map((work) => {
          return {
            work: work.id,
            movements: [...work.selectedMovements],
          };
        }),
    };

    const share = JSON.stringify(shareWorks);

    const shareURL = `${window.location.origin}${window.location.pathname}?share=${encodeURIComponent(
      share,
    )}`;

    navigator.clipboard.writeText(shareURL).then(
      function () {
        enqueueSnackbar("URLをコピーしました", {
          variant: "success",
        });
      },
      function (err) {
        enqueueSnackbar("URLのコピーに失敗しました", {
          variant: "error",
        });
      },
    );

    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={duplicateConcert} disableRipple>
          <FileCopyIcon />
          複製
        </MenuItem>
        <MenuItem onClick={deleteConcert} disableRipple>
          <DeleteForeverIcon />
          削除
        </MenuItem>
        <MenuItem onClick={shareConcert} disableRipple>
          <ShareIcon />
          共有
        </MenuItem>
      </StyledMenu>
    </div>
  );
}

function generateCopyName(existingNames, prefix) {
  if (!existingNames.includes(`${prefix}のコピー`)) {
    return `${prefix}のコピー`;
  }
  let number = 1;
  while (existingNames.includes(`${prefix}のコピー ${number}`)) {
    number++;
  }
  return `${prefix}のコピー ${number}`;
}

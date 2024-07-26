import "./App.css";
import Box from "@mui/material/Box";
import NodeLinkDiagram from "@/components/vis/NodeLinkDiagram";
import MyConcertCardList from "@/components/layouts/MyConcertCardList";

import { RecoilRoot, atom, selector } from "recoil";
import { SnackbarProvider } from "notistack";

import workData from "@/assets/works_v03.json";

const firstUUID = "863c30b8-50ff-491c-a934-1e6c9cd7754e";

const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const concertsState = atom({
  key: "concertsState", // unique ID (with respect to other atoms/selectors)
  default: [
    {
      id: firstUUID,
      name: "My演奏会",
    },
  ],
  effects: [localStorageEffect("concerts")],
});

export const workConcertState = atom({
  key: "workConcertState",
  default: [],
  effects: [localStorageEffect("work_concert")],
});

export const concertNamesState = selector({
  key: "concertNamesState", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const concerts = get(concertsState);
    return concerts.map((concert) => concert.name);
  },
});

export const selectedConcertState = atom({
  key: "selectedConcertState",
  default: firstUUID,
  effects: [localStorageEffect("selected_concert")],
});

export const concertListState = selector({
  key: "concertListState",
  get: ({ get }) => {
    const concerts = get(concertsState);
    return concerts.map((concert) => ({
      id: concert.id,
      name: concert.name,
      works: get(workConcertState)
        .filter((work) => work.concert === concert.id)
        .map((workConcert) =>
          workData.find((work) => work.id === workConcert.work),
        ),
      main: concert.id === get(selectedConcertState),
    }));
  },
});

function App() {
  return (
    <RecoilRoot>
      <SnackbarProvider maxSnack={3}>
        <div className="container">
          <Box
            width={2 / 3}
            className="left-half"
            sx={{ position: "relative" }}
          >
            <NodeLinkDiagram />
          </Box>
          <Box width={1 / 3} className="right-half" sx={{ overflow: "auto" }}>
            <MyConcertCardList />
          </Box>
        </div>
      </SnackbarProvider>
    </RecoilRoot>
  );
}

export default App;

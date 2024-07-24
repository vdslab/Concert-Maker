import "./App.css";
import Box from "@mui/material/Box";
import NodeLinkDiagram from "@/components/vis/NodeLinkDiagram";
import MyConcertCardList from "@/components/layouts/MyConcertCardList";

import { RecoilRoot, atom, selector } from "recoil";

import workData from "@/assets/works_v03.json";

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
      name: "My演奏会",
      works: new Set(),
    },
  ],
  effects: [localStorageEffect("concerts")],
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
  default: "My演奏会",
  effects: [localStorageEffect("selected_concert")],
});

export const concertListState = selector({
  key: "concertListState",
  get: ({ get }) => {
    const concerts = get(concertsState);

    return concerts.map((concert) => ({
      name: concert.name,
      works: Array.from(concert.works).map((workId) =>
        workData.find((work) => work.id === workId),
      ),
      main: concert.name === get(selectedConcertState),
    }));
  },
});

function App() {
  return (
    <RecoilRoot>
      <div className="container">
        <Box width={2 / 3} className="left-half" sx={{ position: "relative" }}>
          <NodeLinkDiagram />
        </Box>
        <Box width={1 / 3} className="right-half" sx={{ overflow: "auto" }}>
          <MyConcertCardList />
        </Box>
      </div>
    </RecoilRoot>
  );
}

export default App;

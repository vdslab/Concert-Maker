import { atom, selector } from "recoil";
import workData from "@/assets/data/works.json";

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
    // {
    //   id: firstUUID,
    //   name: "My演奏会",
    // },
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
        .map((workConcert) => {
          const work = workData.find((work) => work.id === workConcert.work);
          return {
            ...work,
            selectedMovements: workConcert.movements,
          };
        }),
      main: concert.id === get(selectedConcertState),
    }));
  },
});

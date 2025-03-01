import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import WorkListItem from "@/components/layouts/MyConcert/WorkListItem";
import WorkListSortableItem from "@/components/layouts/MyConcert/WorkListSortableItem";

import { useState, Fragment } from "react";
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";

import { workConcertState } from "@/components/RecoilStates";
import { useSetRecoilState } from "recoil";

export default function WorkList({ works, concertID, setClickedNodeId }) {
  const setWorkConcertState = useSetRecoilState(workConcertState);
  const [activeMyConcertWorkId, setActiveMyConcertWorkId] = useState(null);

  const activeMyConcertWork = works.find((work) => work.id === activeMyConcertWorkId);

  if (works.length === 0) {
    return (
      <Typography variant="body1" align="center">
        曲を追加してください
      </Typography>
    );
  }

  const handleDragStart = (event) => {
    const { active } = event;

    setActiveMyConcertWorkId(active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setWorkConcertState((prevWorks) => {
        const oldIndex = prevWorks.findIndex((work) => work.concert === concertID && work.work === active.id);
        const newIndex = prevWorks.findIndex((work) => work.concert === concertID && work.work === over.id);

        return arrayMove(prevWorks, oldIndex, newIndex);
      });
    }

    setActiveMyConcertWorkId(null);
  };

  // タッチとマウス両方のイベントを使えるセンサーを作成
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }) // モバイルにも対応
  );

  return (
    <Box>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={sensors} // センサーを渡す
      >
        <SortableContext items={works} strategy={verticalListSortingStrategy}>
          {works.map((work, index) =>
            <Fragment key={work.id}>
              {index !== 0 && <Divider />}
              <WorkListSortableItem
                work={work}
                concertID={concertID}
                setClickedNodeId={setClickedNodeId}
                setWorkConcertState={setWorkConcertState}
              />
            </Fragment>
          )}
        </SortableContext>
        <DragOverlay modifiers={[restrictToParentElement]}>
          {activeMyConcertWorkId && (
            <WorkListItem
              work={activeMyConcertWork}
              concertID={concertID}
              setClickedNodeId={setClickedNodeId}
              setWorkConcertState={setWorkConcertState}
            />
          )}
        </DragOverlay>
      </DndContext>
    </Box>
  );
}

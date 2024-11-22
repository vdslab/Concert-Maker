import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import WorkListItem from "@/components/layouts/MyConcert/WorkListItem";
import WorkListSortableItem from "@/components/layouts/MyConcert/WorkListSortableItem";

import { useState, Fragment } from "react";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";

import { workConcertState } from "@/components/RecoilStates";
import { useSetRecoilState } from "recoil";

export default function WorkList({ works, concertID, setClickedNodeId, Data }) {
  const setWorkConcertState = useSetRecoilState(workConcertState);
  const [activeWorkId, setActiveWorkId] = useState(null);

  const activeWork = works.find((work) => work.id === activeWorkId);

  if (works.length === 0) {
    return (
      <Typography variant="body1" align="center">
        曲を追加してください
      </Typography>
    );
  }

  const handleDragStart = (event) => {
    const { active } = event;

    setActiveWorkId(active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setWorkConcertState((prevWorks) => {
        const oldIndex = works.findIndex((work) => work.id === active.id);
        const newIndex = works.findIndex((work) => work.id === over.id);

        return arrayMove(prevWorks, oldIndex, newIndex);
      });
    }

    setActiveWorkId(null);
  }

  return (
    <Box>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={works} strategy={verticalListSortingStrategy}>
          {works.map((work, index) =>
            <Fragment key={work.id}>
              {index !== 0 && <Divider />}
              <WorkListSortableItem
                work={work}
                concertID={concertID}
                Data={Data}
                setClickedNodeId={setClickedNodeId}
                setWorkConcertState={setWorkConcertState}
              />
            </Fragment>
          )}
        </SortableContext>
        <DragOverlay modifiers={[restrictToParentElement]}>
          {activeWorkId && (
            <WorkListItem
              work={activeWork}
              concertID={concertID}
              Data={Data}
              setClicknode={setClickedNodeId}
              setWorkConcertState={setWorkConcertState}
            />
          )}
        </DragOverlay>
      </DndContext>
    </Box>
  );
}

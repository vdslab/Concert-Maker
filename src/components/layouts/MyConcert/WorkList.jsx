// src/components/layouts/MyConcert/WorkList.jsx の修正案

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import WorkListItem from "@/components/layouts/MyConcert/WorkListItem";
import WorkListSortableItem from "@/components/layouts/MyConcert/WorkListSortableItem";

import { useState, useCallback, Fragment } from "react"; // useCallbackを追加
import { 
  closestCenter, 
  DndContext, 
  DragOverlay, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { 
  restrictToVerticalAxis, 
  restrictToParentElement 
} from "@dnd-kit/modifiers";

import { workConcertState } from "@/components/RecoilStates";
import { useSetRecoilState } from "recoil";

export default function WorkList({ works, concertID, setClickedNodeId }) {
  console.log("WorkList render with:", { works, concertID });
  
  // すべてのフックを最初に宣言
  const setWorkConcertState = useSetRecoilState(workConcertState);
  
  // handleDragStart と handleDragEnd をuseCallbackで囲む
  const [activeMyConcertWorkId, setActiveMyConcertWorkId] = useState(null);
  
  // useSensorsの呼び出しを条件分岐の外に移動
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const activeMyConcertWork = works.find((work) => work.id === activeMyConcertWorkId);

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    setActiveMyConcertWorkId(active.id);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setWorkConcertState((prevWorks) => {
        const oldIndex = prevWorks.findIndex((work) => work.concert === concertID && work.work === active.id);
        const newIndex = prevWorks.findIndex((work) => work.concert === concertID && work.work === over.id);

        return arrayMove(prevWorks, oldIndex, newIndex);
      });
    }

    setActiveMyConcertWorkId(null);
  }, [concertID, setWorkConcertState]);

  if (works.length === 0) {
    return (
      <Typography variant="body1" align="center">
        曲を追加してください
      </Typography>
    );
  }

  return (
    <Box>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={works} strategy={verticalListSortingStrategy}>
          {works.map((work, index) => (
            <Fragment key={work.id}>
              {index !== 0 && <Divider />}
              <WorkListSortableItem
                work={work}
                concertID={concertID}
                setClickedNodeId={setClickedNodeId}
                setWorkConcertState={setWorkConcertState}
              />
            </Fragment>
          ))}
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
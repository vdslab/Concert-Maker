import WorkListItem from "@/components/layouts/MyConcert/WorkListItem";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function WorkListSortableItem(props) {
  const { work } = props;

  const {
    // attributes は、デフォルト値を考慮した上で今回は使用しない
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition
  } = useSortable({ id: work.id });

  const style = {
    opacity: isDragging ? 0 : undefined,
    transform: CSS.Translate.toString(transform),
    transition
  };

  return (
    <WorkListItem
      {...props}
      sortableItemProps={{
        isDragging,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        style
      }}
    />
  );
}

import MyConcertCardList from "@/components/layouts/MyConcertCardList";

function MyConcert(props) {
  const { graphData, setClickedNodeId } = props;
  return (
    <div>
      <MyConcertCardList Data={graphData} setClickedNodeId={setClickedNodeId} />
    </div>
  );
}

export default MyConcert;

import { link } from "d3";
import DetailCard from "./DetailCard";

const DetailCardList = ({ clicknode, Data }) => {
  console.log(clicknode);
  const { nodes, links } = Data;
  const linkNodes = new Set();

  if (links !== null && links !== undefined && links.length !== 0) {
    links.forEach((link) => {
      if (link.source === clicknode || link.target === clicknode) {
        linkNodes.add(link.source);
        linkNodes.add(link.target);
      }
    });
    linkNodes.delete(clicknode);
  }

  return (
    <div>
      <div>選択した曲</div>
      <DetailCard clicknode={clicknode} />
      <div>よく一緒に演奏される曲</div>
      {linkNodes.size !== 0 ? (
        Array.from(linkNodes).map((node, index) => (
          <DetailCard key={index} clicknode={node} />
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default DetailCardList;

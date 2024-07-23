import * as d3 from "d3";

export const configureGraph = (fgRef) => {
  if (fgRef.current) {
    fgRef.current.d3Force("link").distance((link) => link.distance);
    fgRef.current.d3Force("x", d3.forceX(0).strength(0.05));
    fgRef.current.d3Force("y", d3.forceY(0).strength(0.05));
    fgRef.current.d3Force("charge").strength(-100);
  }
};

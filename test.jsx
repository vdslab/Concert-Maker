import ForceGraph2D from "react-force-graph-2d";

const worksArray = data.flatMap((artist) => artist.works);

const formattedWorksArray = worksArray.map((work) => ({
	id: work.id,
	name: work.title,
	year: work.year,
	duration: work.duration,
	workFormula: work.workFormula,
	workFormula_perc: work.workFormula_perc,
	workMovements: work.workMovements,
	workMovementDuration: work.workMovementDuration,
	workSources: work.workSources,
}));

const drawStar = (ctx, x, y, r, n, inset) => {
	ctx.beginPath();
	ctx.moveTo(x, y - r);
	for (let i = 0; i < n; i++) {
		ctx.lineTo(
			x + Math.cos((i * Math.PI * 2) / n - Math.PI / 2) * r,
			y + Math.sin((i * Math.PI * 2) / n - Math.PI / 2) * r,
		);
		ctx.lineTo(
			x + Math.cos(((i + 0.5) * Math.PI * 2) / n - Math.PI / 2) * r * inset,
			y + Math.sin(((i + 0.5) * Math.PI * 2) / n - Math.PI / 2) * r * inset,
		);
	}
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
};

const NodeLinkDiagram = () => {
	// console.log(formattedWorksArray);

	const test_data = {
		nodes: formattedWorksArray,
		links: [],
	};
	console.log(test_data);
	return (
		<ForceGraph2D
			graphData={test_data}
			nodeAutoColorBy="group"
			linkAutoColorBy="group"
			nodeCanvasObject={(node, ctx, globalScale) => {
				const label = node.id;
				const fontSize = 12 / globalScale;
				ctx.font = `${fontSize}px Sans-Serif`;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";

				// Draw star
				ctx.fillStyle = node.color;
				ctx.strokeStyle = node.color;
				drawStar(ctx, node.x, node.y, 10 / globalScale, 5, 0.5);

				// Draw text label
				// ctx.fillStyle = "black";
				// ctx.fillText(label, node.x, node.y + 15 / globalScale);
			}}
		/>
	);
};

export default NodeLinkDiagram;

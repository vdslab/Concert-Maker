import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NodeLinkDiagram from "./components/vis/NodeLinkDiagram";

function App() {
	return (
		<>
			<NodeLinkDiagram />
		</>
	);
}

export default App;

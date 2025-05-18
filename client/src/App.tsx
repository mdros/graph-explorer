import { useEffect, useRef, useState } from "react";
import ForceGraph3D, { type NodeObject } from "react-force-graph-3d";
import NodeData from "./components/NodeData";
import dataset from "./assets/large_dataset.json";

type NodeContent = {
	id: string;
	user: string;
	description: string;
};

function App() {
	const [currentNode, setCurrentNode] = useState<NodeContent | null>(null);

	// biome-ignore lint/suspicious/noExplicitAny: tralala
	const fgRef = useRef<any | null>(null);

	const handleClick = (node: NodeObject) => {
		console.log("handling click");
		if (!fgRef || !node.x || !node.y || !node.z) {
			console.log(node);
			setCurrentNode(null);
			return;
		}
		console.log("handling click");
		const distance = 80;
		const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

		fgRef.current?.cameraPosition(
			{ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
			{ x: node.x, y: node.y, z: node.z },
			1000,
		);

		const foundNode = dataset.nodes.find(
			(n) => n.id === node.id,
		) as NodeContent;
		console.log("foundNode", foundNode);
		if (node) setCurrentNode(foundNode);
		else console.log("Node not found");
	};

	useEffect(() => {
		console.log("currentNode", currentNode);
	}, [currentNode]);

	return (
		<>
			<ForceGraph3D
				ref={fgRef}
				controlType="orbit"
				graphData={dataset}
				warmupTicks={200}
				cooldownTicks={0}
				onNodeClick={handleClick}
				onBackgroundClick={() => setCurrentNode(null)}
				nodeLabel={"id"}
			/>

			{currentNode ? (
				<div
					style={{
						overflow: "hidden",
						position: "absolute",
						top: 0,
						right: 0,
						width: "30vw",
						height: "90vh",
						backgroundColor: "white",
						zIndex: 1,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						margin: "50px",
					}}
				>
					<NodeData
						id={currentNode.id}
						title={currentNode.user}
						description={currentNode.description}
					/>
				</div>
			) : null}
		</>
	);
}

export default App;

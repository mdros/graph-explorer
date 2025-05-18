import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ForceGraph3D, { type NodeObject } from "react-force-graph-3d";
import NodeData from "./components/NodeData";
import useCameraUtils from "./hooks/useCameraUtils";
import type { GetNodesResponse, Node } from "./types";

function App() {
	const [currentNode, setCurrentNode] = useState<Node | null>(null);

	const { fgRef, focusOnNode } = useCameraUtils();

	const { data } = useQuery<GetNodesResponse>({
		queryKey: ["nodes"],
		queryFn: () => fetch("http://127.0.0.1:8000/nodes/").then((res) => res.json()),
	});

	const handleClick = (node: NodeObject) => {
		if (!data) return;
		console.log(node);
		const foundNode = data.nodes.find((n) => n.id === node.id);
		if (foundNode) {
			setCurrentNode(foundNode);
			focusOnNode(node);
		}
	};

	return (
		<>
			{data ? (
				<ForceGraph3D
					ref={fgRef}
					controlType="orbit"
					graphData={{ nodes: data.nodes, links: data.links }}
					warmupTicks={200}
					cooldownTicks={0}
					onNodeClick={handleClick}
					onBackgroundClick={() => setCurrentNode(null)}
					nodeLabel={"id"}
				/>
			) : null}

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
					<NodeData {...currentNode} />
				</div>
			) : null}
		</>
	);
}

export default App;

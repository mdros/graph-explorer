import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ForceGraph3D, { type NodeObject } from "react-force-graph-3d";
import NodeData from "./components/NodeData";
import useCameraUtils from "./hooks/useCameraUtils";
import type { GetNodesResponse } from "./types";
import { fetchRelatedNodes } from "./utils";

function App() {
	const { fgRef } = useCameraUtils();
	const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);

	const [graphData, setGraphData] = useState<{ nodes: { id: string }[]; links: { source: string; target: string; predicate: string }[] }>({
		nodes: [{ id: "https://housemd.rdf-ext.org/person/gregory-house" }],
		links: [],
	});

	const { data } = useQuery<GetNodesResponse>({
		queryKey: ["nodes", graphData.nodes.map((n) => n.id)],
		queryFn: async () => {
			const res = await fetch(
				`http://127.0.0.1:8000/nodes?uris=${graphData.nodes
					.map((n) => n.id)
					.map(encodeURIComponent)
					.join("&uris=")}`,
			);
			return await res.json();
		},
	});

	const expandNode = async (nodeId: string) => {
		const relatedNodes = await fetchRelatedNodes(nodeId);
		const node = data?.nodes.find((n) => n.id === nodeId);
		if (!node) return;
		const newLinks = node.details.links;

		setGraphData((prevData) => ({
			nodes: [
				...prevData.nodes,
				...relatedNodes.filter((n) => !prevData.nodes.some((existingNode) => existingNode.id === n.id)).map((n) => ({ id: n.id })),
			],
			links: [
				...prevData.links,
				...newLinks.filter(
					(link) =>
						!prevData.links.some(
							(existingLink) =>
								existingLink.source === link.source && existingLink.target === link.target && existingLink.predicate === link.predicate,
						),
				),
			],
		}));
	};

	const handleNodeClick = (node: NodeObject) => {
		if (!node.id) return;
		setCurrentNodeId(String(node.id));
		expandNode(String(node.id));
	};

	return (
		<>
			<ForceGraph3D
				ref={fgRef}
				controlType="orbit"
				graphData={graphData}
				onNodeClick={handleNodeClick}
				onBackgroundClick={() => setCurrentNodeId(null)}
				nodeLabel={"id"}
				linkLabel={"predicate"}
			/>

			{currentNodeId ? (
				<div
					style={{
						overflow: "hidden",
						position: "absolute",
						top: 0,
						right: 0,
						width: "30vw",
						height: "50vh",
						backgroundColor: "white",
						zIndex: 1,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						margin: "50px",
					}}
				>
					<NodeData nodeId={currentNodeId} />
				</div>
			) : null}
		</>
	);
}

export default App;

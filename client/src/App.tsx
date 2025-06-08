import uniqBy from "lodash.uniqby";
import { useEffect, useState } from "react";
import ForceGraph3D, { type NodeObject } from "react-force-graph-3d";
import NodeData from "./components/NodeData";
import useCameraUtils from "./hooks/useCameraUtils";
import type { GraphData } from "./types";
import { fetchRelatedNodes } from "./utils";

function App() {
	const { fgRef } = useCameraUtils();
	const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);

	const [graphData, setGraphData] = useState<GraphData>({
		nodes: [{ id: "https://housemd.rdf-ext.org/person/gregory-house" }],
		links: [],
	});
	const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>([]);

	useEffect(() => {
		const nodeIds = graphData.nodes.map((n) => n.id);
		const duplicates = nodeIds.filter((id, idx) => nodeIds.indexOf(id) !== idx);
		if (duplicates.length > 0) {
			console.log("Duplicated node ids:", [...new Set(duplicates)]);
		}
	}, [graphData]);

	const expandNode = async (nodeId: string) => {
		const [node, relatedNodes] = await fetchRelatedNodes(nodeId);
		if (!node || expandedNodeIds.includes(nodeId)) return;

		setGraphData((prevData) => {
			const newNodes = [...prevData.nodes, ...relatedNodes.map((n) => ({ id: n.id }))];
			// Remove duplicates by id
			const uniqueNodes = uniqBy(newNodes, "id");

			return {
				nodes: uniqueNodes,
				links: [
					...prevData.links,
					...node.details.links.filter(
						(link) =>
							!prevData.links.some(
								(existingLink) =>
									existingLink.source === link.source && existingLink.target === link.target && existingLink.predicate === link.predicate,
							),
					),
				],
			};
		});
		setExpandedNodeIds((prev) => [...prev, nodeId]);
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
				linkDirectionalParticles={1}
				linkDirectionalArrowLength={2}
				enableNodeDrag={false}
				nodeColor={(node) => (expandedNodeIds.includes(node.id) ? "green" : "red")}
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

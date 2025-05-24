import type { GetRelatedNodesResponse, Node } from "./types";

async function fetchRelatedNodes(nodeId: string): Promise<Omit<Node, "details">[]> {
	const res: GetRelatedNodesResponse = await fetch(`http://127.0.0.1:8000/related-nodes?uri=${encodeURIComponent(nodeId)}`).then((res) =>
		res.json(),
	);

	return res.nodes;
}

export { fetchRelatedNodes };

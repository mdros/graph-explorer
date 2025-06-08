import type { GetRelatedNodesResponse, Node } from "./types";

async function fetchRelatedNodes(nodeId: string): Promise<[Node, Node[]]> {
	const res: GetRelatedNodesResponse = await fetch(`http://127.0.0.1:8000/related-nodes?uri=${encodeURIComponent(nodeId)}`)
		.then((res) => res.json())
		.catch((error) => {
			console.error("Error fetching related nodes:", error);
		});

	return [res.node, res.relatedNodes];
}

export { fetchRelatedNodes };

export type Property = {
	id: string;
	namespace: string;
	predicate: string;
};

export type Node = {
	id: string;
	details: {
		properties: Property[];
		links: Link[];
	};
};

export type GetNodesResponse = {
	nodes: Node[];
	total: number;
};

export type GetRelatedNodesResponse = {
	node: Node;
	relatedNodes: Node[];
};

export type Link = {
	source: string;
	target: string;
	predicate: string;
};

export type GraphData = {
	nodes: { id: string }[];
	links: Link[];
}

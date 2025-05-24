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
	nodes: Omit<Node, "details">[];
	total: number;
};

export type Link = {
	source: string;
	target: string;
	predicate: string;
};

// export type GetNodesResponse = {
// 	nodes: Node[];
// 	links: Link[];
// };

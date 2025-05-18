export type Property = {
	id: string;
	namespace: string;
	propertyType: "URIRef" | "Literal";
	value: string;
};

export type Node = {
	id: string;
	properties: Property[];
};

export type Link = {
	source: string;
	target: string;
};

export type GetNodesResponse = {
	nodes: Node[];
	links: Link[];
};

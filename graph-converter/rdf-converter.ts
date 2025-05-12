import { Parser } from "n3";
import { readFileSync, writeFileSync } from "node:fs";

const rdfFile = "./assets/graph_turtle.ttl";
const rdfContent = readFileSync(rdfFile, "utf-8");

const parser = new Parser();
const triples = parser.parse(rdfContent);

const nodes = new Map();
const links = [];

function getLabel(iri: string) {
	const parts = iri.split(/[\/#]/);
	return parts[parts.length - 1];
}

for (const { subject, predicate, object } of triples) {
	if (subject.termType === "NamedNode" && !nodes.has(subject.value)) {
		nodes.set(subject.value, { id: subject.value, label: getLabel(subject.value) });
	}

	if (object.termType === "NamedNode" && !nodes.has(object.value)) {
		nodes.set(object.value, { id: object.value, label: getLabel(object.value) });
	}

	if (object.termType === "NamedNode") {
		links.push({
			source: subject.value,
			target: object.value,
			label: getLabel(predicate.value),
		});
	}
}

const graph = {
	nodes: Array.from(nodes.values()),
	links: links,
};

writeFileSync("./assets/graph_data.json", JSON.stringify(graph, null, 2));
console.log("✅ graph_data.json created.");

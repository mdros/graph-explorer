from typing import Literal, TypedDict

from rdflib import Graph, Namespace, URIRef
from rdflib.namespace import split_uri

graph = Graph()
graph.parse("housemd.rdf")

ns = Namespace("http://schema.org/")
house_ns = Namespace("https://housemd.rdf-ext.org/")


class Property(TypedDict):
    id: str
    namespace: str
    predicate: str


class Link(TypedDict):
    source: str
    target: str
    predicate: str


class NodeDetails(TypedDict):
    properties: list[Property]
    links: list[Link]


class Node(TypedDict):
    id: str
    details: NodeDetails


class NodeWithoutDetails(TypedDict):
    id: str


NodeType = Literal["person", "place"]

node_type_to_rdf_type: dict[NodeType, URIRef] = {
    "person": ns.Person,
    "place": ns.Place,
}


def _get_node_details(node_id: str) -> NodeDetails:
    details: NodeDetails = {
        "properties": [],
        "links": [],
    }

    for predicate, obj in graph.predicate_objects(subject=URIRef(node_id), unique=True):
        namespace, property = split_uri(str(predicate))
        if isinstance(obj, URIRef) and str(obj) not in ["http://schema.org/Person"]:
            details["links"].append(
                {
                    "source": node_id,
                    "target": str(obj),
                    "predicate": property,
                }
            )
        else:
            details["properties"].append(
                {
                    "id": str(obj),
                    "namespace": namespace,
                    "predicate": property,
                }
            )
    return details


def get_all_nodes() -> list[Node]:
    return [{"id": str(node_id), "details": _get_node_details(str(node_id))} for node_id in graph.subjects()]


def get_single_node(node_id: str) -> Node:
    return {"id": node_id, "details": _get_node_details(node_id)}


def get_nodes_by_ids(node_ids: list[str]) -> list[Node]:
    return [{"id": node_id, "details": _get_node_details(node_id)} for node_id in node_ids]


def get_neighbour_nodes(node_id: str) -> list[NodeWithoutDetails]:
    node_details = _get_node_details(node_id)
    node_links = node_details["links"]

    connected_node_ids = [link["target"] for link in node_links]
    return [{"id": node_id} for node_id in connected_node_ids]

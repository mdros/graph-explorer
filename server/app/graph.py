from typing import Literal, TypedDict

from rdflib import RDF, Graph, Namespace, URIRef
from rdflib.namespace import split_uri

graph = Graph()
graph.parse("housemd.rdf")

ns = Namespace("http://schema.org/")
house_ns = Namespace("https://housemd.rdf-ext.org/")


class Property(TypedDict):
    id: str
    namespace: str
    propertyType: Literal["URIRef", "Literal"]
    value: str


class Node(TypedDict):
    id: str
    properties: list[Property]


class Link(TypedDict):
    source: str
    target: str


def get_subjects_by_type(rdf_type: Literal["people", " "]) -> tuple[list[Node], list[Link]]:
    subjects: list[Node] = [{"id": s} for s in graph.subjects(RDF.type, rdf_type, unique=True)]
    for subject in subjects:
        properties = []
        for predicate, obj in graph.predicate_objects(subject=subject["id"], unique=True):
            namespace, property = split_uri(predicate)
            properties.append(
                {
                    "id": str(obj),
                    "namespace": namespace,
                    "propertyType": "URIRef" if isinstance(obj, URIRef) else "Literal",
                    "value": graph.qname(predicate),
                }
            )
        subject["properties"] = properties
    links: list[Link] = []
    for subject in subjects:
        for prop in subject["properties"]:
            if prop["propertyType"] == "URIRef" and prop["value"] == "ns1:knows":
                links.append({"source": str(subject["id"]), "target": prop["id"]})
    return subjects, links


def get_people() -> tuple[list[Node], list[Link]]:
    return get_subjects_by_type(ns.Person)


def get_places() -> tuple[list[Node], list[Link]]:
    return get_subjects_by_type(ns.Place)

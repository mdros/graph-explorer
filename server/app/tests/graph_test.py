import pytest
from rdflib import Graph, Literal as RDFLiteral
from rdflib.namespace import Namespace
from .. import graph

@pytest.fixture(autouse=True)
def setup_graph(monkeypatch):
    # Patch the global graph object in graph.py with a test graph
    test_graph = Graph()
    EX = Namespace("http://example.org/")
    # Add triples for two nodes, one with a property and one with a link
    test_graph.add((EX.alice, EX.name, RDFLiteral("Alice", lang="en")))
    test_graph.add((EX.alice, EX.knows, EX.bob))
    test_graph.add((EX.bob, EX.name, RDFLiteral("Bob", lang="en")))
    test_graph.add((EX.bob, EX.age, RDFLiteral("30")))
    # Patch the graph in the graph module
    monkeypatch.setattr(graph, "graph", test_graph)
    yield

def test__get_node_details_properties_and_links():
    EX = "http://example.org/"
    details = graph._get_node_details(EX + "alice")
    # Alice should have one property and one link
    assert any(p["predicate"] == "name" and p["id"] == "Alice" for p in details["properties"])
    assert any(l["predicate"] == "knows" and l["target"] == EX + "bob" for l in details["links"])

def test__get_node_details_language_filter():
    EX = Namespace("http://example.org/")
    # Add a node with a non-en language property
    graph.graph.add((EX.carla, EX.name, RDFLiteral("Carla", lang="fr")))
    details = graph._get_node_details(str(EX.carla))
    # Should not include the French label
    assert not details["properties"]

def test__get_full_node():
    EX = "http://example.org/"
    node = graph._get_full_node(EX + "bob")
    assert node["id"] == EX + "bob"
    assert "details" in node
    assert any(p["predicate"] == "name" for p in node["details"]["properties"])
    assert any(p["predicate"] == "age" for p in node["details"]["properties"])

def test_get_all_nodes():
    nodes = graph.get_all_nodes()
    ids = [n["id"] for n in nodes]
    assert any("alice" in i for i in ids)
    assert any("bob" in i for i in ids)

def test_get_nodes_by_ids():
    EX = "http://example.org/"
    nodes = graph.get_nodes_by_ids([EX + "alice"])
    assert len(nodes) == 1
    assert nodes[0]["id"] == EX + "alice"

def test_get_single_node():
    EX = "http://example.org/"
    node = graph.get_single_node(EX + "bob")
    assert node["id"] == EX + "bob"

def test_get_neighbour_nodes():
    EX = "http://example.org/"
    node, neighbours = graph.get_neighbour_nodes(EX + "alice")
    # Alice knows Bob, so Bob should be a neighbour
    neighbour_ids = [n["id"] for n in neighbours]
    assert EX + "bob" in neighbour_ids
    assert node["id"] == EX + "alice"
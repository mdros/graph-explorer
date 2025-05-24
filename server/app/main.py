from typing import Annotated
from urllib.parse import unquote

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from app.graph import get_all_nodes, get_neighbour_nodes, get_nodes_by_ids, get_single_node

app = FastAPI()

origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/nodes")
def get_nodes(uris: Annotated[list[str] | None, Query()] = None):
    nodes = get_all_nodes() if not uris else get_nodes_by_ids([unquote(id) for id in uris])
    return {"nodes": nodes, "total": len(nodes)}


@app.get("/node")
def get_node(uri: Annotated[str, Query(alias="uri")]):
    node = get_single_node(unquote(uri))
    return node


@app.get("/related-nodes")
def get_related_nodes(uri: Annotated[str, Query(alias="uri")]):
    nodes = get_neighbour_nodes(unquote(uri))
    return {"nodes": nodes, "totalNodes": len(nodes)}

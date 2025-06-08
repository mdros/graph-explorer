from typing import Annotated
from urllib.parse import unquote

from app.graph import get_all_nodes, get_neighbour_nodes, get_nodes_by_ids, get_single_node
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:4173",
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
    return {"nodes": nodes}


@app.get("/node")
def get_node(uri: Annotated[str, Query()]):
    node = get_single_node(unquote(uri))
    return node


@app.get("/related-nodes")
def get_related_nodes(uri: Annotated[str, Query()]):
    node, nodes_to_add = get_neighbour_nodes(unquote(uri))
    return {"node": node, "relatedNodes": nodes_to_add}

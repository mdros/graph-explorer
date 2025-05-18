from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.graph import get_people, get_places

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


@app.get("/")
def read_root():
    return {"Hello": "World"}


NodeType = Literal["people", "places"]


@app.get("/nodes/{node_type}")
def get_nodes(node_type: NodeType):
    if node_type == "people":
        return {"nodes": get_people()}
    elif node_type == "places":
        return {"nodes": get_places()}
    else:
        return {"error": "Invalid node type"}


@app.get("/nodes/")
def get_all_nodes():
    people, people_links = get_people()
    places, places_links = get_places()
    return {
        "nodes": people + places,
        "links": people_links + places_links,
    }

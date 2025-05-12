### Conversion from .rdf to .json

1. If in xml/rdf format, run:
   
    `rapper -i rdfxml graph.rdf -o turtle > graph_turtle.ttl`

2. Run the converter on the .ttl file

    `tsx ./rdf-converter.ts`

import { useQuery } from "@tanstack/react-query";
import type { Property } from "../types";

type Props = {
	nodeId: string;
};

const NodeData = ({ nodeId }: Props) => {
	const { data } = useQuery({
		queryKey: ["nodeData", nodeId],
		queryFn: () => fetch(`http://127.0.0.1:8000/node?uri=${encodeURIComponent(nodeId)}`).then((res) => res.json()),
	});

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				overflowY: "auto",
				color: "black",
				padding: "10px",
			}}
		>
			<h3>{nodeId}</h3>
			<div>
				{data ? (
					<>
						<h4>Properties</h4>
						<ul>
							{data.details.properties.map((property: Property) => (
								<div key={property.id} style={{ display: "flex", flexDirection: "column", marginBottom: "8px" }}>
									<span style={{ fontWeight: "bold" }}>{property.predicate}</span>
									<span>{property.id}</span>
								</div>
							))}
						</ul>
					</>
				) : null}
			</div>
		</div>
	);
};

export default NodeData;

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
				justifyContent: "center",
				width: "100%",
				height: "100%",
				padding: "16px",
				color: "black",
			}}
		>
			<h3>{nodeId}</h3>
			<div>
				{data ? (
					<>
						<h4>Properties</h4>
						<ul>
							{data.details.properties.map((property: Property) => (
								<li key={property.id}>
									{property.predicate}: {property.id}
								</li>
							))}
						</ul>
					</>
				) : null}
			</div>
		</div>
	);
};

export default NodeData;

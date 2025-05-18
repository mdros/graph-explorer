import type { Node } from "../types";

const NodeData = ({ id, properties }: Node) => {
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
			<h3>{id}</h3>
			<p>
				{properties.map((p) => (
					<p key={p.id}>
						{p.id} - {p.propertyType} - {p.value}
					</p>
				))}
			</p>
		</div>
	);
};

export default NodeData;

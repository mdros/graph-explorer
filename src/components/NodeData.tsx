interface Props {
	id: string;
	title: string;
	description: string;
}

const NodeData = ({ id, title, description }: Props) => {
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
			<h2>{title}</h2>
			<p>{description}</p>
		</div>
	);
};

export default NodeData;

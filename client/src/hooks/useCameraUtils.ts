import { useRef } from "react";
import type { NodeObject } from "react-force-graph-3d";

const useCameraUtils = () => {
	// biome-ignore lint/suspicious/noExplicitAny:
	const fgRef = useRef<any | null>(null);

	const focusOnNode = (node: NodeObject, distance = 50) => {
		if (!fgRef.current || node.x === undefined || node.y === undefined || node.z === undefined) {
			console.warn("Invalid node or ForceGraph reference");
			return;
		}

		fgRef.current.cameraPosition(
			{ x: node.x + distance, y: node.y + distance, z: node.z + distance },
			{ x: node.x, y: node.y, z: node.z },
			200,
		);
	};

	return { fgRef, focusOnNode };
};

export default useCameraUtils;

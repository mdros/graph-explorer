import { useRef } from "react";
import type { NodeObject } from "react-force-graph-3d";

const useCameraUtils = () => {
	// biome-ignore lint/suspicious/noExplicitAny:
	const fgRef = useRef<any | null>(null);

	const focusOnNode = (node: NodeObject, distance = 80) => {
		if (!fgRef.current || !node.x || !node.y || !node.z) {
			console.warn("Invalid node or ForceGraph reference");
			return;
		}

		const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

		fgRef.current.cameraPosition(
			{ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
			{ x: node.x, y: node.y, z: node.z },
			200,
		);
	};

	return { fgRef, focusOnNode };
};

export default useCameraUtils;

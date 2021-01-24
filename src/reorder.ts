import invariant from 'tiny-invariant';
import { Item, Path } from './types';

interface ReorderParams<T> {
	source: Item<T>[];
	destination?: Item<T>[];
	sourcePath: Path;
	destinationPath: Path;
}

interface ReorderResult<T> {
	source: Item<T>[];
	destination: Item<T>[];
}

export default function reorder<T>({
	destination,
	destinationPath,
	source,
	sourcePath,
}: ReorderParams<T>): ReorderResult<T> {
	const nextSource = Array.from(source);
	const nextDestination =
		destination == null || source === destination
			? nextSource
			: Array.from(destination);

	const sourceIndex = sourcePath.pop();
	const destinationIndex = destinationPath.pop();

	if (sourceIndex == null || destinationIndex == null) {
		return { source, destination: destination ?? source };
	}

	let removedFrom = nextSource;
	for (const segment of sourcePath) {
		const nextNode = removedFrom[segment];
		invariant(nextNode.children, 'Could not access children in reorder');
		nextNode.children = Array.from(nextNode.children);
		removedFrom = nextNode.children;
	}

	let transferedTo = nextDestination;
	let didPathDiverge = false;
	for (let i = 0; i < destinationPath.length; i += 1) {
		const segment = destinationPath[i];
		const nextNode = transferedTo[segment];
		invariant(nextNode.children, 'Could not access children in reorder');
		if (didPathDiverge || i >= sourcePath.length || sourcePath[i] !== segment) {
			didPathDiverge = true;
			nextNode.children = Array.from(nextNode.children);
		}
		transferedTo = nextNode.children;
	}

	const [removed] = removedFrom.splice(sourceIndex, 1);
	transferedTo.splice(destinationIndex, 0, removed);

	return { source: nextSource, destination: nextDestination };
}

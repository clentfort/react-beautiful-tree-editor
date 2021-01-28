import * as React from 'react';
import AppContext, { AppState } from './AppContext';
import {
	BeforeCapture,
	DragDropContext,
	DragDropContextProps,
	DraggableLocation,
	DropResult,
	ResponderProvided,
} from 'react-beautiful-dnd';
import invariant from 'tiny-invariant';
import { Path } from './types';

type DragEndEventResultSource = DropResult['source'];
type DragEndEventResultDestination = NonNullable<DropResult['destination']>;

interface DragEndEventResultSourceWithPath extends DragEndEventResultSource {
	path: Path;
}

interface DragEndEventResultDestinationWithPath
	extends DragEndEventResultDestination {
	path: Path;
}

interface DragEndEventResultWithPath
	extends Omit<DropResult, 'source' | 'destination'> {
	source: DragEndEventResultSourceWithPath;
	destination?: DragEndEventResultDestinationWithPath;
}

type DragEndEventHandlerWithPath = (
	result: DragEndEventResultWithPath,
	provided: ResponderProvided,
) => void;

interface DraggableLocationWithPath extends DraggableLocation {
	path: Path;
}

export interface Props
	extends Omit<DragDropContextProps, 'onBeforeCapture' | 'onDragEnd'> {
	onDragEnd: DragEndEventHandlerWithPath;
}

export default function App({ onDragEnd, ...dragDropContextProps }: Props) {
	const store = React.useMemo<AppState>(() => {
		return {
			draggables: new Map(),
			droppables: new Map(),
		};
	}, []);

	const { draggables, droppables } = store;

	function handleBeforeCapture({ draggableId }: BeforeCapture) {
		const meta = draggables.get(draggableId);
		invariant(meta, 'Could not find draggable in beforeCapture');

		const { droppableId, index } = meta;

		const droppable = droppables.get(droppableId);
		invariant(droppable, 'Could not find droppable in beforeCapture');

		const item = droppable.items[index];
		invariant(item, 'Could not find item in beforeCapture');

		droppable.setItemsBeingDragged([item]);
	}

	function handleDragEnd(result: DropResult, provided: ResponderProvided) {
		const { source, destination } = result;

		const sourceDroppable = droppables.get(source.droppableId);
		invariant(sourceDroppable, 'Could not find droppable in dragEnd');

		const sourceItem = sourceDroppable.items[source.index];
		invariant(sourceItem, 'Invalid item for source in dragEnd');

		const sourceWithPath: DraggableLocationWithPath = {
			...source,
			path: sourceItem.path,
		};

		let destinationWithPath: DraggableLocationWithPath | undefined;
		if (destination != null) {
			const destinationDroppable = droppables.get(destination.droppableId);
			invariant(destinationDroppable, 'Could not find droppable in dragEnd');

			let path: Path = [];
			if (destination.index < destinationDroppable.items.length) {
				const destinationItem = destinationDroppable.items[destination.index];
				invariant(destinationItem, 'Invalid item for destination in dragEnd');
				path = destinationItem.path;
			}

			destinationWithPath = {
				...destination,
				path,
			};
		}
		const resultWithPathes = {
			...result,
			source: sourceWithPath,
			destination: destinationWithPath,
		};

		sourceDroppable.setItemsBeingDragged([]);
		onDragEnd(resultWithPathes, provided);
	}

	return (
		<AppContext.Provider value={store}>
			<DragDropContext
				{...dragDropContextProps}
				onBeforeCapture={handleBeforeCapture}
				onDragEnd={handleDragEnd}
			/>
		</AppContext.Provider>
	);
}

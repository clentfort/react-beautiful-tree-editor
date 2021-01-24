import * as React from 'react';
import AppContext, { AppState } from './AppContext';
import {
	BeforeCapture,
	DragDropContext,
	DragDropContextProps,
	DropResult,
	Id,
	ResponderProvided,
} from 'react-beautiful-dnd';
import invariant from 'tiny-invariant';
import { Path } from './types';

interface DragEndEventResultSource {
	droppableId: Id;
	path: Path;
}

interface DragEndEventResultDestination {
	droppableId: Id;
	path: Path;
}

interface DragEndEventResult
	extends Omit<DropResult, 'source' | 'destination'> {
	source: DragEndEventResultSource;
	destination?: DragEndEventResultDestination;
}

type DragEndEventHandler = (
	result: DragEndEventResult,
	provided: ResponderProvided,
) => void;

interface DraggableLocation {
	droppableId: Id;
	path: Path;
}

export interface Props
	extends Omit<DragDropContextProps, 'onBeforeCapture' | 'onDragEnd'> {
	onDragEnd: DragEndEventHandler;
}

export default function TreeContext({
	onDragEnd,
	...dragDropContextProps
}: Props) {
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

	function handleDragEnd(listResult: DropResult, provided: ResponderProvided) {
		const { source: listSource, destination: listDestination } = listResult;

		const sourceDroppable = droppables.get(listSource.droppableId);
		invariant(sourceDroppable, 'Could not find droppable in dragEnd');

		const sourceItem = sourceDroppable.items[listSource.index];
		invariant(sourceItem, 'Invalid item for source in dragEnd');

		const treeSource: DraggableLocation = {
			droppableId: listSource.droppableId,
			path: sourceItem.path,
		};

		let treeDestination: DraggableLocation | undefined;
		if (listDestination != null) {
			const destinationDroppable = droppables.get(listDestination.droppableId);
			invariant(destinationDroppable, 'Could not find droppable in dragEnd');

			// If the source item was above the destination item the index of the
			// destination item will be offset because the source item is being
			// collapsed during the drag.
			const offset =
				listSource.droppableId === listDestination.droppableId &&
				listSource.index < listDestination.index
					? sourceItem.end - sourceItem.start - 1
					: 0;

			let path: Path = [];
			if (listDestination.index + offset < destinationDroppable.items.length) {
				const destinationItem =
					destinationDroppable.items[listDestination.index + offset];
				invariant(destinationItem, 'Invalid item for destination in dragEnd');
				path = destinationItem.path;
			} else {
				const { items } = destinationDroppable;
				if (items.length === 0) {
					path = [0];
				} else {
					path = [items[items.length - 1].path[0] + 1];
				}
			}

			treeDestination = {
				droppableId: listDestination.droppableId,
				path,
			};
		}
		const treeResult = {
			...listResult,
			source: treeSource,
			destination: treeDestination,
		};

		// Calling this right away causes issues with react-beautiful-dnd, I haven't
		// figured out why. Calling it at the end of the event-loop tick seems to
		// solve it though.
		window.queueMicrotask(() => {
			sourceDroppable.setItemsBeingDragged([]);
			onDragEnd(treeResult, provided);
		});
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

import React, {  ReactElement, ReactNode } from 'react';
import {
	BeforeCapture,
	DragDropContext,
	DragDropContextProps,
	DraggableLocation,
	DropResult,
	ResponderProvided,
} from 'react-beautiful-dnd';
import invariant from 'tiny-invariant';
import treeToList from './tree-to-list';
import { Path, Maybe, Node, RenderItem } from './types';

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

type ItemRenderer<T> = (item: RenderItem<T>, index: number) => ReactElement;

export interface Props<T>
	extends Omit<DragDropContextProps, 'children' | 'onDragEnd'> {
	nodes: Node<T>[];
	children: (render: ItemRenderer<T>) => ReactNode[];
	onDragEnd: DragEndEventHandlerWithPath;
}

export default function Tree<T>({
	children,
	nodes,
	// Start DragDropContext props
	onDragEnd,
	...dragDropContextProps
}: Props<T>) {
	const items = React.useMemo(() => {
		return treeToList(nodes);
	}, [nodes]);

	const [itemsToHide, setItemsToHide] = React.useState<
		Maybe<{ start: number; end: number }>
	>();

	const render = React.useCallback(
		function render(renderItem: ItemRenderer<T>) {
			const { start, end } = itemsToHide ?? { start: items.length, end: 0 };
			return items
				.filter((_item, index) => {
					return index <= start || index >= end;
				})
				.map((item, index) => {
					return renderItem({ ...item, collapsed: index === start }, index);
				});
		},
		[items, itemsToHide],
	);

	function handleBeforeCapture({ draggableId }: BeforeCapture) {
		const item = items[draggableId];
		invariant(item, 'Invalid item in beforeCapture');
		const { start, end } = item;
		if (end - start > 1) {
			setItemsToHide({ start, end });
		}
	}

	function handleDragEnd(result: DropResult, provided: ResponderProvided) {
		const { source, destination } = result;
		const sourceItem = items[source.index];
		console.log(sourceItem);
		invariant(sourceItem, 'Invalid item for source in dragEnd');
		const sourceWithPath: DraggableLocationWithPath = {
			...source,
			path: sourceItem.path,
		};

		let destinationWithPath: DraggableLocationWithPath | undefined;
		if (destination != null) {
			const { start, end } = itemsToHide ?? { start: 0, end: 1 };
			console.log(destination.index, end - start, items.length);
			const destinationItem = items[destination.index];
			invariant(destinationItem, 'Invalid item for destination in dragEnd');
			destinationWithPath = {
				...destination,
				path: destinationItem.path,
			};
		}

		const resultWithPathes = {
			...result,
			source: sourceWithPath,
			destination: destinationWithPath,
		};

		setItemsToHide(null);
		onDragEnd(resultWithPathes, provided);
	}

	return (
		<DragDropContext
			{...dragDropContextProps}
			onDragEnd={handleDragEnd}
			onBeforeCapture={handleBeforeCapture}
		>
			{children(render)}
		</DragDropContext>
	);
}

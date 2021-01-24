import * as React from 'react';
import {
	Droppable,
	DroppableProps,
	DroppableProvided,
	DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import AppContext from './AppContext';
import NodeContext from './NodeContext';
import treeToList from './tree-to-list';
import TreeContext from './TreeContext';
import { ListItem, Item } from './types';

type RenderItem<T> = Pick<ListItem<T>, 'path' | 'value'>;
type ItemRenderer<T> = (item: RenderItem<T>, index: number) => React.ReactChild;

export interface Props<T> extends Omit<DroppableProps, 'children'> {
	nodes: Array<Item<T>>;
	children: (
		provided: DroppableProvided,
		render: (itemRenderer: ItemRenderer<T>) => React.ReactChild[],
		snapshot: DroppableStateSnapshot,
	) => React.ReactElement;
}

interface Interval {
	start: number;
	end: number;
}

function getItemsOutsideOfInterval(
	items: ListItem[],
	{ start, end }: Interval,
) {
	return items.filter((_item, index) => {
		return index <= start || index >= end;
	});
}

export default function Node<T>({
	nodes,
	children,
	...droppableProps
}: Props<T>) {
	const [itemsBeignDragged, setItemsBeingDragged] = React.useState<ListItem[]>(
		[],
	);
	const appContext = React.useContext(AppContext);
	const items = React.useMemo(() => {
		return treeToList(nodes);
	}, [nodes]);

	const { droppableId } = droppableProps;

	React.useEffect(() => {
		appContext.droppables.set(droppableId, { items, setItemsBeingDragged });
		return () => {
			appContext.droppables.delete(droppableId);
		};
	}, [appContext.droppables, droppableId, items]);

	const visibleItems = React.useMemo(() => {
		const [itemBeignDragged] = itemsBeignDragged;

		if (itemBeignDragged == null) {
			return items;
		}

		return getItemsOutsideOfInterval(items, itemBeignDragged);
	}, [items, itemsBeignDragged]);

	const render = React.useCallback(
		function render(renderItem: ItemRenderer<T>) {
			return visibleItems.map((item, index) => {
				const { path, value } = item;
				return (
					<NodeContext.Provider
						key={path.join(',') + ' ' + index}
						value={index}
					>
						{renderItem({ path, value }, index)}
					</NodeContext.Provider>
				);
			});
		},
		[visibleItems],
	);

	return (
		<TreeContext.Provider value={droppableId}>
			<Droppable {...droppableProps}>
				{(provided, snapshot) => {
					return children(provided, render, snapshot);
				}}
			</Droppable>
		</TreeContext.Provider>
	);
}

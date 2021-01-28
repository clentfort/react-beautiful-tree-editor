import * as React from 'react';
import {
	Droppable,
	DroppableProps,
	DroppableProvided,
	DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import treeToList from './tree-to-list';
import { Item, Node, Path } from './types';
import AppContext from './AppContext';
import TreeContext from './TreeContext';

interface ItemWithCollapsed<T> {
	value: T;
	collapsed: boolean;
	path: Path;
}

type ItemRenderer<T> = (
	item: ItemWithCollapsed<T>,
	index: number,
) => React.ReactChild;

interface ChildrenArg<T> {
	render: (itemRenderer: ItemRenderer<T>) => React.ReactChild[];
	provided: DroppableProvided;
	snapshot: DroppableStateSnapshot;
}

export interface Props<T> extends Omit<DroppableProps, 'children'> {
	nodes: Array<Node<T>>;
	children: (arg: ChildrenArg<T>) => React.ReactElement;
}

export default function Tree<T>({
	nodes,
	children,
	...droppableProps
}: Props<T>) {
	const [itemsBeignDragged, setItemsBeingDragged] = React.useState<Item<T>[]>(
		[],
	);
	const appContext = React.useContext(AppContext);
	const items = React.useMemo(() => {
		return treeToList(nodes);
	}, [nodes]);

	const { droppableId } = droppableProps;

	React.useEffect(() => {
		appContext.droppables.set(droppableId, { items, setItemsBeingDragged });
	}, [droppableId, items]);

	const visibleItems = React.useMemo(() => {
		if (itemsBeignDragged.length === 0) {
			return items;
		}

		const { start, end } = itemsBeignDragged[0];

		return items.filter((_item, index) => {
			return index <= start || index >= end;
		});
	}, [items, itemsBeignDragged]);

	const render = React.useCallback(
		function render(renderItem: ItemRenderer<T>) {
			const start =
				itemsBeignDragged.length > 0 ? itemsBeignDragged[0].start : -1;
			return visibleItems.map((item, index) => {
				const collapsed = index === start;
				const path = collapsed ? [] : item.path;
				return renderItem({ value: item.value, collapsed, path }, index);
			});
		},
		[visibleItems],
	);

	return (
		<TreeContext.Provider value={droppableId}>
			<Droppable {...droppableProps}>
				{(provided, snapshot) => {
					return children({ render, provided, snapshot });
				}}
			</Droppable>
		</TreeContext.Provider>
	);
}

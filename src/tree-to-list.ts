import { Item, ListItem, Path } from './types';

function treeToListInner<T>(
	nodes: Item<T>[],
	items: Array<ListItem<T>>,
	prefix: Path = [],
	initialOffset: number,
): number {
	let offset = initialOffset;
	items.length += nodes.length;
	for (let i = 0; i < nodes.length; i += 1) {
		const currentPath = [...prefix, i];
		const node = nodes[i];
		const { children, ...item } = node;
		const start = offset + i;
		items[start] = { ...item, path: currentPath, start, end: start + 1 };
		if (children) {
			const childrenLength = treeToListInner(
				children,
				items,
				currentPath,
				start + 1,
			);
			items[start].end += childrenLength;
			offset += childrenLength;
		}
	}
	return offset - initialOffset + nodes.length;
}

/**
 * Converts a tree-like data-structure to a list
 */
export default function treeToList<T>(
	nodes: Array<Item<T>>,
): Array<ListItem<T>> {
	const items: Array<ListItem<T>> = [];
	treeToListInner(nodes, items, [], 0);
	return items;
}

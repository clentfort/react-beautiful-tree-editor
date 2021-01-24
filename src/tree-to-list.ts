import { Item, Node, Path } from './types';

function treeToListInner<T>(
	nodes: Node<T>[],
	items: Array<Item<T>>,
	prefix: Path = [],
	initialOffset: number,
): number {
	let offset = initialOffset;
	items.length += nodes.length;
	for (let i = 0; i < nodes.length; i += 1) {
		const node = nodes[i];
		const { children, ...item } = node;
		const start = offset + i;
		items[start] = { ...item, path: prefix, start, end: start + 1 };
		if (children) {
			const childrenLength = treeToListInner(
				children,
				items,
				[...prefix, start],
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
export default function treeToList<T>(nodes: Node<T>[]): Array<Item<T>> {
	const items: Array<Item<T>> = [];
	treeToListInner(nodes, items, [], 0);
	return items;
}

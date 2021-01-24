export type Maybe<T> = T | null | undefined;

export type Path = number[];

export interface Node<T = string> {
	value: T;
	children?: Node<T>[];
}

export interface Item<T = string> {
	value: T;
	path: Path;
	start: number;
	end: number;
}

export interface RenderItem<T> extends Item<T> {
  collapsed: boolean;
}

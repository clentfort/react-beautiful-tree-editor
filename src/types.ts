export type Maybe<T> = T | null | undefined;

export type Path = number[];

export interface Node<T = any> {
	value: T;
	children?: Node<T>[];
}

export interface Item<T = any> {
	value: T;
	path: Path;
	start: number;
	end: number;
}


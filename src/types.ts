export interface Item<T = any> {
	value: T;
	children?: Item<T>[];
}

export interface ListItem<T = any> {
	value: T;
	path: Path;
	start: number;
	end: number;
}

export type Path = number[];

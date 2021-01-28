import { createContext } from 'react';
import { Id } from 'react-beautiful-dnd';
import { Item } from './types';

interface DraggableMeta {
	droppableId: Id;
	index: number;
}

interface DroppableMeta {
	items: Item[];
	setItemsBeingDragged(items: Item<any>[]): void;
}

export interface AppState {
	draggables: Map<Id, DraggableMeta>;
	droppables: Map<Id, DroppableMeta>;
}

export default createContext<AppState>({
	draggables: new Map(),
	droppables: new Map(),
});

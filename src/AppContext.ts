import { createContext } from 'react';
import { Id } from 'react-beautiful-dnd';
import { ListItem } from './types';

interface DraggableMeta {
	droppableId: Id;
	index: number;
}

interface DroppableMeta {
	items: ListItem[];
	setItemsBeingDragged(items: ListItem[]): void;
}

export interface AppState {
	draggables: Map<Id, DraggableMeta>;
	droppables: Map<Id, DroppableMeta>;
}

export default createContext<AppState>({
	draggables: new Map(),
	droppables: new Map(),
});

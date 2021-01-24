import * as React from 'react';
import { Draggable, DraggableProps } from 'react-beautiful-dnd';
import AppContext from './AppContext';
import NodeContext from './NodeContext';
import TreeContext from './TreeContext';

export type Props = Omit<DraggableProps, 'index'>;

export default function Tree(props: Props) {
	const appState = React.useContext(AppContext);
	const droppableId = React.useContext(TreeContext);
	const index = React.useContext(NodeContext);

	const { draggableId } = props;

	React.useEffect(() => {
		appState.draggables.set(draggableId, { droppableId, index });
		return () => {
			appState.draggables.delete(draggableId);
		};
	}, [appState.draggables, draggableId, droppableId, index]);

	return <Draggable {...props} index={index} />;
}

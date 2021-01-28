import * as React from 'react';
import { Draggable, DraggableProps } from 'react-beautiful-dnd';
import AppContext from './AppContext';
import TreeContext from './TreeContext';

export type Props = DraggableProps;

export default function Node(props: Props) {
	const appState = React.useContext(AppContext);
	const droppableId = React.useContext(TreeContext);

	const { draggableId, index } = props;

	React.useEffect(() => {
		appState.draggables.set(draggableId, { droppableId, index });
		return () => {
			appState.draggables.delete(draggableId);
		};
	}, [draggableId, droppableId, index]);
	return <Draggable {...props} />;
}

import { createContext } from 'react';
import { Id } from 'react-beautiful-dnd';

export type TreeState = Id;

export default createContext<TreeState>('');

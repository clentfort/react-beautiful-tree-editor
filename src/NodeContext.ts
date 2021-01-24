import { createContext } from 'react';

export type NodeState = number;

export default createContext<NodeState>(0);

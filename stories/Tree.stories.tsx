import { Meta, Story } from '@storybook/react';
import * as React from 'react';
import {
	TreeContext,
	TreeContextProps,
	Tree,
	Node,
	Item,
	reorder,
} from '../src';

import './tailwind.css';

interface TreeProps {
	droppableId: string;
	nodes: Item<string>[];
}

function BasicTree({ droppableId, nodes }: TreeProps) {
	return (
		<Node droppableId={droppableId} nodes={nodes}>
			{(provided, render, snapshot) => {
				return (
					<div
						className=""
						style={{ width: 400 }}
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						{render((item, index) => {
							return (
								<Tree draggableId={item.value}>
									{(provided, snapshot) => {
										return (
											<div
												className="rounded bg-blue-100 hover:bg-blue-200 p-2 m-1"
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
											>
												<span
													style={{
														display: 'inline-block',
														width: 20 * (item.path.length - 1),
													}}
												></span>
												{snapshot.isDragging ? '>' : 'v'} {item.value} (index:{' '}
												{index})
											</div>
										);
									}}
								</Tree>
							);
						})}
						{provided.placeholder}
					</div>
				);
			}}
		</Node>
	);
}

const DEFAULT_NODES_1: Item<string>[] = [
	{ value: 'a' },
	{ value: 'b' },
	{
		value: 'c',
		children: [
			{ value: 'ca' },
			{ value: 'cb' },
			{
				value: 'cc',
				children: [
					{ value: 'cca' },
					{
						value: 'ccb',
						children: [{ value: 'ccba' }, { value: 'ccbb' }],
					},
				],
			},
			{ value: 'cd' },
		],
	},
	{ value: 'd' },
	{ value: 'e' },
];

const DEFAULT_NODES_2: Item<string>[] = [
	{ value: 'f' },
	{
		value: 'g',
		children: [
			{ value: 'ga' },
			{ value: 'gb', children: [{ value: 'gba' }, { value: 'gbb' }] },
		],
	},
	{ value: 'h' },
];

const meta: Meta = {
	title: 'Basic',
	component: TreeContext,
	argTypes: {},
	parameters: {
		controls: { expanded: true },
	},
};

export default meta;

const SingleTreeComponent: Story<TreeContextProps> = (args) => {
	const [nodes, setNodes] = React.useState([
		...DEFAULT_NODES_1,
		...DEFAULT_NODES_2,
	]);
	return (
		<TreeContext
			{...args}
			onDragEnd={(event) => {
				const { source, destination } = event;

				if (destination == null) {
					return;
				}

				const { source: nextNodes } = reorder({
					source: nodes,
					sourcePath: source.path,
					destinationPath: destination.path,
				});

				setNodes(nextNodes);
			}}
		>
			<BasicTree droppableId="tree" nodes={nodes} />
		</TreeContext>
	);
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const SingleTree = SingleTreeComponent.bind({});

SingleTree.args = {};

const TreeToTreeComponent: Story<TreeContextProps> = (args) => {
	const [nodes1, setNodes1] = React.useState(DEFAULT_NODES_1);
	const [nodes2, setNodes2] = React.useState(DEFAULT_NODES_2);
	return (
		<TreeContext
			{...args}
			onDragEnd={(event) => {
				const { source, destination } = event;

				if (destination == null) {
					return;
				}

				const { droppableId: sourceDroppableId } = source;
				const { droppableId: destinationDroppableId } = destination;

				const [sourceNodes, setSourceNodes] =
					sourceDroppableId === 'tree1'
						? [nodes1, setNodes1]
						: [nodes2, setNodes2];

				const [destinationNodes, setDestinatioNodes] =
					destinationDroppableId === 'tree1'
						? [nodes1, setNodes1]
						: [nodes2, setNodes2];

				if (sourceDroppableId === destinationDroppableId) {
					const { source: nextSourceNodes } = reorder({
						source: sourceNodes,
						sourcePath: source.path,
						destinationPath: destination.path,
					});
					setSourceNodes(nextSourceNodes);
					return;
				}

				const {
					source: nextSourceNodes,
					destination: nextDestinationNodes,
				} = reorder({
					source: sourceNodes,
					destination: destinationNodes,
					sourcePath: source.path,
					destinationPath: destination.path,
				});

				setSourceNodes(nextSourceNodes);
				setDestinatioNodes(nextDestinationNodes);
			}}
		>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<BasicTree droppableId="tree1" nodes={nodes1} />
				<BasicTree droppableId="tree2" nodes={nodes2} />
			</div>
		</TreeContext>
	);
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const TreeToTree = TreeToTreeComponent.bind({});

TreeToTree.args = {};

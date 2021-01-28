import * as React from 'react';
import { Meta, Story } from '@storybook/react';
import {
	DragAndDropContext,
	DragAndDropContextProps,
	Draggable,
	Droppable,
} from '../src';

console.clear();

const meta: Meta = {
	title: 'Basic',
	component: DragAndDropContext,
	argTypes: {
		onDragEnd: {
			defaultValue: console.log,
		},
	},
	parameters: {
		controls: { expanded: true },
	},
};

export default meta;

const defaultNodes1 = [
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

const defaultNodes2 = [
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

const Template: Story<DragAndDropContextProps> = (args) => {
	const [nodes1, setNodes1] = React.useState(defaultNodes1);
	const [nodes2, setNodes2] = React.useState(defaultNodes2);
	return (
		<DragAndDropContext {...args}>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<Droppable droppableId="something1" nodes={nodes1}>
					{({ render, provided, snapshot }) => {
						return (
							<div {...provided.droppableProps} ref={provided.innerRef}>
								{render((item, index) => {
									return (
										<Draggable
											key={item.value}
											draggableId={item.value}
											index={index}
										>
											{(provided, snapshot) => {
												return (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													>
														<span
															style={{
																display: 'inline-block',
																width: 20 * item.path.length,
															}}
														></span>
														{item.collapsed ? '>' : 'v'} {item.value}{' '}
													</div>
												);
											}}
										</Draggable>
									);
								})}
								{provided.placeholder}
							</div>
						);
					}}
				</Droppable>
				<Droppable droppableId="something2" nodes={nodes2}>
					{({ render, provided, snapshot }) => {
						return (
							<div {...provided.droppableProps} ref={provided.innerRef}>
								{render((item, index) => {
									return (
										<Draggable
											key={item.value}
											draggableId={item.value}
											index={index}
										>
											{(provided, snapshot) => {
												return (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													>
														<span
															style={{
																display: 'inline-block',
																width: 20 * item.path.length,
															}}
														></span>
														{item.collapsed ? '>' : 'v'} {item.value}{' '}
													</div>
												);
											}}
										</Draggable>
									);
								})}
								{provided.placeholder}
							</div>
						);
					}}
				</Droppable>
			</div>
		</DragAndDropContext>
	);
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};

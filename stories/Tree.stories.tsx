import * as React from 'react';
import { Meta, Story } from '@storybook/react';
import Tree, { TreeProps } from '../src';
import { Droppable, Draggable } from 'react-beautiful-dnd';

console.clear();

const meta: Meta = {
	title: 'Basic',
	component: Tree,
	argTypes: {
		onDragEnd: {
			defaultValue: console.log,
		},
		nodes: {
			type: 'object',
			defaultValue: [
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
			],
		},
	},
	parameters: {
		controls: { expanded: true },
	},
};

export default meta;

const Template: Story<TreeProps<string>> = (args) => (
	<Tree {...args}>
		{(render) => {
			return (
				<Droppable droppableId="something">
					{(provided, snapshot) => {
						return (
							<div {...provided.droppableProps} ref={provided.innerRef}>
								{render((item, index) => {
									return (
										<Draggable
											key={item.id}
											draggableId={item.id}
											index={index}
										>
											{(provided, snapshot) => {
												return (
													<div
														key={item.value}
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
														{item.end - item.start}
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
			);
		}}
	</Tree>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};

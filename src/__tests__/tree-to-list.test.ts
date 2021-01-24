import treeToList from '../tree-to-list';
test('It converts a tree to a list', () => {
	const tree = [
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
	const list = [
		{ value: 'a', path: [], start: 0, end: 1 },
		{ value: 'b', path: [], start: 1, end: 2 },
		{ value: 'c', path: [], start: 2, end: 11 },
		{ value: 'ca', path: [2], start: 3, end: 4 },
		{ value: 'cb', path: [2], start: 4, end: 5 },
		{ value: 'cc', path: [2], start: 5, end: 10 },
		{ value: 'cca', path: [2, 5], start: 6, end: 7 },
		{ value: 'ccb', path: [2, 5], start: 7, end: 10 },
		{ value: 'ccba', path: [2, 5, 7], start: 8, end: 9 },
		{ value: 'ccbb', path: [2, 5, 7], start: 9, end: 10 },
		{ value: 'cd', path: [2], start: 10, end: 11 },
		{ value: 'd', path: [], start: 11, end: 12 },
		{ value: 'e', path: [], start: 12, end: 13 },
	];
	expect(treeToList(tree)).toEqual(list);
});

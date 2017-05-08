'use strict';

const {obj} = require('iblokz-data');

const indexAt = (a, k, v) => a.reduce((index, e, i) => ((e[k] === v) ? i : index), -1);
console.log(indexAt([{a: 0}, {a: 5}, {a: 7}, {a: 2}], 'a', 0));

const initial = {
	needsRefresh: false,
	list: [
		{
			_id: 0,
			title: 'Initial Project Setup',
			story: '',
			project: 'AlphaPM',
			time: {
				ass: 0,
				est: 360
			},
			type: 'dev',
			status: 'done',
			milestone: 'w15'
		},
		{
			_id: 1,
			title: 'Sync Session',
			story: '',
			project: 'SPP',
			time: {
				ass: 0,
				est: 360
			},
			type: 'sync',
			status: 'done',
			milestone: 'w15'
		},
		{
			_id: 2,
			title: 'Scheduling Test',
			story: '',
			project: 'SPP',
			time: {
				ass: 0,
				est: 360
			},
			type: 'dev',
			status: 'done',
			milestone: 'w15'
		},
		{
			_id: 3,
			title: 'Text Parsing Test',
			story: '',
			project: 'SPP',
			time: {
				ass: 0,
				est: 360
			},
			type: 'dev',
			status: 'backlog',
			milestone: 'w15'
		}
	]
};

const add = ({title, project, type, status}) => state => obj.patch(state, 'tasks', {
	list: state.tasks.list.concat({
		title: title.split(', ')[0],
		project: project || title.split(', ')[1] || '',
		type: type || title.split(', ')[2] || 'dev',
		status: status || 'backlog',
		time: {
			ass: 0,
			est: 0
		},
		createdAt: new Date()
	})
});

const edit = (id, patch, needsRefresh = false) => state => obj.patch(state, 'tasks', {
	needsRefresh,
	list: [indexAt(state.tasks.list, '_id', Number(id))]
	.map(index => (console.log({id, index, tasks: state.tasks.list}), index))
		.map(index => [].concat(
			state.tasks.list.slice(0, index),
			[Object.assign({}, state.tasks.list[index], patch)],
				state.tasks.list.slice(index + 1)
		)).pop()
});

const refresh = () => state => obj.patch(state, 'tasks', {needsRefresh: false});

module.exports = {
	initial,
	add,
	edit,
	refresh
};

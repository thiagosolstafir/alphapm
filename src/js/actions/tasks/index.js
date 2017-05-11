'use strict';

const {obj} = require('iblokz-data');
const objectId = require('bson-objectid');

const indexAt = (a, k, v) => a.reduce((index, e, i) => ((e[k] === v) ? i : index), -1);
console.log(indexAt([{a: 0}, {a: 5}, {a: 7}, {a: 2}], 'a', 0));

const arrPatchAt = (a, k, v, patch) => [indexAt(a, k, v)]
	.map(index => [].concat(
		a.slice(0, index),
		[Object.assign({}, a[index], patch)],
		a.slice(index + 1)
	)).pop();

const arrGreatest = (a, k) => a.reduce((g, e) => (g === undefined || g < e[k]) ? e[k] : g);

const arrElAt = (a, k, v) => a.filter(e => e[k] === v).pop();

const initial = {
	needsRefresh: false,
	list: [
		{
			_id: 0,
			name: 'Initial Project Setup',
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
			name: 'Sync Session',
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
			name: 'Scheduling Test',
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
			name: 'Text Parsing Test',
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

const add = ({name, project, type, status}) => state => obj.patch(state, 'tasks', {
	list: state.tasks.list.concat({
		_id: objectId().str,
		name: name.split(', ')[0],
		project: project || name.split(', ')[1] || '',
		type: type || name.split(', ')[2] || 'dev',
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
	list: arrPatchAt(state.tasks.list, '_id', id, patch)
});

const trackTime = (id, status, timestamp = new Date().getTime() / 1000 | 0) =>
	state => obj.patch(state, 'tasks', {
		needsRefresh: true,
		list: arrPatchAt(state.tasks.list, '_id', id, {
			status,
			activities: (status === 'doing')
				? [].concat(
					arrElAt(state.tasks.list, '_id', id).activities || [],
					{
						start: timestamp,
						type: 'tracking',
						end: 0
					}
				)
				: [].concat(
					arrElAt(state.tasks.list, '_id', id).activities.slice(0, -1) || [],
					Object.assign({}, arrElAt(state.tasks.list, '_id', id).activities.slice(-1), {
						end: timestamp
					})
				)
		})
	});

const refresh = () => state => obj.patch(state, 'tasks', {needsRefresh: false});

module.exports = {
	initial,
	add,
	edit,
	trackTime,
	refresh
};

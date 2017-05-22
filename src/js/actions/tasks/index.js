'use strict';

const {obj} = require('iblokz-data');
const objectId = require('bson-objectid');
const {diff, applyChange, applyDiff} = require('deep-diff');

const indexAt = (a, k, v) => a.reduce((index, e, i) => ((e[k] === v) ? i : index), -1);
console.log(indexAt([{a: 0}, {a: 5}, {a: 7}, {a: 2}], 'a', 0));

const arrPatchAt = (a, k, v, patch) => [indexAt(a, k, v)]
	.map(index => [].concat(
		a.slice(0, index),
		(patch instanceof Function)
			? patch(a[index], index)
			: [Object.assign({}, a[index], patch)],
		a.slice(index + 1)
	)).pop();

const arrGreatest = (a, k) => a.reduce((g, e) => (g === undefined || g < e[k]) ? e[k] : g);

const arrElAt = (a, k, v) => a.filter(e => e[k] === v).pop();

const arrExtract = (a, k) => a.reduce((items, item) => items.concat(item[k] !== undefined && item[k] || []), []);

const initial = {
	needsRefresh: false,
	list: [
/*
		{
			_id: '0',
			name: 'Initial Project Setup',
			story: '',
			project: 'AlphaPM',
			est: 360,
			type: 'dev',
			status: 'done',
			milestone: 'w15',
			activities: []
		},
		{
			_id: '1',
			name: 'Sync Session',
			story: '',
			project: 'SPP',
			est: 360,
			type: 'sync',
			status: 'done',
			milestone: 'w15',
			activities: []
		},
		{
			_id: '2',
			name: 'Scheduling Test',
			story: '',
			project: 'SPP',
			est: 360,
			type: 'dev',
			status: 'done',
			milestone: 'w15',
			activities: []
		},
		{
			_id: '3',
			name: 'Text Parsing Test',
			story: '',
			project: 'SPP',
			est: 360,
			type: 'dev',
			status: 'backlog',
			milestone: 'w15',
			activities: []
		}
*/
	]
};

const add = ({name, project, type, status}) => state => obj.patch(state, 'tasks', {
	list: state.tasks.list.concat({
		_id: objectId().str,
		name: name.split(', ')[0],
		project: project || name.split(', ')[1] || '',
		type: type || name.split(', ')[2] || 'dev',
		status: status || 'backlog',
		est: 0,
		createdAt: new Date(),
		activities: []
	})
});

const edit = (id, patch, needsRefresh = false) => state => obj.patch(state, 'tasks', {
	needsRefresh,
	list: arrPatchAt(state.tasks.list, '_id', id, patch)
});

const trackTime = (id, status, timestamp = new Date().getTime() / 1000 | 0) =>
	state => obj.patch(state, 'tasks', {
		needsRefresh: true,
		list: arrPatchAt(state.tasks.list, '_id', id, task => Object.assign({}, task, {
			status,
			activities: (status === 'doing')
				? (task.activities.length === 0 || ((timestamp - task.activities.slice(-1).pop().end) > 60))
					? [].concat(
						task.activities || [],
						{
							_id: objectId().str,
							start: timestamp,
							type: 'tracking',
							end: 0
						}
					)
					: [].concat(
						task.activities.slice(0, -1) || [],
						Object.assign(
							{},
							task.activities.slice(-1).pop(),
							{
								end: 0
							}
						)
					)
				: [].concat(
					task.activities.slice(0, -1) || [],
					Object.assign(
						{},
						task.activities.slice(-1).pop(),
						{
							end: timestamp
						}
					)
				)
		})).map(task =>
			(task._id !== id && status === 'doing' && task.status === 'doing')
				? Object.assign({}, task, {
					status: 'todo',
					activities: [].concat(
						task.activities.slice(0, -1) || [],
						Object.assign(
							{},
							task.activities.slice(-1).pop(),
							{
								end: timestamp
							}
						)
					)
				})
				: task
		)
	});

const refresh = () => state => obj.patch(state, 'tasks', {needsRefresh: false});

const upsert = tasks => state =>
	diff(tasks, state.tasks.list)
	? obj.patch(state, 'tasks', {
		needsRefresh: true,
		list: [arrExtract(tasks, '_id')].map(ids =>
			[].concat(
				state.tasks.list.filter(task => ids.indexOf(task._id) === -1),
				tasks.map(task => (
	//				console.log(arrElAt(state.tasks.list, '_id', task._id), task),
					Object.assign({}, arrElAt(state.tasks.list, '_id', task._id) || {}, task)
				))
			)
		).pop()
	})
	: state;

module.exports = {
	initial,
	add,
	edit,
	trackTime,
	refresh,
	upsert
};

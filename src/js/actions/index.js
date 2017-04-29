'use strict';

const {obj} = require('iblokz-data');

// initial
const initial = {
	// view: table, columns, calendar
	view: 'table',
	tasks: [
		{
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

// actions
const set = (key, value) => state => obj.patch(state, key, value);
const toggle = key => state => obj.patch(state, key, obj.sub(state, key));

module.exports = {
	initial,
	set,
	toggle
};

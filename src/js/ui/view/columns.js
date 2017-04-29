'use strict';

// dom
const {
	ul, li, i, h2,
	section, header, button, span, img, p, div, input,
	table, thead, tbody, tfoot, tr, td, th
} = require('iblokz-snabbdom-helpers');
// components
const moment = require('moment');

const statuses = ['backlog', 'todo', 'doing', 'done'];

module.exports = ({state, actions}) => section('#view.columns',
	statuses.map(status =>
		ul('.tasks', [
			li(h2(status.toUpperCase()))
		].concat(state.tasks.filter(task => task.status === status).map(task =>
			li('.task', [
				span('.task-title', task.title),
				span('.task-project', task.project),
				span('.task-status', task.status),
				span('.task-est', moment.utc(task.time.ass * 10000).format('H:mm')),
				span('.task-ass', moment.utc(task.time.est * 10000).format('H:mm'))
			])
		)))
	)
);

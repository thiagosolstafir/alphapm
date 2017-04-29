'use strict';

// dom
const {
	ul, li, i,
	section, header, button, span, img, p, div, input,
	table, thead, tbody, tfoot, tr, td, th
} = require('iblokz-snabbdom-helpers');
// components
const moment = require('moment');

module.exports = ({state, actions}) => section('#view.table', [
	ul('.tasks', state.tasks.map(task =>
		li('.task', [
			span('.task-title', task.title),
			span('.task-project', task.project),
			span('.task-status', task.status),
			span('.task-time', [
				i('.fa.fa-clock-o'),
				span('task-ass', moment.utc(task.time.est * 10000).format('H:mm')),
				'/',
				span('.task-est', moment.utc(task.time.ass * 10000).format('H:mm'))
			])
		])
	))
]);

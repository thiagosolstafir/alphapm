'use strict';

// dom
const {
	ul, li, i, h2, form, a,
	section, header, button, span, img, p, div, input,
	table, thead, tbody, tfoot, tr, td, th
} = require('iblokz-snabbdom-helpers');
// components
const taskLi = require('../comp/task-li');

// lib
const moment = require('moment');
const Sortable = require('sortablejs');
// util
const dom = require('../../util/dom');

const statuses = ['backlog', 'todo', 'doing', 'done'];

const capitalize = chunk => chunk.charAt(0).toUpperCase() + chunk.slice(1);

const getTimestamp = () => new Date().getTime() / 1000 | 0;

module.exports = ({state, actions, i18n}) => section('#view.columns',
	(state.tasks.needsRefresh === false) ? statuses.map(status =>
		ul(`#tasks-${status}.tasks`, {
			hook: {
				insert: vnode =>
					new Sortable(vnode.elm, {
						group: 'table',
						draggable: 'li.task',
						filter: '.opened',
						preventOnFilter: false,
						ghostClass: "placeholder",
						dataIdAttr: 'task-id',
						onAdd: ev => (status === 'doing' || ev.item.getAttribute('task-status') === 'doing')
							? actions.tasks.trackTime(ev.item.getAttribute('task-id'), status)
							: actions.tasks.update(ev.item.getAttribute('task-id'), {status}, true)
					})
			}
		}, [
			li(h2([
				capitalize(i18n.task.status[status]),
				status === 'done' ? span('.right', a('.dropdown', [
					i('.fa.fa-ellipsis-h.handle'),
					ul(['all', 'thisWeek', 'thisMonth'].map(period =>
						li('.text-left', {
							on: {
								click: () => actions.set(['tasks', 'filters', 'donePeriod'], period)
							}
						}, span([
							i('.fa', {
								class: {
									'fa-check-circle-o': state.tasks.filters.donePeriod === period,
									'fa-circle-o': state.tasks.filters.donePeriod !== period
								}
							}),
							' ',
							i18n.task.filters.donePeriod[period] || ''
						]))
					))
				])) : ''
			]))
		].concat(
			state.tasks.list
				.filter(task => state.project === false || (task.project.name || task.project) === (state.project.name || state.project))
				.filter(task => task.status === status)
				// done period
				.filter(task => status !== 'done' || state.tasks.filters.donePeriod === 'all'
					|| state.tasks.filters.donePeriod === 'thisWeek' && task.activities.length > 0 && task.activities.slice(-1).pop().end >= moment().startOf('isoweek').unix()
					|| state.tasks.filters.donePeriod === 'thisMonth' && task.activities.length > 0 && task.activities.slice(-1).pop().end >= moment().startOf('month').unix()
				)
				.map((task, index) => taskLi({task, state, actions, opened: state.tasks.editing === task._id})),
			[
				li('.add-task', form({
					on: {
						submit: ev => {
							ev.preventDefault();
							const data = dom.formToData(ev.target);
							actions.tasks.add(Object.assign({}, data, {status}));
							dom.clearForm(ev.target);
						}
					}
				}, input(`[name="name"][placeholder="${i18n.common.addTask}"]`)))
			]
		))
	) : []
);

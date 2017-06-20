'use strict';

// dom
const {
	ul, li, i, h2, form,
	section, header, button, span, img, p, div, input,
	table, thead, tbody, tfoot, tr, td, th
} = require('iblokz-snabbdom-helpers');
// components
const taskLi = require('../comp/task-li');

const moment = require('moment');
const Sortable = require('sortablejs');

const formToData = form => Array.from(form.elements)
	// .map(el => (console.log(el.name), el))
	.filter(el => el.name !== undefined)
	.reduce((o, el) => ((o[el.name] = el.value), o), {});

const clearForm = form => Array.from(form.elements)
	.forEach(el => (el.value = null));

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
						filter: '.editing',
						preventOnFilter: false,
						ghostClass: "placeholder",
						dataIdAttr: 'task-id',
						onAdd: ev => (status === 'doing' || ev.item.getAttribute('task-status') === 'doing')
							? actions.tasks.trackTime(ev.item.getAttribute('task-id'), status)
							: actions.tasks.update(ev.item.getAttribute('task-id'), {status}, true)
					})
			}
		}, [
			li(h2(capitalize(i18n.task.status[status])))
		].concat(
			state.tasks.list
				.filter(task => state.project === false || task.project === state.project)
				.filter(task => task.status === status)
				.map((task, index) => taskLi({task, actions, editing: state.tasks.editing === task._id})),
			[
				li('.add-task', form({
					on: {
						submit: ev => {
							ev.preventDefault();
							const data = formToData(ev.target);
							actions.tasks.add(Object.assign({}, data, {status}));
							clearForm(ev.target);
						}
					}
				}, input(`[name="name"][placeholder="${i18n.common.addTask}"]`)))
			]
		))
	) : []
);

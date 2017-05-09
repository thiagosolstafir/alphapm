'use strict';

// dom
const {
	ul, li, i, h2, form,
	section, header, button, span, img, p, div, input,
	table, thead, tbody, tfoot, tr, td, th
} = require('iblokz-snabbdom-helpers');
// components
const moment = require('moment');
const Sortable = require('sortablejs');

const formToData = form => Array.from(form.elements)
	// .map(el => (console.log(el.name), el))
	.filter(el => el.name !== undefined)
	.reduce((o, el) => ((o[el.name] = el.value), o), {});

const clearForm = form => Array.from(form.elements)
	.forEach(el => (el.value = undefined));

const statuses = ['backlog', 'todo', 'doing', 'done'];
const labels = {
	backlog: 'Запас',
	todo: 'На дневен ред',
	doing: 'В действие',
	done: 'Завършени'
};

const capitalize = chunk => chunk.charAt(0).toUpperCase() + chunk.slice(1);

module.exports = ({state, actions}) => section('#view.columns',
	(state.tasks.needsRefresh === false) ? statuses.map(status =>
		ul(`#tasks-${status}.tasks`, {
			hook: {
				insert: vnode =>
					new Sortable(vnode.elm, {
						group: 'table',
						draggable: 'li.task',
						ghostClass: "placeholder",
						dataIdAttr: 'task-id',
						onAdd: ev => actions.tasks.edit(ev.item.getAttribute('task-id'), {status}, true)
					})
			}
		}, [
			li(h2(capitalize(labels[status])))
		].concat(
			state.tasks.list.filter(task => task.status === status).map((task, index) =>
				li('.task', {
					attrs: {
						'task-id': task._id,
						'task-status': task.status
					},
					props: {
						draggable: true
					}
				}, [
					span('.task-title', task.title),
					span('.task-project', task.project),
					span('.task-status', task.status),
					span('.task-time', [
						i('.fa.fa-clock-o'),
						span('task-ass', moment.utc(task.time.est * 10000).format('H:mm')),
						'/',
						span('.task-est', moment.utc(task.time.ass * 10000).format('H:mm'))
					])
				])),
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
				}, input('[name="title"][placeholder="Добави Задача"]')))
			]
		))
	) : []
);

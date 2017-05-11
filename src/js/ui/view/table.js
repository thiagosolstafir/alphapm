'use strict';

// dom
const {
	ul, li, i, form,
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
	.forEach(el => (el.value = null));

const getTimestamp = () => new Date().getTime() / 1000 | 0;

const latestTime = task => getTimestamp() - task.activities.filter(a => a.type === 'tracking').sort().pop().start;

module.exports = ({state, actions}) => section('#view.table', [
	ul('.tasks', {
		hook: {
			insert: vnode =>
				new Sortable(vnode.elm, {
					group: 'table',
					draggable: 'li.task',
					ghostClass: "placeholder"
				})
		}
	}, [
		li('.add-task', form({
			on: {
				submit: ev => {
					ev.preventDefault();
					const data = formToData(ev.target);
					actions.tasks.add(data);
					clearForm(ev.target);
				}
			}
		}, input('[name="name"][placeholder="Добави Задача"]')))
	].concat(state.tasks.list.map(task =>
		li('.task', [
			span('.task-name', [
				i('.fa', {
					class: {
						'fa-code': task.type === 'dev',
						'fa-bug': task.type === 'bug',
						'fa-commenting-o': task.type === 'sync'
					}
				}),
				task.name
			]),
			span('.task-project', task.project),
			span('.task-status', task.status),
			span('.task-time', [
				task.status === 'doing' ? i('.fa.fa-clock-o') : '',
				span('task-ass', moment.utc(task.time.est * 10000).format('H:mm')),
				'/',
				span('.task-est', moment.utc(task.time.ass * 10000).format('H:mm'))
			])
		])
	)))
]);

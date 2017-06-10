'use strict';

const {
	ul, li, i, h2, a,
	section, header, span, img, p, div,
	table, thead, tbody, tfoot, tr, td, th,
	form, frameset, legend, label, input, button
} = require('iblokz-snabbdom-helpers');
// components

// lib
const moment = require('moment');

const taskTypeIcons = {
	dev: 'fa-code',
	bug: 'fa-bug',
	sync: 'fa-commenting-o',
	research: 'fa-book',
	planning: 'fa-road'
};

// time related
const getTimestamp = () => new Date().getTime() / 1000 | 0;

const getTrackedTime = task => task.activities
	.filter(act => act.type === 'tracking' && act.end > 0)
	.reduce((ass, act) => ass + act.end - act.start, 0) * 1000;

const getCurrentTracking = task => getTrackedTime(task) +
	(getTimestamp() - task.activities.slice(-1).pop().start) * 1000;

// modal related
const getParent = (el, tagName) => (el.parentNode.tagName === tagName)
	? el.parentNode
	: getParent(el.parentNode, tagName);

const syncRect = el => {
	const posRect = el.getBoundingClientRect();
	console.log(posRect);
	const wrapperEl = el.querySelector('.wrapper');
	wrapperEl.style.top = posRect.top + 'px';
	wrapperEl.style.left = posRect.left + 'px';
	wrapperEl.style.width = posRect.width + 'px';
	wrapperEl.style.bottom = (window.innerHeight - posRect.top - posRect.height) + 'px';
	wrapperEl.style.marginLeft = '0px';
};

module.exports = ({task, actions, editing = false}) => li('.task', {
	class: {editing},
	on: {dblclick: ev => actions.tasks.edit(task._id)},
	attrs: {'task-id': task._id, 'task-status': task.status},
	props: {draggable: !editing}
}, [
	span('.task-name', [
		i(`.fa.${taskTypeIcons[task.type] || 'fa-code'}`), task.name
	]),
	span('.task-project', task.project), span('.task-status', task.status),
	span('.task-time', [].concat(
		(task.status === 'doing')
			? [i('.fa.fa-clock-o'), span('task-ass', moment.utc(getCurrentTracking(task)).format('H:mm:ss'))]
			: span('task-ass', moment.utc(getTrackedTime(task)).format('H:mm')),
		'/',
		span('.task-est', moment.utc(task.est * 10000).format('H:mm'))
	)),
	(editing) ? div('#wrapper.wrapper', {
		hook: {
			insert: ({elm}) => {
				syncRect(getParent(elm, 'LI'));
				setTimeout(() => {
					elm.style.top = '20px';
					elm.style.bottom = '20px';
					elm.style.left = '50%';
					elm.style.width = '500px';
					elm.style.marginLeft = '-250px';
				});
			},
			remove: ({elm}) => {
				syncRect(getParent(elm, 'LI'));
				elm.addEventListener('transitionend', () => getParent(elm, 'LI').removeChild(elm));
			}
		}
	}, [
		div('.modal', [
			a('.close-modal', {
				on: {
					click: () => actions.tasks.edit(null)
				}
			}, i('.fa.fa-close')),
			form(
				div([i('.fa.fa-pencil'), input({
					on: {
						blur: ev => actions.tasks.update(task._id, {name: ev.target.value}, false)
					},
					attrs: {
						value: task.name
					}
				})])
			)
		])
	]) : ''
]);

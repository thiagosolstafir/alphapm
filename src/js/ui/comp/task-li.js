'use strict';

const {
	ul, li, i, h2, a, pre,
	section, header, span, img, p, div,
	table, thead, tbody, tfoot, tr, td, th,
	form, frameset, legend, label, input, button
} = require('iblokz-snabbdom-helpers');
// components
const modal = require('./modal');

// lib
const moment = require('moment');
const crypto = require('crypto');

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

module.exports = ({task, actions, opened = false}, content = false) => li('.task.modal', {
	class: {opened},
	on: {dblclick: ev => actions.tasks.edit(task._id)},
	attrs: {'task-id': task._id, 'task-status': task.status},
	props: {draggable: !opened}
}, [].concat(
	content && content || [
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
		))
	],
	(opened) ? modal({
		onClose: () => actions.tasks.edit(null)
	}, [
		h2('[contenteditable="true"]', {
			on: {blur: ev => actions.tasks.update(task._id, {name: ev.target.textContent}, false)}
		}, task.name),
		pre('.task-story[contenteditable="true"][placeholder="Story ..."]', {
			on: {
				focus: ev => (ev.target.textContent = task.story || ''),
				blur: ev => actions.tasks.update(task._id, {story: ev.target.textContent}, false)
			}
		}, task.story || 'Story ...'),
		label('Users'),
		ul('.task-users', [].concat(
			task.users ? task.users.map(user => li(img({
				attrs: {
					src: `http://www.gravatar.com/avatar/${
						crypto.createHash('md5').update(user.email).digest("hex")
					}`,
					title: user.name || user.email
				}
			}))) : '',
			li(button('.fa.fa-plus.dropdown', [
			]))
		)),
		label('Activities'),
		ul('.task-activities', task.activities.map(act =>
			li([
				span('.act-type', act.type),
				input('.act-start[type="datetime-local"]', {
					on: {
						change: ev => actions.tasks.actUpdate(task._id, act._id, {
							start: moment(ev.target.value, 'YYYY-MM-DDTHH:mm').unix()
						})
					},
					attrs: {
						value: moment.unix(act.start).format('YYYY-MM-DDTHH:mm')
					}
				}),
				act.end > 0 ? input('.act-end[type="datetime-local"]', {
					on: {
						change: ev => actions.tasks.actUpdate(task._id, act._id, {
							end: moment(ev.target.value, 'YYYY-MM-DDTHH:mm').unix()
						})
					},
					attrs: {
						value: act.end && moment.unix(act.end).format('YYYY-MM-DDTHH:mm')
					}
				}) : 'In progress ...'
			])
		))
	]) : ''
));

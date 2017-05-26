'use strict';

// dom
const {
	ul, li, i,
	section, header, button, span, img, p, div, input,
	table, thead, tbody, tfoot, tr, td, th
} = require('iblokz-snabbdom-helpers');
// components

const moment = require('moment');

module.exports = ({state, actions, views}) => header([
	ul('.left',
		views.map(view =>
			li({
				class: {active: view.key === state.view},
				on: {click: () => actions.set('view', view.key)}
			}, [
				i(`.fa.fa-${view.icon}`),
				span({
					style: {width: (view.key === state.view) ? ((view.title.length * 9) + 7) + 'px' : '0px'}
				}, (view.key === state.view) ? view.title : '')
			])
		)
	),
	button('.dropdown', [
		span(state.project || 'Всички'),
		i('.fa.fa-toggle-down'),
		ul([].concat(
			state.project !== false
				? li({on: {click: () => actions.set('project', false)}}, span('Всички')) : [],
			state.tasks.list.reduce((projects, task) => (projects.indexOf(task.project) === -1)
			? [].concat(projects, task.project)
			: projects, [])
			.filter(project => project !== state.project)
			.map(project =>
				li({on: {click: () => actions.set('project', project)}}, span(project))
			)))
	]),
	img('[src="assets/img/logo-2.svg"]'),
	span('.right', moment().format('DD MMMM YYYY, H:mm:ss'))
]);

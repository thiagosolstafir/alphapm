'use strict';

// dom
const {
	ul, li, i, a,
	section, header, button, span, img, p, div, input,
	table, thead, tbody, tfoot, tr, td, th
} = require('iblokz-snabbdom-helpers');
// components

const moment = require('moment');

// vex dialog
const vex = require('vex-js');
const prompt = (message, cb) => vex.dialog.prompt({
	message,
	callback: v => v && v !== '' && cb(v)
});

const langFlags = {
	bg: 'bg',
	en: 'gb',
	es: 'es'
};

module.exports = ({state, actions, views, i18n}) => header([
	ul('.left',
		views.map(view =>
			li({
				class: {active: view.key === state.view},
				on: {click: () => actions.set('view', view.key)}
			}, [
				i(`.fa.fa-${view.icon}`),
				span({
					style: {width: (view.key === state.view) ? ((i18n.views[view.key].length * 9) + 7) + 'px' : '0px'}
				}, (view.key === state.view) ? i18n.views[view.key] : '')
			])
		)
	),
	button('.dropdown', [
		span(state.project || i18n.common.all),
		i('.fa.fa-toggle-down'),
		ul([].concat(
			state.project !== false
				? li({on: {click: () => actions.set('project', false)}}, span(i18n.common.all)) : [],
			state.tasks.list.reduce((projects, task) => (projects.indexOf(task.project) === -1)
			? [].concat(projects, task.project)
			: projects, [])
			.filter(project => project !== state.project)
			.map(project =>
				li({on: {click: () => actions.set('project', project)}}, span(project))
			)))
	]),
	state.project && button(i('.fa.fa-pencil')) || '',
	button(i('.fa.fa-plus')),
	img('.logo[src="assets/img/logo-2.svg"]'),
	a('.dropdown.right', [
		img(`[src="assets/img/flags/${langFlags[state.lang || 'bg']}.svg"]`),
		ul(['bg', 'en', 'es']
			.filter(lang => lang !== state.lang)
			.map(lang =>
				li({on: {click: () => actions.set('lang', lang)}}, img(`[src="assets/img/flags/${langFlags[lang]}.svg"]`))
			))
	]),
	span('.right', moment().format('DD MMMM YYYY, H:mm:ss'))
]);

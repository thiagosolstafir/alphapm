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
	de: 'de',
	es: 'es',
	ko: 'kr'
};

module.exports = ({state, actions, views, i18n}) => header([
	ul('.toolbar.left', [
		li(ul('.accordion',
			views.map(view =>
				li({
					class: {active: view.key === state.view},
					on: {click: () => actions.set('view', view.key)}
				}, [
					i(`.fa.fa-${view.icon}`),
					span({
						style: {width: (view.key === state.view) ? ((i18n.views[view.key].length * ((state.lang !== 'ko') ? 9 : 16)) + 7) + 'px' : '0px'}
					}, (view.key === state.view) ? i18n.views[view.key] : '')
				])
			)
		)),
		li(button('.dropdown', [
			span(state.project || i18n.common.allProjects),
			i('.handle.fa.fa-toggle-down'),
			ul([].concat(
				state.project !== false
					? li({on: {click: () => actions.set('project', false)}}, span(i18n.common.allProjects)) : [],
				state.tasks.list.reduce((projects, task) => (projects.indexOf(task.project) === -1)
				? [].concat(projects, task.project)
				: projects, [])
				.filter(project => project !== state.project)
				.map(project =>
					li({on: {click: () => actions.set('project', project)}}, span(project))
				)))
		]))
	]),
	img('.logo[src="assets/img/logo-2.svg"]'),
	ul('.toolbar.right', [
		li(span(moment().format('DD.MM.YY H:mm'))),
		li(a('.dropdown', [
			img(`.handle[src="assets/img/flags/${langFlags[state.lang || 'bg']}.svg"]`),
			ul(Object.keys(langFlags)
				.filter(lang => lang !== state.lang)
				.map(lang =>
					li({on: {click: () => actions.set('lang', lang)}}, img(`[src="assets/img/flags/${langFlags[lang]}.svg"]`))
				))
		]))
	])
]);

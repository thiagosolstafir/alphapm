'use strict';

// dom
const {
	ul, li, i, a, form,
	section, header, button, span, img, p, div, input,
	table, thead, tbody, tfoot, tr, td, th, h1
} = require('iblokz-snabbdom-helpers');
// components
const modal = require('./comp/modal');

const moment = require('moment');
const crypto = require('crypto');

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


const formToData = form => Array.from(form.elements)
	// .map(el => (console.log(el.name), el))
	.filter(el => el.name !== undefined)
	.reduce((o, el) => ((o[el.name] = el.value), o), {});

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
		li(a('.dropdown.flags', [
			img(`.handle[src="assets/img/flags/${langFlags[state.lang || 'bg']}.svg"]`),
			ul(Object.keys(langFlags)
				.filter(lang => lang !== state.lang)
				.map(lang =>
					li({on: {click: () => actions.set('lang', lang)}}, img(`[src="assets/img/flags/${langFlags[lang]}.svg"]`))
				))
		])),
		li(
			a('.btn.modal', {
				style: {position: 'relative'},
				class: {
					opened: state.modal === 'sign-in',
					dropdown: state.auth.user
				},
				on: {
					click: () => (!state.auth.user && state.modal !== 'sign-in')
						? actions.set('modal', 'sign-in') : {}
				}
			},
				(!state.auth.user)
					? [
						i('.fa.fa-sign-in'),
						state.modal === 'sign-in' ? modal({
							onClose: () => setTimeout(() => actions.set('modal', false)),
							parent: 'A',
							pos: {
								top: '50%',
								left: '50%',
								width: '400px',
								height: '200px',
								marginTop: '-100px',
								marginLeft: '-200px'
							}
						}, [
							form('.block', {
								on: {
									submit: ev => {
										ev.preventDefault();
										setTimeout(actions.set('modal', false));
										setTimeout(() => {
											let data = formToData(ev.target);
											actions.auth.login(data);
										}, 700);
									}
								}
							}, [
								h1([
									i('.fa.fa-sign-in'),
									span(' Sign In')
								]),
								input('[type="text"][name="email"][placeholder="Email"]'),
								input('[type="password"][name="password"][placeholder="Password"]'),
								button('Sign In')
							])
						]) : ''
					]
				: [
					img('.handle', {
						attrs: {
							src: `http://www.gravatar.com/avatar/${
								crypto.createHash('md5').update(state.auth.user.email).digest("hex")
							}`,
							title: state.auth.user.name || state.auth.user.email
						}
					}),
					ul([
						li(span('Edit Profile')),
						li(span('Change Picture')),
						li({
							on: {
								click: () => setTimeout(() => actions.auth.logout())
							}
						}, [
							span([ i('.fa.fa-sign-out'), ' Sign out'])
						])
					])
				]
			)
		)
	])
]);

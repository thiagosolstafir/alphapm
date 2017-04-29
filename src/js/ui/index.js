'use strict';

// dom
const {
	ul, li, i,
	section, header, button, span, img, p, div, input,
	table, thead, tbody, tfoot, tr, td, th
} = require('iblokz-snabbdom-helpers');
// components
const moment = require('moment');
require('moment/locale/bg');

const {obj} = require('iblokz-data');

const views = ['table', 'columns', 'calendar'];
const uiViews = {
	table: require('./view/table'),
	columns: require('./view/columns'),
	calendar: require('./view/calendar')
};

module.exports = ({state, actions}) => section('#ui', [
	header([
		ul('.left',
			views.map(view =>
				li({
					class: {active: view === state.view},
					on: {click: () => actions.set('view', view)}
				}, i(`.fa.fa-${view}`))
			)
		),
		img('[src="assets/img/logo.svg"]'),
		p('.right', moment().format('DD MMMM YYYY, H:mm:ss'))
	]),
	section('.content', [
		uiViews[state.view]({state, actions})
	])
]);

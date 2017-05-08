'use strict';

// dom
const {
	ul, li, i,
	section, button, span, img, p, div, input,
	table, thead, tbody, tfoot, tr, td, th
} = require('iblokz-snabbdom-helpers');
// components
const moment = require('moment');
require('moment/locale/bg');

const {obj} = require('iblokz-data');

const views = [{
	key: 'table',
	title: 'Дневен Ред',
	icon: 'tasks'
}, {
	key: 'columns',
	title: 'Канбан',
	icon: 'columns'
}, {
	key: 'calendar',
	title: 'Календар',
	icon: 'calendar'
}];

const uiViews = {
	table: require('./view/table'),
	columns: require('./view/columns'),
	calendar: require('./view/calendar')
};

const header = require('./header');

module.exports = ({state, actions}) => section('#ui', [
	header({state, actions, views}),
	section('.content', (state.tasks.needsRefresh === false) ? [
		uiViews[state.view]({state, actions})
	] : [])
]);

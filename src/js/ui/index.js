'use strict';

// dom
const {
	ul, li, i,
	section, button, span, img, p, div, input,
	table, thead, tbody, tfoot, tr, td, th
} = require('iblokz-snabbdom-helpers');
// components

const {obj} = require('iblokz-data');

const views = [{
	key: 'list',
	icon: 'tasks'
}, {
	key: 'columns',
	icon: 'columns'
}, {
	key: 'calendar',
	icon: 'calendar'
}];

const uiViews = {
	list: require('./view/list'),
	columns: require('./view/columns'),
	calendar: require('./view/calendar')
};

const header = require('./header');

module.exports = ({state, actions, i18n}) => section('#ui', [
	header({state, actions, views, i18n}),
	section('.content', [
		uiViews[state.view]({state, actions, i18n})
	])
]);

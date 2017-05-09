'use strict';

// data
const {str, obj} = require('iblokz-data');

// dom
const {
	ul, li, i, h2, label,
	section, header, button, span, img, p, div, input,
	table, thead, tbody, tfoot, tr, td, th
} = require('iblokz-snabbdom-helpers');
// components
const moment = require('moment');

const getWeekdays = () => {
	let iterator = moment().startOf('week');
	let weekdays = [];

	for (let i = 0; i < 7; i++) {
		weekdays.push(iterator.clone());
		iterator.add(1, 'day');
	}
	return weekdays;
};

const capitalize = chunk => chunk.charAt(0).toUpperCase() + chunk.slice(1);

module.exports = ({state, actions}) => section('#view.calendar', getWeekdays().map((day, index) =>
	ul('.tasks', [
		li(label(capitalize(moment(day).format('dddd, D MMM')))),
		li('.add-task', [
			button('Добави ...')
			// (index === 3) ? div('.tooltip-container', div('.tooltip')) : ''
		])
	])
));

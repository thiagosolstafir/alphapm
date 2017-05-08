'use strict';

const {obj} = require('iblokz-data');

const tasks = require('./tasks');

// initial
const initial = {
	// view: table, columns, calendar
	view: 'table'
};

// actions
const set = (key, value) => state => obj.patch(state, key, value);
const toggle = key => state => obj.patch(state, key, obj.sub(state, key));

module.exports = {
	initial,
	tasks,
	set,
	toggle
};

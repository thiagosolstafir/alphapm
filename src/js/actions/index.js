'use strict';

const {obj} = require('iblokz-data');

const tasks = require('./tasks');
const projects = require('./projects');

// initial
const initial = {
	// view: table, columns, calendar
	view: 'list',
	project: false,
	lang: 'bg'
};

// actions
const set = (key, value) => state => obj.patch(state, key, value);
const toggle = key => state => obj.patch(state, key, obj.sub(state, key));

module.exports = {
	initial,
	tasks,
	projects,
	set,
	toggle
};

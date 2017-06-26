'use strict';

const {obj} = require('iblokz-data');

const tasks = require('./tasks');
const users = require('./users');
const projects = require('./projects');

const supportedLanguages = ['bg', 'en', 'es', 'de', 'es', 'ko'];
const getBrowserLang = () => [(navigator.languages
  ? navigator.languages[0]
  : (navigator.language || navigator.userLanguage)
).slice(0, 2)]
	.map(lang => supportedLanguages.indexOf(lang) > -1 ? lang : 'en').pop();

// initial
const initial = {
	// view: table, columns, calendar
	view: 'list',
	project: false,
	lang: getBrowserLang(),
	modal: false
};

// actions
const set = (key, value) => state => obj.patch(state, key, value);
const toggle = key => state => obj.patch(state, key, obj.sub(state, key));

module.exports = {
	initial,
	tasks,
	users,
	projects,
	set,
	toggle
};

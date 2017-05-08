'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');

const envFile = path.resolve(__dirname, 'env', process.env.NODE_ENV + '.json');

module.exports = Object.assign(
	{
		root,
		rest: require('./rest.json')
	},
	require('./env/default.json'),
	fs.existsSync(envFile) ? require(envFile) : {},
	process.env.PORT && {port: process.env.PORT} || {}
);

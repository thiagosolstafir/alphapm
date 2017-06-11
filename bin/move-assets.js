'use strict';

const fse = require('fs-extra');
const path = require('path');

const paths = {
	'dist/fonts': 'node_modules/font-awesome/fonts',
	'dist/assets': 'src/assets',
	'dist/assets/img/flags': 'node_modules/flag-icon-css/flags/4x3'
};

Object.keys(paths).forEach(
	p => fse.copySync(
		path.resolve(__dirname, '..', paths[p]),
		path.resolve(__dirname, '..', p)
	)
);

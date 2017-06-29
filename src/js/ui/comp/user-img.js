'use strict';

const {
	ul, li, i, h2, a, pre, h,
	section, header, span, img, p, div,
	table, thead, tbody, tfoot, tr, td, th,
	form, frameset, legend, label, input, button
} = require('iblokz-snabbdom-helpers');
// components

// lib
const moment = require('moment');
const crypto = require('crypto');

module.exports = ({user, click = () => {}, selector = ''}) => h(`img${selector}`, {
	on: {
		click
	},
	attrs: {
		src: `http://www.gravatar.com/avatar/${
			crypto.createHash('md5').update(user.email).digest("hex")
		}`,
		title: user.name || user.email
	}
});

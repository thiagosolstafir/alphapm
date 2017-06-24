'use strict';

const {obj} = require('iblokz-data');
const objectId = require('bson-objectid');
const {diff, applyChange, applyDiff} = require('deep-diff');

const indexAt = (a, k, v) => a.reduce((index, e, i) => ((obj.sub(e, k) === v) ? i : index), -1);
// console.log(indexAt([{a: 0}, {a: 5}, {a: 7}, {a: 2}], 'a', 0));

const patchAt = (a, k, v, patch) => [indexAt(a, k, v)]
	.map(index => [].concat(
		a.slice(0, index),
		(patch instanceof Function)
			? patch(a[index], index)
			: [Object.assign({}, a[index], patch)],
		a.slice(index + 1)
	)).pop();

const compare = (arr, k, comp = (a, b) => a > b) =>
	arr.reduce((g, e) => (g === null || comp(obj.sub(e, k), g)) ? obj.sub(e, k) : g, null);
const max = (arr, k) => compare(arr, k, (a, b) => a > b);
const min = (arr, k) => compare(arr, k, (a, b) => a < b);
// console.log('min', min([{a: 1}, {a: 3}, {a: 2}], 'a'));

// get element that matches key value
const elementAt = (a, k, v) => a.filter(e => obj.sub(e, k) === v).pop();

const extract = (a, k) => a.reduce((items, item) => items.concat(item[k] !== undefined && item[k] || []), []);
const unique = (c1, c2) => c1.filter(el => indexAt(c2, '_id', el._id) === -1);

module.exports = {
	indexAt,
	patchAt,
	compare,
	max,
	min,
	elementAt,
	extract,
	unique
};

'use strict';

const {obj} = require('iblokz-data');
const objectId = require('bson-objectid');

const indexAt = (a, k, v) => a.reduce((index, e, i) => ((e[k] === v) ? i : index), -1);
console.log(indexAt([{a: 0}, {a: 5}, {a: 7}, {a: 2}], 'a', 0));

const arrPatchAt = (a, k, v, patch) => [indexAt(a, k, v)]
	.map(index => [].concat(
		a.slice(0, index),
		(patch instanceof Function)
			? patch(a[index], index)
			: [Object.assign({}, a[index], patch)],
		a.slice(index + 1)
	)).pop();

const initial = {
	list: []
};

const add = name => state => obj.patch(state, 'projects', {
	list: [].concat(
		state.projects.list,
		{
			_id: objectId().str,
			name
		}
	)
});

const edit = (id, patch) => state => obj.patch(state, 'projects', {
	list: arrPatchAt(state.projects.list, '_id', id, patch)
});

module.exports = {
	initial,
	add,
	edit
};

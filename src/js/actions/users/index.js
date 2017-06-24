'use strict';

const {obj} = require('iblokz-data');
const objectId = require('bson-objectid');
const {diff, applyChange, applyDiff} = require('deep-diff');
const collection = require('../../util/collection');

const initial = {
	list: []
};

const upsert = list => state =>
	diff(list, state.users.list)
	? obj.patch(state, 'users', {
		needsRefresh: true,
		list: [collection.extract(list, '_id')].map(ids =>
			[].concat(
				state.users.list.filter(user => ids.indexOf(user._id) === -1),
				list.map(user => (
	//				console.log(arrElAt(state.users.list, '_id', user._id), user),
					Object.assign({}, collection.elementAt(state.users.list, '_id', user._id) || {}, user)
				))
			)
		).pop()
	})
	: state;

module.exports = {
	initial,
	upsert
};

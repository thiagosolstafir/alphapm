'use strict';

const {obj} = require('iblokz-data');
const objectId = require('bson-objectid');
const {diff, applyChange, applyDiff} = require('deep-diff');
const collection = require('../../util/collection');

const initial = {
	list: []
};

const add = name => state => obj.patch(state, 'projects', {
	list: [].concat(
		state.projects.list,
		{
			_id: objectId().str,
			name,
			users: [],
			createdAt: new Date(),
			createdBy: state.auth.user && state.auth.user._id || null
		}
	)
});

const edit = (id, patch) => state => obj.patch(state, 'projects', {
	list: collection.patchAt(state.projects.list, '_id', id, patch)
});

const upsert = list => state =>
	diff(list, state.projects.list)
	? obj.patch(state, 'projects', {
		list: [collection.extract(list, '_id')].map(ids =>
			[].concat(
				state.projects.list.filter(project => ids.indexOf(project._id) === -1),
				list.map(project => (
	//				console.log(arrElAt(state.projects.list, '_id', project._id), project),
					Object.assign({}, collection.elementAt(state.projects.list, '_id', project._id) || {}, project)
				))
			)
		).pop()
	})
	: state;

module.exports = {
	initial,
	add,
	edit,
	upsert
};

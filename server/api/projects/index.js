'use strict';

const ObjectID = require('mongodb').ObjectID;

const upsert = (docs, collection, db) => {
	var bulk = db.connection.db.collection(collection).initializeUnorderedBulkOp();
	docs
		.map(doc => Object.assign({}, doc, doc._id
			?	{_id: new ObjectID(doc._id)}
			: {}
		))
		.forEach(doc => {
			bulk.find({_id: doc._id}).upsert().replaceOne(doc);
		});
	return bulk.execute();
};

module.exports = ({app, db, config}) => {
	app.route('/api/projects')
		.patch(function(req, res) {
			let bulkResult = (req.body.list.length > 0) && upsert(req.body.list, 'projects', db) || [];
			// if (req.body.list.length > 0 && bulkResult !== {}) console.log(req.body.list, bulkResult);
			res.json({
				done: true,
				bulkResult
			});
		});
};

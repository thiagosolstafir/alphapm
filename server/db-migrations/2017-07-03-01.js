'use strict';

const Rx = require('rx');
const $ = Rx.Observable;
const ObjectID = require('mongodb').ObjectID;

module.exports = ({db}) => {
	const User = db.model('User');
	const Task = db.model('Task');
	const Project = db.model('Project');
	// projects
	console.log('>> projects');
	// createdBy missing -> user 1 (if exists)
	console.log('- createdBy missing or null -> user 1 (if exists)');
	User.findOne().then(user => Project.find({createdBy: {$exists: false}})
		.then(projects => projects.forEach(project => {
			if (user._id) {
				project.set('createdBy', user._id);
				project.save(err => console.log(err));
			}
		}))
	);

	// tasks
	console.log('>> tasks');
	// when createdBy missing -> get from project.createdBy
	console.log('- when createdBy missing -> get from project.createdBy');
	Project.find({createdBy: {$exists: true}}).then(projects => projects.forEach(project =>
		Task.find({'project._id': project._id, 'createdBy': {$exists: false}})
			.then(tasks => {
				tasks.forEach(task => {
					task.set('createdBy', project.createdBy);
					task.save();
				});
			}, err => console.log(err))
	), err => console.log(err));

	console.log('end');
};

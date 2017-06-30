'use strict';

// dom
const {
	ul, li, i, form, h, h2, a,
	section, header, button, span, img, p, div, input,
	table, thead, tbody, tfoot, tr, td, th
} = require('iblokz-snabbdom-helpers');
const userImg = require('../comp/user-img');

module.exports = ({state, actions}) => section('#view.projects', [
	section([
		h2('Personal'),
		ul(state.projects.list.map(project =>
			li([
				div('.project-name', project.name),
				div('.project-data', [
					div('.project-tasks', [
						'Tasks: ', state.tasks.list.filter(task => task.project.name === project.name).length
					]),
					div('.project-users', [].concat(
						state.users.list.filter(user => user._id === project.createdBy),
						project.users || []
					).map(user => userImg({user})))
				])
			])
		))
	])
]);

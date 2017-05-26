'use strict';

// lib
const Rx = require('rx');
const $ = Rx.Observable;
const request = require('superagent');

// iblokz
const vdom = require('iblokz-snabbdom-helpers');
const {obj, arr} = require('iblokz-data');

// util
const time = require('./util/time');

// app
const app = require('./util/app');
let actions = app.adapt(require('./actions'));
window.actions = actions;
let ui = require('./ui');
let actions$;

// hot reloading
if (module.hot) {
	// actions
	actions$ = $.fromEventPattern(
    h => module.hot.accept("./actions", h)
	).flatMap(() => {
		actions = app.adapt(require('./actions'));
		return actions.stream.startWith(state => state);
	}).merge(actions.stream);
	// ui
	module.hot.accept("./ui", function() {
		ui = require('./ui');
		actions.stream.onNext(state => state);
	});
} else {
	actions$ = actions.stream;
}

// actions -> state
const state$ = actions$
	.startWith(() => actions.initial)
	.scan((state, change) => change(state), {})
	.map(state => (console.log(state), state))
	.share();

// state -> ui
// const ui$ = time.loop(state$).map(({state}) => ui({state, actions}));
//	.map(uiPatch => (console.log({uiPatch}), uiPatch));
// const ui$ = state$.map(state => ui({state, actions}));
const ui$ = $.combineLatest(
	state$,
	$.interval(500),
	(state, time) => ({state, time})
)
	.map(({state}) => ui({state, actions}));

vdom.patchStream(ui$, '#ui');

state$
	.distinctUntilChanged(state => state.tasks.needsRefresh)
	.filter(state => state.tasks.needsRefresh)
	.subscribe(state => actions.tasks.refresh());

// syncing
state$
	.distinctUntilChanged(state => state.tasks.list)
	.subscribe(state => {
		request
			.patch('/api/tasks')
			.send({list: state.tasks.list})
			.then(res => console.log(res.body));
	});

// console.log('diff', diff([1, 2, 3], [1, 2, 3, 4]));
$.interval(5000 /* ms */)
		.timeInterval()
		.startWith({})
		.flatMap(() => $.fromPromise(
			request
				.get('/api/tasks?limit=1000')
		))
		.filter(res => res.status === 200)
		.subscribe(res => actions.tasks.upsert(res.body.list));

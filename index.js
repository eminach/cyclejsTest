import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';

function main(sources) {
  return {
    DOM: sources.DOM.select('.myinput').events('input')
      .map(ev => ev.target.value)
      .startWith('')
      .map(name =>
        div([
          label('Name:'),
          input('.myinput', {attributes: {type: 'text'}}),
          hr(),
          h1(`Hello ${name}`)
        ])
      )
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app')
});
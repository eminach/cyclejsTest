import Cycle from '@cycle/core';
import {div, table, tbody, thead, th, tr, td, button, h1, h4, a, makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import Rx from 'Rx';

function main(sources) {
  const ITEMS_URL ='http://jsonplaceholder.typicode.com/comments'; //'http://localhost:3000/items';
  const getItems$ = Rx.Observable
    .of({
        url: ITEMS_URL,
        method: 'GET'
      });

  const item$ = sources.HTTP
    .filter(res$ => res$.request.url.indexOf(ITEMS_URL) === 0)
    .mergeAll()
    .map(res => res)
    .startWith('Loading..');
  const vtree$ = item$.map(item =>
    div(item.body)
    );

  const sinks = {
    DOM: vtree$,
    HTTP: getItems$
  };
  return sinks;
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
});
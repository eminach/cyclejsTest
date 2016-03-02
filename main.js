import Cycle from '@cycle/core';
import {div, table, tbody, thead, th, tr, td, button, h1, input, label, hr, a, makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import Rx from 'Rx';

function main(sources) {
  const ITEMS_URL = 'http://localhost:3000/items';
  //const getItems$ = Rx.Observable
   // .of({
    //   url: ITEMS_URL,
     //  method: 'GET'
    //});
  const searchRequest$ = sources.DOM.select('.form-control').events('input')    
    .debounce(500)
    .map(ev => ev.target.value)
    .filter(query => query.length > 0)
    .map(q => ({
      url: ITEMS_URL + '?q=' + encodeURI(q),
      //category: 'github',
    }));
  
  const item$ = sources.HTTP
    .filter(res$ => res$.request.url.indexOf(ITEMS_URL) === 0)
    .mergeAll()
    .map(res => JSON.parse(res.text))
    .startWith([]);
  const vtree$ = item$.map(allItems => 
        div([
        label('Search:'),
        input({className: 'form-control', attributes: {type: 'text'}}),
        button({className: 'btn'}, 'Get all'),
        hr(),
        table('.table .table-bordered',
            thead([
                tr([
                    th('Title', 'Description')
                ])
            ]), allItems.map(item=>       
            tbody([
                tr([
                    td(item.title), td(item.description)
                ])
            ]))
         )
         ])
    );

  const sinks = {
    DOM: vtree$,
    HTTP:  searchRequest$.startWith({url: ITEMS_URL})
  };
  return sinks;
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
});
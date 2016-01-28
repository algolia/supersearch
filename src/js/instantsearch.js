'use strict';

let instantsearch = require('instantsearch.js');

let search = instantsearch({
  appId: 'VC519DRAY3',
  apiKey: '5c796d39dcd489e62b89b38dae03fbc4',
  indexName: 'sb_ads',
  urlSync: false
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#search',
    placeholder: 'Find ads from big games past&hellip;',
    wrapInput: false
  })
);

search.addWidget(
  instantsearch.widgets.hits({
    hitsPerPage: 42,
    container: '#results',
    templates: {
      empty: `<h2>No Results :(</h2>
        <h3>What about starting a new search?</h2>`,
      item: document.getElementById('hit-template').innerHTML 
    }
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#years',
    attributeName: 'year',
    operator: 'or',
    limit: 1000,
    sortBy: ['name:asc'],
    templates: {
      header: 'Filters: <a href="javascript:void(0)" id="toggleFilter" class="button">open</a>',
    }
  })
);

search.start();

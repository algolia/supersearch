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
      empty: 'No Results',
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
    templates: {
      header: 'Filter by years :'
    }
  })
);

search.start();

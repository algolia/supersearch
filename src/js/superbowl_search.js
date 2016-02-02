'use strict';

//until 1.2 is released
// let instantsearch = require('instantsearch.js');
const inceptionWidget = require('./widgets/inception.js');


let superbowlsearch = instantsearch({
  appId: 'VC519DRAY3',
  apiKey: 'ba8e7e5e700d53fe3f28f20226b63baf',
  indexName: 'sb_ads',
  urlSync: true
});

window.search = superbowlsearch;

superbowlsearch.addWidget(
  instantsearch.widgets.searchBox({
    container: '#search',
    placeholder: 'Find ads from big games past&hellip;',
    wrapInput: false
  })
);

superbowlsearch.addWidget(
  instantsearch.widgets.hits({
    hitsPerPage: 30,
    container: '#results',
    templates: {
      empty: `<h2>No Results</h2>
        <h3>What about starting a new search?</h2>`,
      item: document.getElementById('hit-template').innerHTML
    }
  })
);

superbowlsearch.addWidget(
  instantsearch.widgets.menu({
    container: '#years',
    attributeName: 'year',
    limit: 1000,
    sortBy: ['name:desc'],
    templates: {
      // header: '<a href="javascript:void(0)" class="toggle"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#add-icon"></use></svg> Year</a>',
      header: false,
      item: '{{name}}'
    }
  })
);

superbowlsearch.addWidget(
  instantsearch.widgets.currentRefinedValues({
    container: "#refinements",
    clearAll: false,
    templates: {
      item: '<a href="javascript:void(0)">{{name}} <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clear-icon"></use></svg></a>',
      clearAll: '<a href="javascript:void(0)"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clear-icon"></use></svg> Clear All</a>',
    }
  })
);

superbowlsearch.addWidget(
  inceptionWidget({
    container: '#brands',
    mainSearchAttribute: 'brand',
    title: '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#add-icon"></use></svg> Brand',
    secondarySearchAttribute: 'name',
    index: 'sb_ads_brands'
  })
)

// search.addWidget(
//   instantsearch.widgets.refinementList({
//     container: '#brand-filters',
//     attributeName: 'brand',
//     operator: 'or',
//     limit: 25,
//     templates: {
//       header: 'Brands'
//     }
//   })
// );
//
// search.addWidget(
//   instantsearch.widgets.refinementList({
//     container: '#year-filters',
//     attributeName: 'year',
//     operator: 'or',
//     limit: 25,
//     templates: {
//       header: 'Years'
//     }
//   })
// );
//
// search.addWidget(
//   instantsearch.widgets.pagination({
//     container: '#pagination',
//     maxPages: 10
//   })
// );

superbowlsearch.start();

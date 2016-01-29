const template = {
  main: function(data){
    return `
      <a href='javascript:void(0);' class='menu-trigger'>${data.title}</a>
      <div class='menu'>
        <input class='value' placeholder='Search ${data.title}'/>
        <ul class='items'></ul>
      </div>`;
  },
  item: function(value, highlight){
    return `<li data-facet-value="${value}">${highlight}</li>`;
  }
}

const inceptionWidget = function(config){
  let isMenuHidden = true;

  const container = config.container;
  const mainSearchAttribute = config.mainSearchAttribute;
  const secondarySearchAttribute = config.secondarySearchAttribute;
  const index = config.index;
  const title = config.title;

  return {
    getConfiguration: function(){
      const widgetConfiguration = {
        'disjunctiveFacets': [mainSearchAttribute]
      };

      return widgetConfiguration;
    },
    init: function(params){
      const helper = params.helper;
      const $container = document.querySelector(container);

      $container.innerHTML = template.main({title: title});

      setTimeout(function(){
        const $input = $container.querySelector('input');
        const $list = $container.querySelector('ul');
        const $menu = $container.querySelector('.menu');
        const $button = $container.querySelector('.menu-trigger');

        $input.addEventListener('keyup', function(e){
          const query = $input.value;
          if(query === '') {
            const results = helper.lastResults
            updateList($list, mainSearchAttribute, results);
          }
          else {
            helper.searchOnce({
              index: index,
              query: query
            }).then(updateListSearchOnce.bind(undefined, secondarySearchAttribute, $list));
          }
        });

        $list.addEventListener('click', function(e){
          const target = e.target;
          const facetValue = target.dataset.facetValue;
          helper.addDisjunctiveFacetRefinement(mainSearchAttribute, facetValue).search();
          $menu.style.display = 'none';
          isMenuHidden = true;
          $input.value = '';
        });

        $menu.style.display = 'none';
        $button.addEventListener('click', () => {
          if(isMenuHidden) {
            $menu.style.display = 'block';
            isMenuHidden = false;
          }
          else {
            $menu.style.display = 'none';
            isMenuHidden = true;
          }
        });
      }, 0);
    },
    render: function(params){
      // updates when the search change
      const results = params.results;
      const $container = document.querySelector(container);
      const $list = $container.querySelector('ul');

      updateList($list, mainSearchAttribute, results);
    }
  };
};

function updateList ($list, attribute, results){
  const facets = results.getFacetValues(attribute);

  const list = facets.map(function(facet){
    return template.item(facet.name, facet.name);
  }).join('');

  $list.innerHTML = list;
};

function updateListSearchOnce(attribute, $list, response) {
  const results = response.content;

  if(results.nbHits === 0) {
    $list.innerHTML = '';
    return;
  }

  const list = results.hits.map(function(hit){
    const hlValue = (hit._highlightResult[attribute] && hit._highlightResult[attribute].value)|| hit[attribute];
    return template.item(hit[attribute], hlValue);
  }).join('');

  $list.innerHTML = list;
};


module.exports = inceptionWidget;

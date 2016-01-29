const template = {
  main: function(data){
    return `
      <a href='javascript:void(0);' class='menu-trigger'>${data.title}</a>
      <div class='menu'>
        <a href="javascript:void(0)" class="close"><svg height="34px" id="Layer_1" style="enable-background:new 0 0 34 34;" version="1.1" viewBox="0 0 512 512" width="34px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z"></path></svg></a>
        <form role="search" novalidate="novalidate" class="searchbox sbx-custom">
            <input name="brand" type="search" placeholder="Search for a brand" autocomplete="off" required="required" class="sbx-custom__input ais-search-box--input" autocapitalize="off" autocorrect="off" role="textbox" spellcheck="false">
            <button type="submit" class="sbx-custom__submit">
              <svg role="img" aria-label="Search">
                <title>Icon Search</title>
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-search-6"></use>
              </svg>
            </button>
            <button type="reset" class="sbx-custom__reset">
              <svg role="img" aria-label="Reset">
                <title>Icon Reset</title>
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-clear-3"></use>
              </svg>
              <!--Js: focus search input after reset-->
              <script type="text/javascript">
                //<![CDATA[
                 document.querySelector('.searchbox [type="reset"]').addEventListener('click', function() {
                   this.parentNode.querySelector('input').focus();
                 });

                //]]>
              </script>
              <script type="text/template" id="hit-template">
                <a href="#" dataid="https://www.youtube.com/watch?v={{objectID}}" style="background-image: url('{{thumbnails.high.url}}')" class="hit"><div class="hit-brand">{{{_highlightResult.brand.value}}}</div><div class="hit-season">{{year}} - {{sbYear}}</div></a>
              </script>
            </button>
          </form>
        <ul class='items'></ul>
      </div>`;
  },
  item: function(value, highlight){
    return `<li data-facet-value="${value}">${highlight}</li>`;
  }
}

const inceptionWidget = function(config){

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
        const $input = $container.querySelector('input[type="search"]');
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
          $input.value = '';
        });
        $menu.classList.add('hide');
        $button.addEventListener('click', () => {
          $menu.classList.remove('hide');
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

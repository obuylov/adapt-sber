/*
* adapt-search
* License - https://github.com/cgkineo/adapt-search/blob/master/LICENSE
* Maintainers - Gavin McMaster <gavin.mcmaster@kineo.com>
*/
define([
  'core/js/adapt',
  './searchDrawerItemView',
  './searchResultsView',
  './search-algorithm'
], function(Adapt, SearchDrawerItemView, SearchResultsView, SearchAlgorithm){

  var lastSearchQuery = null;
  var lastSearchObject = null;
  var isSearchShown = false;

  var searchConfigDefault = {
    _previewWords: 15,
    _previewCharacters: 30,
    _showHighlights: true,
    _showFoundWords: true,
    title: "Search",
    description: "Type in search words",
    placeholder: "",
    noResultsMessage: "Sorry, no results were found",
    awaitingResultsMessage: "Formulating results..."
  };

  Adapt.on('search-algorithm:ready', function(){
    Adapt.course.set('_search', _.extend(searchConfigDefault, Adapt.course.get('_search')) );

    var searchConfig = Adapt.course.get('_search');
    searchConfig.title = searchConfig.title || 'Search';
    searchConfig.description = searchConfig.description || 'Description';

    var drawerObject = {
      title: searchConfig.title,
      description: searchConfig.description,
      className: 'is-search',
      drawerOrder: searchConfig._drawerOrder || 0
    };

    Adapt.drawer.addItem(drawerObject, 'resources:showSearch');
  });

  Adapt.on('resources:showSearch', function() {
    if (isSearchShown) return;

    var searchConfig = Adapt.course.get('_search');
    searchConfig = new Backbone.Model(searchConfig);

    var template = Handlebars.templates['searchSingleItem'];
    var $element = $(template(searchConfig.toJSON()));

    Adapt.drawer.triggerCustomView($element, true);

    Adapt.trigger("search:draw");
  });

  Adapt.on('drawer:openedItemView search:draw', function(){
    isSearchShown = true;

    var searchConfig = Adapt.course.get('_search');
    searchConfig = new Backbone.Model(searchConfig);

    var $searchDrawerButton = $(".is-search");

    if ($searchDrawerButton.is(":not(div)")) {
      var $replacementButton = $("<div></div>");
      $replacementButton.attr("class", $searchDrawerButton.attr("class"));
      $searchDrawerButton.children().appendTo($replacementButton);
      $searchDrawerButton.replaceWith($replacementButton);
    }

    if (lastSearchObject && lastSearchObject.searchResults && lastSearchObject.searchResults.length === 0) {
      lastSearchObject = null;
      lastSearchQuery = null;
    }

    $('.drawer__holder .is-search').append(new SearchDrawerItemView({model:searchConfig, query: lastSearchQuery}).el);
    $('.drawer__holder .is-search').append(new SearchResultsView({model:searchConfig, searchObject: lastSearchObject}).el);
  });

  Adapt.on('drawer:closed', function() {
    isSearchShown = false;
  });

  Adapt.on('search:filterTerms', function(query){
    var searchConfig = Adapt.course.get('_search');
    var searchObject;

    lastSearchQuery = query;

    if (query.length === 0) {
      searchObject = _.extend({}, searchConfig, {
        query: query,
        searchResults: [],
        isAwaitingResults: false,
        isBlank: true
      });
    } else if (query.length < searchConfig._minimumWordLength) {
      searchObject = _.extend({}, searchConfig, {
        query: query,
        searchResults: [],
        isAwaitingResults: true,
        isBlank: false
      });
    } else {
      var results = SearchAlgorithm.find(query);

      searchObject = _.extend({}, searchConfig, {
        query: query,
        searchResults: results,
        isAwaitingResults: false,
        isBlank: false
      });
    }

    lastSearchObject = searchObject;

    Adapt.trigger('search:termsFiltered', searchObject);
  });

  Adapt.once('drawer:noItems', function(){
    $('.nav-drawer-btn').removeClass('u-display-none');
  });

});

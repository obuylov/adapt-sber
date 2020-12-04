define([
  'coreJS/adapt'
], function(Adapt) {
  var SberIconsView = Backbone.View.extend({
    _articleModels: [],

    initialize: function() {

    },

    onPageReady: function() {

    }
  });

  Adapt.on("pageView:postRender", function(view) {
    var model = view.model;
      new SberIconsView({
        model: model,
        el: view.el
      });
  });

});

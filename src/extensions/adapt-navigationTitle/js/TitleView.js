define([
  'core/js/adapt'
], function(Adapt) {

  var TitleView = Backbone.View.extend({

    className: "navigation-title",

    initialize: function() {
      this.render();
    },

    render: function() {
      var data = this.model.toJSON();
      this.$el.html(Handlebars.templates[this.constructor.template](data));
    }

  },{
    template: "navigationTitle"
  });

  return TitleView;

});

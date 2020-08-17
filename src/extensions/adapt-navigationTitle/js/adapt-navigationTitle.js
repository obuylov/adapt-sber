define([
  'core/js/adapt',
  './TitleView'
],function(Adapt, TitleView) {

  var NavigationTitle = Backbone.Controller.extend({

    initialize: function() {
      this.listenTo(Adapt, "adapt:initialize", this.onDataReady);
    },

    onDataReady: function() {
      if (this.titleView) this.titleView.remove();

      var config = Adapt.course.get("_navigationTitle");
      if (!config || !config._isEnabled) return;

      this.titleView = new TitleView({
        model: new Backbone.Model(config)
      });

      // if 'navigation logo' is present in the navigation, insert after
      var $navLogo = $('.navigation-logo');
      if ($navLogo.length > 0) {
        this.titleView.$el.insertAfter($navLogo);
        return;
      }
      // otherwise just insert after back button
      var $backBtn = ".js-nav-back-btn";
      this.titleView.$el.insertAfter($backBtn);
    }

  });

  return new NavigationTitle();

});

define([
  'core/js/adapt',
  './LogoView'
],function(Adapt, LogoView) {

  var NavigationLogo = Backbone.Controller.extend({

    initialize: function() {
      this.listenTo(Adapt, "adapt:initialize", this.onDataReady);
    },

    onDataReady: function() {
      if (this.logoView) this.logoView.remove();

      var config = Adapt.course.get("_navigationLogo");
      if (!config || !config._isEnabled) return;

      this.logoView = new LogoView({
        model: new Backbone.Model(config)
      });

      var selector = ".js-nav-back-btn";
      this.logoView.$el.insertAfter($(selector));
    }

  });

  return new NavigationLogo();

});

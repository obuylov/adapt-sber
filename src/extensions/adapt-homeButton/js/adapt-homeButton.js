define([
  'core/js/adapt'
], function(Adapt) {

  var HomeButton = Backbone.Controller.extend({

    _$html: null,

    initialize: function() {
      this.listenTo(Adapt, 'app:dataReady', this._onDataReady);
    },

    _onDataReady: function() {
      var config = Adapt.config.get('_homeButton');
      if (!config || !config._isEnabled) return;

      this._$html = $('html');

      this.listenTo(Adapt, {
        'remove': this._onRemove,
        'router:menu router:page': this._onRouterEvent,
        'navigation:redirectedHomeButton': this._redirected
      });
    },

    _onRouterEvent: function(model) {
      this._config = model.get('_homeButton');

      var isEnabled = (this._config && this._config._isEnabled);
      if (!isEnabled) return this._disabled();
      this._enabled();
    },

    _onRemove: function() {
      this._disabled();
    },

    _disabled: function() {
      this._$html.removeClass('hide-nav-home-btn');

      if (this._dataEvent) {
        $('.js-nav-home-btn').attr('data-event', this._dataEvent);
        this._dataEvent = null;
      }
    },

    _enabled: function() {
      this._$html.toggleClass('hide-nav-home-btn', !!this._config._hideHomeButton);
      // extend functionality to toggle back button display
      this._$html.toggleClass('hide-nav-back-btn', !!this._config._hideBackButton);

      if (!$('.js-nav-home-btn')[0]) {
        // if home button doesn't exist create home button
        this._createHomeButton();
      }

      if (this._config._redirectToId) {
        this._dataEvent = $('.js-nav-home-btn').attr('data-event');
        $('.js-nav-home-btn').attr('data-event', 'redirectedHomeButton');
      }
    },

    _createHomeButton: function() {
      var config = Adapt.course.get('_homeButton');
      var altText = (config && config.alt);
      var $backButton = $('button[data-event="backButton"]');
      var $icon = $('<div>', { 'class': 'icon' });
      var $homeButton = $('<button>', {
        attr: {
          'data-event': 'homeButton'
        },
        'class': 'btn-icon nav__btn nav__homebutton-btn js-nav-home-btn',
        'aria-label': altText,
        role: 'link'
      }).append($icon);

      // insert immediately after back button (so that tab order is correct)
      $homeButton.insertAfter($backButton);
    },

    _redirected: function() {
      if (!this._config._redirectToId) return;

      var model = Adapt.findById(this._config._redirectToId);
      if (!model) return;

      switch (model.get('_type')) {
        case 'course':
          Backbone.history.navigate('#/', { trigger: true, replace: false });
          break;
        case 'menu':
        case 'page':
          Backbone.history.navigate('#/id/' + model.get('_id'), { trigger: true, replace: false });
          break;
      }
    }

  });

  return new HomeButton();

});

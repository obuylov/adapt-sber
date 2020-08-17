define([
  'core/js/adapt',
  'core/js/models/menuModel',
  'core/js/views/menuView',
  './adapt-contrib-boxMenuItemView',
  './adapt-contrib-boxMenuGroupView'
], function(Adapt, MenuModel, MenuView, BoxMenuItemView, BoxMenuGroupView) {

  var BoxMenuView = MenuView.extend({

    initialize: function() {
      MenuView.prototype.initialize.apply(this);
      this.setStyles();

      this.listenTo(Adapt, {
        'device:changed': this.onDeviceResize
      });
    },

    onDeviceResize: function() {
      this.setStyles();
    },

    addChildren: function() {
      var nthChild = 0;
      var models = this.model.getChildren().models;
      this.childViews = {};
      models.forEach(function(model) {
        if (!model.get('_isAvailable')) return;

        nthChild++;
        model.set('_nthChild', nthChild);

        var ChildView = (model.get('_type') === 'menu' && model.get('_boxMenu') && model.get('_boxMenu')._renderAsGroup) ?
          BoxMenuGroupView :
          BoxMenuItemView;

        var $parentContainer = this.$(this.constructor.childContainer);
        var childView = new ChildView({ model: model });

        this.childViews[model.get('_id')] = childView;

        $parentContainer.append(childView.$el);

      }.bind(this));
    },

    setStyles: function() {
      this.setBackgroundImage();
      this.setBackgroundStyles();
      this.processHeader();
    },

    setBackgroundImage: function() {
      var config = this.model.get('_boxMenu');
      var backgroundImages = config && config._backgroundImage;

      if (!backgroundImages) return;

      var backgroundImage;

      switch (Adapt.device.screenSize) {
        case 'large':
          backgroundImage = backgroundImages._large;
          break;
        case 'medium':
          backgroundImage = backgroundImages._medium;
          break;
        default:
          backgroundImage = backgroundImages._small;
      }

      if (backgroundImage) {
        this.$el
          .addClass('has-bg-image')
          .css('background-image', 'url(' + backgroundImage + ')');
      } else {
        this.$el
          .removeClass('has-bg-image')
          .css('background-image', '');
      }
    },

    setBackgroundStyles: function () {
      var config = this.model.get('_boxMenu');
      var styles = config && config._backgroundStyles;

      if (!styles) return;

      this.$el.css({
        'background-repeat': styles._backgroundRepeat,
        'background-size': styles._backgroundSize,
        'background-position': styles._backgroundPosition
      });
    },

    processHeader: function() {
      var config = this.model.get('_boxMenu');
      var header = config && config._menuHeader;

      if (!header) return;

      var $header = this.$('.menu__header');

      this.setHeaderBackgroundImage(header, $header);
      this.setHeaderBackgroundStyles(header, $header);
      this.setHeaderMinimumHeight(header, $header);
    },

    setHeaderBackgroundImage: function(config, $header) {
      var backgroundImages = config._backgroundImage;

      if (!backgroundImages) return;

      var backgroundImage;

      switch (Adapt.device.screenSize) {
        case 'large':
          backgroundImage = backgroundImages._large;
          break;
        case 'medium':
          backgroundImage = backgroundImages._medium;
          break;
        default:
          backgroundImage = backgroundImages._small;
      }

      if (backgroundImage) {
        $header
          .addClass('has-bg-image')
          .css('background-image', 'url(' + backgroundImage + ')');
      } else {
        $header
          .removeClass('has-bg-image')
          .css('background-image', '');
      }
    },

    setHeaderBackgroundStyles: function (config, $header) {
      var styles = config._backgroundStyles;

      if (!styles) return;

      $header.css({
        'background-repeat': styles._backgroundRepeat,
        'background-size': styles._backgroundSize,
        'background-position': styles._backgroundPosition
      });
    },

    setHeaderMinimumHeight: function(config, $header) {
      var minimumHeights = config._minimumHeights;

      if (!minimumHeights) return;

      var minimumHeight;

      switch (Adapt.device.screenSize) {
        case 'large':
          minimumHeight = minimumHeights._large;
          break;
        case 'medium':
          minimumHeight = minimumHeights._medium;
          break;
        default:
          minimumHeight = minimumHeights._small;
      }

      if (minimumHeight) {
        $header
          .addClass('has-min-height')
          .css('min-height', minimumHeight + 'px');
      } else {
        $header
          .removeClass('has-min-height')
          .css('min-height', '');
      }
    }

  }, {
    className: 'boxmenu',
    template: 'boxMenu'
  });

  // Use as default "_type": "course" or "_type": "menu" view.
  // Note: This is necessary to maintain legacy behaviour in the AAT where
  // only one menu is usable per course and the course / menu is assumed to be
  // a core model and use the only installed MenuView.
  Adapt.register('course menu', {
    view: BoxMenuView
  });

  // Use for "_component": "boxMenu", or "_view": "boxMenu" and "_model": "boxMenu"
  Adapt.register('boxMenu', {
    view: BoxMenuView,
    model: MenuModel.extend({})
  });

});

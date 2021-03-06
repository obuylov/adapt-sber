define([
  './themeView',
  'core/js/adapt'
], function(ThemeView, Adapt) {

  var ThemePageView = ThemeView.extend({

    className: function() {},

    setCustomStyles: function() {
      this.processHeader();
      this.setupPagePhoto();

      setTimeout(() => this.updateUpButton(), 500);
      this.listenTo(Adapt.contentObjects, {
        'change:_isComplete change:_isLocked': function () {
          setTimeout(() => this.updateUpButton(), 500);
        }
      });
    },

    updateUpButton: function() {
      let el = $(".js-pagenav-btn[data-type='_up']");
      el.addClass("is-locked");
      el.on("click", function() {
        $.scrollTo(0, 500);
      })
    },

    setupPagePhoto: function() {
      var id = Adapt.location._currentId;
      var page = Adapt.contentObjects._byAdaptID[id][0];

      if (!page.get('_graphic') || this.$el.find('.page__photo').length > 0) return false;

      var el = this.$el.find('.page__header-inner');

      if (!page.get('_graphic').src) return false;

      el[0].innerHTML += `<div class="page__photo"><img src="${page.get('_graphic').src}" alt="page photo"></div><div class="page__texts"></div>`;
      el.find('.page__texts').append(el.find('.page__title'));

      if (el.find('.page__body')) {
        el.find('.page__texts').append(el.find('.page__body'));
      }

      $(el).addClass("with-pic");
    },

    processHeader: function() {
      var header = this.model.get('_pageHeader');

      if (!header) return;

      var $header = this.$('.page__header');

      this.setHeaderBackgroundImage(header, $header);
      this.setHeaderBackgroundStyles(header, $header);
      this.setHeaderMinimumHeight(header, $header);
    },

    setHeaderBackgroundImage: function(config, $header) {
      var backgroundImages = config._backgroundImage;

      if (!backgroundImages) return;

      var backgroundImage;

      switch (Adapt.device.screenSize) {
        case "large":
          backgroundImage = backgroundImages._large;
          break;
        case "medium":
          backgroundImage = backgroundImages._medium;
          break;
        default:
          backgroundImage = backgroundImages._small;
      }

      if (backgroundImage) {
        $header
          .addClass("has-bg-image")
          .css("background-image", "url(" + backgroundImage + ")");
      } else {
        $header
          .removeClass("has-bg-image")
          .css("background-image", "");
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
        case "large":
          minimumHeight = minimumHeights._large;
          break;
        case "medium":
          minimumHeight = minimumHeights._medium;
          break;
        default:
          minimumHeight = minimumHeights._small;
      }

      if (minimumHeight) {
        $header
          .addClass("has-min-height")
          .css("min-height", minimumHeight + "px");
      } else {
        $header
          .removeClass("has-min-height")
          .css("min-height", "");
      }
    },

    onRemove: function() {}

  });

  return ThemePageView;

});

define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

  var ListView = ComponentView.extend({

    preRender: function() {
      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setReadyStatus();

      this.setupInviewCompletion('.component__widget');

      if (!this.model.get('_animateList')) return;

      this.$el.addClass('is-animated-list');
      this.$('.list__container').on('onscreen.animate', this.checkIfOnScreen.bind(this));
    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    },

    /**
     * Kicks off the list item animation once the list container is at least 70% on screen
     */
    checkIfOnScreen: function (event, measurements) {
      // if % inview isn't set use default 70%
      var percentage = (this.model.get('_percentInviewVertical'))
        ? this.model.get('_percentInviewVertical')
        : 70;

      if (measurements.percentFromTop >= percentage) return;

      $(event.currentTarget).addClass('is-inview').off('onscreen.animate');

      this.animateListItems();
    },

    /**
     * animates the list items in one-by-one
     */
    animateListItems: function() {
      this.$('.list__item').each(function(index, listItem) {
        setTimeout(function() {
          $(listItem).addClass('is-animating');
        }, 200 * index);
      });
    },

    remove: function() {
      this.$('.list__container').off('onscreen.animate');

      ComponentView.prototype.remove.call(this);
    }
  },
  {
    template: 'list'
  });

  return Adapt.register('list', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: ListView
  });

});

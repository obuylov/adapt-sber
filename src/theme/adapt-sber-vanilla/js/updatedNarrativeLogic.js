define([
  "core/js/adapt"
], function(Adapt) {

  var UpdatedNarrative = Backbone.View.extend({

    events: {
      "click .js-narrative-controls-click": "updateCurrentItem"
    },

    initialize: function() {
      if (this.$el.hasClass("_hasDigitNavigation")) {
        this.updateCurrentItem();
      }
    },

    updateCurrentItem: function() {
      let currentItemIndex = this.$el.find(".narrative__content-item:not(.u-display-none)").data("index") + 1;
      let allElements = this.model.attributes.attributes._items.length;
      this.el.querySelector(".narrative__indicators").innerHTML = `<span class="narrative__current-element">${currentItemIndex} / ${allElements}</span>`;
    }
  });

  return UpdatedNarrative;

});

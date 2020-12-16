define([
  "./themeView",
  "core/js/adapt"
], function(ThemeView, Adapt) {

  var ThemeBlockView = ThemeView.extend({

    className: function() {
      return this.model.get("_isDividerBlock") ? "is-divider-block" : "";
    },

    setCustomStyles: function() {
      let el = this.$el;
      this.listenTo(Adapt, "blockView:postRender", function() {
        el.find("ol").each(function() {
          if (this.start)
            this.style.counterSet = "ol-counter " + (this.start-1);
        });
      })
    },

    onRemove: function() {}

  });

  return ThemeBlockView;

});

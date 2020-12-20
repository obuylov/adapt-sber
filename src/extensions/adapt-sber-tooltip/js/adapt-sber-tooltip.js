define([
  'coreJS/adapt'
], function(Adapt) {
  var SberTooltipView = Backbone.View.extend({
    _articleModels: [],

    initialize: function() {
      let current_components = [...this.model.findDescendantModels("component"), ...this.model.findDescendantModels("block")];
      this.component_models = current_components.filter(el => el.get("_sberTooltip") && el.get("_sberTooltip")._isEnabled);

      if (this.component_models.length === 0) return false;

      this.listenToOnce(Adapt, "pageView:postReady", this.onPageReady.bind(this));
    },

    onPageReady: function() {
      for (let component of this.component_models) {
        for (let tool of component.get("_sberTooltip")._items) {
          let el = $("." + component.get("_id"));

          let offsetTop = el.offset().top;

          let tip = document.createElement("div");
          tip.className = "sber-tooltip";
          tip.innerHTML = tool.text;
          tip.onclick = function() {
            $(this).removeClass("open");
          }
          $(tip).css("minWidth", tool.min_width);

          let selector = el.find('.' + tool._className);
          selector.addClass("sber-tooltip-container");
          selector.append(tip);

          setTimeout(function() {
            $(tip).css({
              top: -$(tip).height() - 20
            });
          }, 500)

          selector[0].onclick = function(e) {
            if ($(e.target).hasClass("sber-tooltip-container")) {
              let theTooltip = $(this).find(".sber-tooltip");
              let wasOpen = theTooltip.hasClass("open");

              $(".sber-tooltip").each(function () {
                $(this).removeClass("open")
              });

              if (!wasOpen)
                theTooltip.addClass("open");
              else
                theTooltip.removeClass("open");
            }
          }
        }
      }
    }
  });

  Adapt.on("pageView:postRender", function(view) {
    var model = view.model;
      new SberTooltipView({
        model: model,
        el: view.el
      });
  });

});

define([
  'coreJS/adapt'
], function(Adapt) {
  var SberFiguresView = Backbone.View.extend({
    _articleModels: [],

    initialize: function() {
      this._articleModels = this.model.findDescendantModels("article").filter(function (el) {return el.get("_sberFigures") && el.get("_sberFigures")._isEnabled});

      if (this._articleModels.length === 0) {
        return;
      }

      this.listenTo(Adapt, "pageView:ready", this.onPageReady);
    },

    onPageReady: function() {
      for (let article of this._articleModels) {
        let id = article.get("_id");
        let el = this.$("." + id);
        el.addClass("figures-container");

        for (let figure of article.get("_sberFigures")._items) {
          let figure_element = document.createElement("div");
          figure_element.className = "figure " + figure.type;
          $(figure_element).css({
            transform: `rotate(${figure.angle}deg)`,
            left: figure.x_pos + "%",
            top: figure.y_pos + "%",
            width: figure.size + "px",
            height: figure.size + "px"
          });

          el.append(figure_element);
        }
      }
    }
  });

  Adapt.on("pageView:postRender", function(view) {
    var model = view.model;
      new SberFiguresView({
        model: model,
        el: view.el
      });
  });

});

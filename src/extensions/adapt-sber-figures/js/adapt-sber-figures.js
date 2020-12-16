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
      console.log(this._articleModels)

      for (let i = 0; i < this._articleModels.length; i++) {
        let article = this._articleModels[i];

        let el = $("." + article.get("_id"));
        let figures = article.get("_sberFigures");

        el.addClass("figures-container");

        for (let figure of figures) {
          let f_el = document.createElement("div");
          f_el.className = "figure " + figure.type;

          $(f_el).css({
            width: figure.size,
            height: figure.size,
            left: figure.x_pos + "px",
            top: figure.y_pos + "px",
            transform: `rotateX(${figure.angle}deg)`
          });

          el.append(f_el);
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

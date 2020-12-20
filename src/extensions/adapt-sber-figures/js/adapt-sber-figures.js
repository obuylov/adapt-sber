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

      window.lastScrollingPosition = 0;
      window.onscroll = this.parallax;
    },

    parallax: function() {
      $('.figure').each(function () {
        if ($(this).offset().top + $(this).height() < pageYOffset || $(this).offset().top >= pageYOffset + innerHeight) {
          return;
        }

        let goingDown = pageYOffset > window.lastScrollingPosition;
        $(this).css('top', goingDown ? '-=1px' : '+=1px');
      });

      window.lastScrollingPosition = window.pageYOffset;
    },
  });

  Adapt.on("pageView:postRender", function(view) {
    var model = view.model;
      new SberFiguresView({
        model: model,
        el: view.el
      });
  });

});

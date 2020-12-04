define([
  'coreJS/adapt'
], function(Adapt) {
  var SberIconsView = Backbone.View.extend({
    _articleModels: [],

    initialize: function() {
      const current_components = this.model.findDescendantModels("component");
      this.component_models = current_components.filter(el => el.get("_sberIcon"));

      if (this.component_models.length === 0) return false;

      this.listenToOnce(Adapt, "pageView:postReady", this.onPageReady.bind(this));
    },

    onPageReady: function() {
      for (let component of this.component_models) {
        let id = component.get("_id");
        let el = this.$("." + id)[0];
        let config = component.get("_sberIcon");
        let body = el.querySelector(".component__body");

        body.classList.add("sber-icon-" + config.side);

        let img = this.createImage(config);
        body.prepend(img);
      }
    },

    createImage: function(config) {
      let margin = config.side === "top" ? "Bottom" : "Right";

      let img = document.createElement("img");
      img.src = config.src;
      img.alt = "icon";
      img.style["margin" + margin] = config.margin + "px";

      return img;
    }
  });

  Adapt.on("pageView:postRender", function(view) {
    var model = view.model;
      new SberIconsView({
        model: model,
        el: view.el
      });
  });

});

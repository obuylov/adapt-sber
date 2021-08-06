define([
  'coreJS/adapt'
], function (Adapt) {
  class SberIconsView extends Backbone.View {
    initialize(options) {
      this._articleModels = [];

      const current_components = this.model.findDescendantModels('component');
      this.component_models = current_components.filter(el => el.get('_sberIcon') && el.get('_sberIcon')._isEnabled);

      if (this.component_models.length === 0) return false;

      this.listenToOnce(Adapt, 'pageView:postReady', this.onPageReady.bind(this));
    }

    onPageReady() {
      for (let component of this.component_models) {
        let id = component.get('_id');
        let el = this.$('.' + id)[0];
        let config = component.get('_sberIcon');
        let element_to_append = component.get('_component') === 'text' ? 'body' : 'widget';
        let body = el.querySelector('.component__' + element_to_append);

        if (element_to_append === 'widget' && body == null) {
          body = el.querySelector('.component-widget');
        }

        if (config.classInside) {
          body = body.querySelector("." + config.classInside);
        }

        body.classList.add('sber-icon-' + config.side);
        body.style.alignItems = config.align;

        let img = this.createImage(config);

        if (config.classInside && config.side === "left") {
          body.style.display = "inline-flex";
        }
        body.prepend(img);
      }
    }

    createImage(config) {
      let margin = config.side === 'top' ? 'Bottom' : 'Right';

      let img = document.createElement('img');
      img.src = config.src;
      img.alt = 'icon';
      img.style['margin' + margin] = config.margin + 'px';

      return img;
    }
  }

  Adapt.on('pageView:postRender', function (view) {
    new SberIconsView({
      model: view.model,
      el: view.el
    });
  });
});

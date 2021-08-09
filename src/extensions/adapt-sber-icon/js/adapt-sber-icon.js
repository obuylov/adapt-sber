define([
  'coreJS/adapt'
], function (Adapt) {
  class SberIconsView extends Backbone.View {
    initialize(options) {
      console.clear()
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

        if (config.childElements && config.childElements.length) {
          for (let child of config.childElements) {
            let el = body.querySelector("." + child.childClass);

            if (!el) {
              Adapt.notify.popup({
                title: "Ошибка в Сбер-иконке",
                body: "Перепроверьте класс <b>" + child.childClass + "</b>! Его не получилось найти в данном компоненте",
                _classes: "show-title"
              });

              continue;
            }

            let imgSrc = child.src ? child.src : config.src;
            let img = this.createImage(config, imgSrc);

            this.appendToElement(el, img, config)
          }
        } else {
          let img = this.createImage(config, config.src);
          this.appendToElement(body, img, config);
        }
      }
    }

    appendToElement(el, image, config) {
      el.classList.add('sber-icon-' + config.side);
      el.style.alignItems = config.align;

      if (!el.className.match(/component/g) && config.side === "left") {
        el.style.display = "inline-flex";
      }

      el.prepend(image);
    }

    createImage(config, src) {
      let margin = config.side === 'top' ? 'Bottom' : 'Right';

      let img = document.createElement('img');
      img.src = src;
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

define([
  'coreJS/adapt'
], function (Adapt) {
  class SberCustomJS extends Backbone.View {
    initialize(options) {
      super.initialize(options);

      let div = document.createElement('div');
      div.className = 'sber-custom-js';

      let el = document.createElement('script');
      el.innerHTML = this.model._theCode;

      div.appendChild(el);
      document.body.appendChild(div);

      setTimeout(() => {
        $('.sber-custom-js').remove();
      }, 1000);
    }
  }

  Adapt.on('app:dataReady', function (view) {
    let customJS = Adapt.course.get('_sberCustomJS');

    if (customJS && customJS._isEnabled) {
      if (customJS._needGlobalAdapt) {
        window.Adapt = Adapt;
      }

      if (customJS._isInMenu) {
        Adapt.on('menuView:postRender', function () {
          new SberCustomJS({
            model: customJS,
            renderTo: 'menu'
          });
        });
      }

      if (customJS._isOnPage) {
        Adapt.on('pageView:postRender', function () {
          new SberCustomJS({
            model: customJS,
            renderTo: 'page'
          });
        });
      }
    }
  });
});

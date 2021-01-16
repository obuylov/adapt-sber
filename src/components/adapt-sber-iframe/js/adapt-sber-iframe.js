define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function (Adapt, ComponentView, ComponentModel) {

  class SberIframe extends ComponentView {
    events() {
      return {
        'click .sber-iframe__control': 'openPopup',
      };
    }

    postRender() {
      this.setReadyStatus();
    }

    openPopup() {
      this.setCompletionStatus();

      this.setupSize();
      let w = {
        attr: typeof (this.width) === 'string' ? 'style' : 'width',
        val: typeof (this.width) === 'string' ? 'width: ' + this.width : this.width
      };

      Adapt.notify.popup({
        body: `<iframe src="${this.model.get('_src')}" height="${this.height}" ${w.attr}="${w.val}"></iframe>`,
        _classes: 'sber-iframe-popup'
      });
    }

    setupSize() {
      let data = {};
      this.width = 0;
      this.height = 0;

      if (innerWidth <= 500) { // mobile
        data = this.checkData(this.model.get('_mobile'), innerHeight - 60);
      } else if (innerWidth > 500 && innerWidth <= 900) { // tablet
        data = this.checkData(this.model.get('_tablet'), innerHeight - 60);
      } else { // pc
        data = this.checkData(this.model.get('_pc'), 800);
      }

      this.width = data.width;
      this.height = data.height;
    }

    checkData(data, heightValue) {
      return {
        width: data.width && data.width > 0 ? data.width : '100%',
        height: data.height && data.height > 0 ? data.height : heightValue
      };
    }
  }

  SberIframe.template = 'sber-iframe';

  return Adapt.register('sber-iframe', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: SberIframe
  });
});

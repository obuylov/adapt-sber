define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function (Adapt, ComponentView, ComponentModel) {

  class SberHTML extends ComponentView {
    events() {
      return {
        'click .sber-iframe__control': 'openPopup',
      };
    }

    postRender() {
      this.setReadyStatus();
      this.setCompletionStatus();
    }
  }

  SberHTML.template = 'sber-html';

  return Adapt.register('sber-html', {
    model: ComponentModel.extend({}),
    view: SberHTML
  });
});

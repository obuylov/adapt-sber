define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

  class BlankView extends ComponentView {

    preRender() {
      this.checkIfResetOnRevisit();
    }

    postRender() {
      this.setReadyStatus();
      this.setupInviewCompletion();
    }

    checkIfResetOnRevisit() {
      const isResetOnRevisit = this.model.get('_isResetOnRevisit');

      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    }
  }

  BlankView.template = 'blank';

  return Adapt.register('blank', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: BlankView
  });

});

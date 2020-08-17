define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

  class TextView extends ComponentView {

    preRender() {
      this.checkIfResetOnRevisit();
    }

    postRender() {
      this.setReadyStatus();

      this.setupInview();
    }

    setupInview() {
      const selector = this.getInviewElementSelector();
      if (!selector) {
        this.setCompletionStatus();
        return;
      }

      this.setupInviewCompletion(selector);
    }

    /**
     * determines which element should be used for inview logic - body, instruction or title - and returns the selector for that element
     */
    getInviewElementSelector() {
      if (this.model.get('body')) return '.component__body';

      if (this.model.get('instruction')) return '.component__instruction';

      if (this.model.get('displayTitle')) return '.component__title';

      return null;
    }

    checkIfResetOnRevisit() {
      const isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    }
  }

  TextView.template = 'text';

  return Adapt.register('text', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: TextView
  });
});

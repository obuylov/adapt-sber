define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel',
], function(Adapt, ComponentView, ComponentModel) {

  class AdaptH5PView extends ComponentView {
    postRender() {
      this.setReadyStatus();
      this.setupInviewCompletion('.component__inner');
    }
  }

  AdaptH5PView.template = 'adapt-h5p';

  return Adapt.register('adapt-h5p', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: AdaptH5PView
  });
});

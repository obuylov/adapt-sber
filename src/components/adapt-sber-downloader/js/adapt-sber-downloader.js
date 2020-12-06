define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

  class SberDownloaderView extends ComponentView {
    postRender() {
      this.setReadyStatus();
      this.setupInviewCompletion('.component__inner');
    }
  }

  SberDownloaderView.template = 'sber-downloader';

  return Adapt.register('sber-downloader', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: SberDownloaderView
  });
});

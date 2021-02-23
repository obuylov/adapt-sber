define([
  'coreJS/adapt'
], function (Adapt) {
  class SberAnchorDownload extends Backbone.View {
    initialize(options) {
      super.initialize(options);

      this._componentModels = this.model.findDescendantModels('component').filter(function (el) {
        return el.get('_sberAnchorDownload') && el.get('_sberAnchorDownload')._isEnabled;
      });

      if (this._componentModels.length === 0) {
        return;
      }

      setTimeout(() => {
        this.makeAnchors();
      }, 500);
    }

    makeAnchors() {
      for (let model of this._componentModels) {
        for (let el of model.get('_sberAnchorDownload')._items) {
          this.$('.' + el.linkClass).attr({
            'href': el.leadsTo,
            'target': '_blank'
          });

          if (el.download) {
            $('.' + el.linkClass).attr('download', el.fileName);
          }
        }
      }
    }
  }

  Adapt.on('pageView:postRender', function (view) {
    new SberAnchorDownload({
      model: view.model,
      el: view.el
    });
  });
});

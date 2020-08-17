define([
  'core/js/adapt',
  'core/js/views/componentView',
  './hotgraphicPopupView'
], function(Adapt, ComponentView, HotgraphicPopupView) {

  class HotGraphicView extends ComponentView {

    events () {
      return {
        'click .js-hotgraphic-item-click': 'onPinClicked'
      }
    }

    initialize(...args) {
      super.initialize(...args);

      this.setUpViewData();
      this.setUpModelData();
      this.setUpEventListeners();
      this.checkIfResetOnRevisit();
    }

    setUpViewData() {
      this.popupView = null;
      this._isPopupOpen = false;
    }

    setUpModelData() {
      if (this.model.get('_canCycleThroughPagination') === undefined) {
        this.model.set('_canCycleThroughPagination', false);
      }
    }

    setUpEventListeners() {
      this.listenTo(Adapt, 'device:changed', this.reRender);

      this.listenTo(this.model.get('_children'), {
        'change:_isActive': this.onItemsActiveChange,
        'change:_isVisited': this.onItemsVisitedChange
      });
    }

    reRender() {
      if (Adapt.device.screenSize === 'large') return;

      this.replaceWithNarrative();
    }

    replaceWithNarrative() {
      const NarrativeView = Adapt.getViewClass('narrative');
      if (!NarrativeView) return;

      const model = this.prepareNarrativeModel();
      const newNarrative = new NarrativeView({ model });

      this.$el.parents('.component__container').append(newNarrative.$el);
      this.remove();
      _.defer(() => {
        Adapt.trigger('device:resize');
      });
    }

    prepareNarrativeModel() {
      this.model.set({
        _component: 'narrative',
        _wasHotgraphic: true,
        originalBody: this.model.get('body'),
        originalInstruction: this.model.get('instruction')
      });

      // Check if active item exists, default to 0
      const activeItem = this.model.getActiveItem();
      if (!activeItem) {
        this.model.getItem(0).toggleActive(true);
      }

      // Swap mobile body and instructions for desktop variants.
      if (this.model.get('mobileBody')) {
        this.model.set('body', this.model.get('mobileBody'));
      }
      if (this.model.get('mobileInstruction')) {
        this.model.set('instruction', this.model.get('mobileInstruction'));
      }

      return this.model;
    }

    onItemsActiveChange(model, _isActive) {
      this.getItemElement(model).toggleClass('is-active', _isActive);
    }

    getItemElement(model) {
      const index = model.get('_index');
      return this.$('.js-hotgraphic-item-click').filter(`[data-index="${index}"]`);
    }

    onItemsVisitedChange(model, _isVisited) {
      if (!_isVisited) return;

      const $pin = this.getItemElement(model);
      // Append the word 'visited.' to the pin's aria-label
      const visitedLabel = ` ${this.model.get('_globals')._accessibility._ariaLabels.visited}.`;
      $pin.find('.aria-label').each(function(index, el) {
        el.innerHTML += visitedLabel;
      });

      $pin.addClass('is-visited');
    }

    checkIfResetOnRevisit() {
      const isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    }

    preRender() {
      if (Adapt.device.screenSize === 'large') {
        this.render();
        return;
      }

      this.reRender();
    }

    postRender() {
      this.$('.hotgraphic__widget').imageready(this.setReadyStatus.bind(this));
      if (this.model.get('_setCompletionOn') === 'inview') {
        this.setupInviewCompletion('.component__widget');
      }
    }

    onPinClicked (event) {
      const item = this.model.getItem($(event.currentTarget).data('index'));
      item.toggleActive(true);
      item.toggleVisited(true);

      this.openPopup();
    }

    openPopup() {
      if (this._isPopupOpen) return;

      this._isPopupOpen = true;

      this.popupView = new HotgraphicPopupView({
        model: this.model
      });

      Adapt.notify.popup({
        _view: this.popupView,
        _isCancellable: true,
        _showCloseButton: false,
        _classes: 'hotgraphic ' + this.model.get('_classes')
      });

      this.listenToOnce(Adapt, {
        'popup:closed': this.onPopupClosed
      });
    }

    onPopupClosed() {
      this.model.getActiveItem().toggleActive();
      this._isPopupOpen = false;
    }

  }

  HotGraphicView.template = 'hotgraphic';

  return HotGraphicView;

});

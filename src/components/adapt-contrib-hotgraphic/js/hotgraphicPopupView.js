define([
  'core/js/adapt'
], function(Adapt) {

  class HotgraphicPopupView extends Backbone.View {

    className() {
      return 'hotgraphic-popup';
    }

    events() {
      return {
        'click .js-hotgraphic-popup-close': 'closePopup',
        'click .js-hotgraphic-controls-click': 'onControlClick'
      }
    }

    initialize(...args) {
      super.initialize(...args);
      // Debounce required as a second (bad) click event is dispatched on iOS causing a jump of two items.
      this.onControlClick = _.debounce(this.onControlClick.bind(this), 100);
      this.listenToOnce(Adapt, 'notify:opened', this.onOpened);
      this.listenTo(this.model.get('_children'), {
        'change:_isActive': this.onItemsActiveChange,
        'change:_isVisited': this.onItemsVisitedChange
      });
      this.render();
    }

    onOpened() {
      this.applyNavigationClasses(this.model.getActiveItem().get('_index'));
      this.updatePageCount();
      this.handleTabs();
    }

    applyNavigationClasses (index) {
      const itemCount = this.model.get('_items').length;
      const canCycleThroughPagination = this.model.get('_canCycleThroughPagination');

      const shouldEnableBack = index > 0 || canCycleThroughPagination;
      const shouldEnableNext = index < itemCount - 1 || canCycleThroughPagination;
      const $controls = this.$('.hotgraphic-popup__controls');

      this.$('hotgraphic-popup__nav')
          .toggleClass('first', !shouldEnableBack)
          .toggleClass('last', !shouldEnableNext);

      Adapt.a11y.toggleAccessibleEnabled($controls.filter('.back'), shouldEnableBack);
      Adapt.a11y.toggleAccessibleEnabled($controls.filter('.next'), shouldEnableNext);
    }

    updatePageCount() {
      const template = Adapt.course.get('_globals')._components._hotgraphic.popupPagination || '{{itemNumber}} / {{totalItems}}';
      const labelText = Handlebars.compile(template)({
        itemNumber: this.model.getActiveItem().get('_index') + 1,
        totalItems: this.model.get('_items').length
      });
      this.$('.hotgraphic-popup__count').html(labelText);
    }

    handleTabs() {
      Adapt.a11y.toggleHidden(this.$('.hotgraphic-popup__item:not(.is-active) *'), true);
      Adapt.a11y.toggleHidden(this.$('.hotgraphic-popup__item.is-active *'), false);
    }

    onItemsActiveChange(item, _isActive) {
      if (!_isActive) return;
      const index = item.get('_index');
      this.updatePageCount();
      this.applyItemClasses(index);
      this.handleTabs();
      this.handleFocus(index);
    }

    applyItemClasses(index) {
      this.$(`.hotgraphic-popup__item[data-index="${index}"]`).addClass('is-active').removeAttr('aria-hidden');
      this.$(`.hotgraphic-popup__item[data-index="${index}"] .hotgraphic-popup__item-title`).attr('id', 'notify-heading');
      this.$(`.hotgraphic-popup__item:not([data-index="${index}"])`).removeClass('is-active').attr('aria-hidden', 'true');
      this.$(`.hotgraphic-popup__item:not([data-index="${index}"]) .hotgraphic-popup__item-title`).removeAttr('id');
    }

    handleFocus(index) {
      Adapt.a11y.focusFirst(this.$('.hotgraphic-popup__inner .is-active'));
      this.applyNavigationClasses(index);
    }

    onItemsVisitedChange(item, _isVisited) {
      if (!_isVisited) return;

      this.$('.hotgraphic-popup__item')
          .filter(`[data-index="${item.get('_index')}"]`)
          .addClass('is-visited');
    }

    render() {
      const data = this.model.toJSON();
      data.view = this;
      const template = Handlebars.templates[this.constructor.template];
      this.$el.html(template(data));
    }

    closePopup() {
      Adapt.trigger('notify:close');
    }

    onControlClick(event) {
      const direction = $(event.currentTarget).data('direction');
      const index = this.getNextIndex(direction);
      if (index === -1) return;

      this.setItemState(index);
    }

    getNextIndex(direction) {
      let index = this.model.getActiveItem().get('_index');
      const lastIndex = this.model.get('_items').length - 1;

      switch (direction) {
        case 'back':
          if (index > 0) return --index;
          if (this.model.get('_canCycleThroughPagination')) return lastIndex;
          break;
        case 'next':
          if (index < lastIndex) return ++index;
          if (this.model.get('_canCycleThroughPagination')) return 0;
      }
      return -1;
    }

    setItemState(index) {
      this.model.getActiveItem().toggleActive();

      const nextItem = this.model.getItem(index);
      nextItem.toggleActive();
      nextItem.toggleVisited(true);
    }

  };

  HotgraphicPopupView.template = 'hotgraphicPopup';

  return HotgraphicPopupView;

});

define([
  'core/js/views/componentView'
], function(ComponentView) {

  class AccordionView extends ComponentView {

    events() {
      return {
        'click .js-toggle-item': 'onClick'
      };
    }

    preRender() {
      this.checkIfResetOnRevisit();

      this.model.resetActiveItems();

      this.listenTo(this.model.get('_children'), {
        'change:_isActive': this.onItemsActiveChange,
        'change:_isVisited': this.onItemsVisitedChange
      });
    }

    postRender() {
      this.setReadyStatus();

      if (this.model.get('_setCompletionOn') === 'inview') {
        this.setupInviewCompletion();
      }
    }

    checkIfResetOnRevisit() {
      const isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    }

    onClick(event) {
      this.model.toggleItemsState($(event.currentTarget).parent().data('index'));
    }

    onItemsActiveChange(item, isActive) {
      this.toggleItem(item, isActive);
    }

    onItemsVisitedChange(item, isVisited) {
      if (!isVisited) return;

      const $item = this.getItemElement(item);

      $item.children('.accordion__item-btn').addClass('is-visited');
    }

    toggleItem(item, shouldExpand) {
      const $item = this.getItemElement(item);
      const $body = $item.children('.accordion__item-content').stop(true, true);

      $item.children('.accordion__item-btn')
        .toggleClass('is-selected is-open', shouldExpand)
        .toggleClass('is-closed', !shouldExpand)
        .attr('aria-expanded', shouldExpand);

      if (!shouldExpand) {
        $body.slideUp(this.model.get('_toggleSpeed'));
        return;
      }

      $body.slideDown(this.model.get('_toggleSpeed'));
    }

    getItemElement(item) {
      const index = item.get('_index');

      return this.$('.accordion__item').filter(`[data-index="${index}"]`);
    }

  }

  AccordionView.template = 'accordion';

  return AccordionView;

});

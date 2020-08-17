define([
  'core/js/models/itemsComponentModel'
], function(ItemsComponentModel) {

  class AccordionModel extends ItemsComponentModel {

    defaults() {
      return ItemsComponentModel.resultExtend('defaults', {
        _shouldCollapseItems: true,
        _toggleSpeed: 200
      }, this);
    }

    toggleItemsState(index) {
      const item = this.getItem(index);
      const previousActiveItem = this.getActiveItem();

      item.toggleActive();
      item.toggleVisited(true);

      if (previousActiveItem && this.get('_shouldCollapseItems')) {
        previousActiveItem.toggleActive(false);
      }
    }

  }

  return AccordionModel;

});

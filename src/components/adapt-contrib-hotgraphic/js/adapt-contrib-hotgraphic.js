define([
  'core/js/adapt',
  './hotgraphicView',
  'core/js/models/itemsComponentModel'
], function(Adapt, HotgraphicView, ItemsComponentModel) {

  return Adapt.register('hotgraphic', {
    model: ItemsComponentModel.extend({}),
    view: HotgraphicView
  });

});

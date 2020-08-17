define([
  'core/js/adapt',
  './accordionModel',
  './accordionView'
], function(Adapt, AccordionModel, AccordionView) {

  return Adapt.register('accordion', {
    model: AccordionModel,
    view: AccordionView
  });

});

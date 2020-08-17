define([
  'core/js/adapt',
  './sliderView',
  './sliderModel',
  'libraries/rangeslider'
], function(Adapt, SliderView, SliderModel) {

  return Adapt.register("slider", {
    view: SliderView,
    model: SliderModel
  });

});

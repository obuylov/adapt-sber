define([
  'core/js/adapt',
  './textInputView',
  './textInputModel',
], function(Adapt, TextInputView, TextInputModel) {

  return Adapt.register('textinput', {
    view: TextInputView,
    model: TextInputModel
  });

});

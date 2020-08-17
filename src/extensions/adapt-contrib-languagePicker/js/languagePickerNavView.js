define([
  'core/js/adapt',
  './languagePickerDrawerView'
], function(Adapt, LanguagePickerDrawerView) {

  var LanguagePickerNavView = Backbone.View.extend({

    tagName: 'button',

    className: function () {
      var classNames = 'btn-icon nav__btn nav__languagepicker-btn js-languagepicker-nav-btn icon';
      var customClass = this.model.get('_languagePickerIconClass') || 'icon-language-2';

      return classNames + ' ' + customClass;
    },

    events: {
      'click': 'onClick'
    },

    initialize: function () {
      this.listenTo(Adapt, 'remove', this.remove);
    },

    onClick: function (event) {
      Adapt.drawer.triggerCustomView(new LanguagePickerDrawerView({model: this.model}).$el, false);
    }

  });

  return LanguagePickerNavView;

});

define([
  'core/js/adapt'
], function(Adapt) {

  var LanguagePickerDrawerView = Backbone.View.extend({

    events: {
      'click .js-languagepicker-item-btn': 'onButtonClick'
    },

    initialize: function () {
      this.listenTo(Adapt, {
        remove: this.remove,
        'languagepicker:changelanguage:yes': this.onDoChangeLanguage,
        'languagepicker:changelanguage:no': this.onDontChangeLanguage
      });
      this.render();
    },

    render: function () {
      var data = this.model.toJSON();
      var template = Handlebars.templates[this.constructor.template];
      this.$el.html(template(data));
    },

    onButtonClick: function (event) {
      var newLanguage = $(event.currentTarget).attr('data-language');
      this.model.set('newLanguage', newLanguage);
      var data = this.model.getLanguageDetails(newLanguage);

      var promptObject = {
        _attributes: { lang: newLanguage },
        _classes: `is-lang-${newLanguage} ${data._direction === 'rtl' ? 'is-rtl' : 'is-ltr'}`,
        title: data.warningTitle,
        body: data.warningMessage,
        _prompts:[
          {
            promptText: data._buttons.yes,
            _callbackEvent: 'languagepicker:changelanguage:yes'
          },
          {
            promptText: data._buttons.no,
            _callbackEvent: 'languagepicker:changelanguage:no'
          }
        ],
        _showIcon: true
      };

      //keep active element incase the user cancels - usually navigation bar icon
      //move drawer close focus to #focuser
      if ($.a11y) {
        // old a11y API (Framework v4.3.0 and earlier)
        this.$finishFocus = $.a11y.state.focusStack.pop();
        $.a11y.state.focusStack.push($('#focuser'));
      } else {
        this.$finishFocus = Adapt.a11y._popup._focusStack.pop();
        Adapt.a11y._popup._focusStack.push($('#a11y-focuser'));
      }

      Adapt.once('drawer:closed', function() {
        //wait for drawer to fully close
        _.delay(function(){
          //show yes/no popup
          Adapt.once('popup:opened', function() {
            //move popup close focus to #focuser
            if ($.a11y) {
              // old a11y API (Framework v4.3.0 and earlier)
              $.a11y.state.focusStack.pop();
              $.a11y.state.focusStack.push($('#focuser'));
              return;
            }
            Adapt.a11y._popup._focusStack.pop();
            Adapt.a11y._popup._focusStack.push($('#a11y-focuser'));
          });

          Adapt.trigger('notify:prompt', promptObject);
        }, 250);
      });

      Adapt.trigger('drawer:closeDrawer');
    },

    onDoChangeLanguage: function () {
      // set default language
      var newLanguage = this.model.get('newLanguage');
      this.model.setTrackedData();
      this.model.setLanguage(newLanguage);
      this.remove();
    },

    onDontChangeLanguage: function () {
      this.remove();

      // wait for notify to close fully
      _.delay(function(){
        // focus on navigation bar icon
        this.$finishFocus.a11y_focus();
      }.bind(this), 500);

    }

  }, {
    template: 'languagePickerDrawerView'
  });

  return LanguagePickerDrawerView;

});

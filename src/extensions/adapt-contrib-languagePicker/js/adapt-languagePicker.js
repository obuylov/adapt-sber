define([
  'core/js/adapt',
  './languagePickerView',
  './languagePickerNavView',
  './languagePickerModel'
], function(Adapt, LanguagePickerView, LanguagePickerNavView, LanguagePickerModel) {

  var languagePickerModel;

  Adapt.once('configModel:dataLoaded', onConfigLoaded);

  /**
   * Once the Adapt config has loaded, check to see if the language picker is enabled. If it is:
   * - stop the rest of the .json from loading
   * - set up the language picker model
   * - register for events to allow us to display the language picker icon in the navbar on pages and menus
   * - wait for offline storage to be ready so that we can check to see if there's a stored language choice or not
   */
  function onConfigLoaded() {
    if (!Adapt.config.has('_languagePicker')) return;
    if (!Adapt.config.get('_languagePicker')._isEnabled) return;

    Adapt.config.set('_canLoadData', false);

    languagePickerModel = new LanguagePickerModel(Adapt.config.get('_languagePicker'));

    Adapt.on('router:menu router:page', setupNavigationView);

    if (Adapt.offlineStorage.ready) {// on the offchance that it may already be ready...
      onOfflineStorageReady();
    } else {
      Adapt.once('offlineStorage:ready', onOfflineStorageReady);
    }
  }

  /**
   * Once offline storage is ready, check to see if a language was previously selected by the user
   * If it was, load it. If it wasn't, show the language picker
   */
  function onOfflineStorageReady() {
    var storedLanguage = Adapt.offlineStorage.get('lang');

    if (storedLanguage) {
      languagePickerModel.setLanguage(storedLanguage);
    } else if (languagePickerModel.get('_showOnCourseLoad') === false) {
      languagePickerModel.setLanguage(Adapt.config.get('_defaultLanguage'));
    } else {
      showLanguagePickerView();
    }
  }

  function showLanguagePickerView () {
    var languagePickerView = new LanguagePickerView({
      model: languagePickerModel
    });

    languagePickerView.$el.appendTo('#wrapper');
  }

  function setupNavigationView () {
    /*
     * On the framework this isn't an issue, but courses built in the authoring tool before the ARIA label
     * was added will break unless the extension is removed then added again.
     */
    var courseGlobals = Adapt.course.get('_globals')._extensions;
    var navigationBarLabel = '';
    if (courseGlobals._languagePicker) {
      navigationBarLabel = courseGlobals._languagePicker.navigationBarLabel;
    }

    var languagePickerNavView = new LanguagePickerNavView({
      model: languagePickerModel,
      attributes:  {
        'aria-label': navigationBarLabel
      }
    });

    languagePickerNavView.$el.appendTo('.nav__inner');
  }

});

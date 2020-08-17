define([
  'core/js/adapt'
], function(Adapt) {

  var PageIncompletePrompt = Backbone.Controller.extend({

    PLUGIN_NAME: '_pageIncompletePrompt',

    handleRoute: true,
    inPage: false,
    inPopup: false,
    isChangingLanguage: false,
    pageModel: null,
    model: null,

    _ignoreAccessibilityNavigation: false,

    initialize: function() {
      this.setupEventListeners();
    },

    setupEventListeners: function() {
      this.listenTo(Adapt, {
        'app:languageChanged': this.onLanguageChanging,
        'pageView:ready': this.onPageViewReady,
        'pageIncompletePrompt:leavePage': this.onLeavePage,
        'pageIncompletePrompt:cancel': this.onLeaveCancel,
        'router:navigate': this.onRouterNavigate
      });

      this.listenToOnce(Adapt, 'app:dataLoaded', function() {
        this.setupModel();
        this.listenTo(Adapt, 'accessibility:toggle', this.onAccessibilityToggle);
      });
    },

    /**
     * suppresses the prompt if the user changes language whilst in a page, then re-enables
     * it once the language has been changed and we've navigated back to a page
     */
    onLanguageChanging: function() {
      this.isChangingLanguage = true;

      this.setupModel();

      Adapt.once('router:page', function() {
        this.isChangingLanguage = false;
      }.bind(this));
    },

    setupModel: function() {
      this.model = Adapt.course.get(this.PLUGIN_NAME);
    },

    onPageViewReady: function() {
      this.inPage = true;
      this.pageModel = Adapt.findById(Adapt.location._currentId);
    },

    onLeavePage: function() {
      if (!this.inPopup) return;
      this.inPopup = false;

      this.stopListening(Adapt, 'notify:cancelled');
      this.enableRouterNavigation(true);
      this.handleRoute = false;
      this.inPage = false;

      window.location.href = this.href;

      this.handleRoute = true;
    },

    onLeaveCancel: function() {
      if (!this.inPopup) return;
      this.inPopup = false;

      this.stopListening(Adapt, 'notify:cancelled');
      this.enableRouterNavigation(true);
      this.handleRoute = true;
    },

    onRouterNavigate: function(routeArguments) {
      if (!this.isEnabled() || this.pageModel.get('_isComplete')) return;

      this.href = window.location.href;

      var id = routeArguments[0];
      if (id) {
        // exit if on same page (e.g. if doing 'retry assessment')
        if (id === Adapt.location._currentId) return;
        // check if routing to current page child
        var model = Adapt.findById(id);
        var parent = model && model.findAncestor('contentObjects');
        if (parent && (parent.get('_id') === this.pageModel.get('_id'))) {
          return;
        }
      }

      if (this._ignoreAccessibilityNavigation) {
        this._ignoreAccessibilityNavigation = false;
        return;
      }

      this.enableRouterNavigation(false);

      this.showPrompt();
    },

    onAccessibilityToggle: function() {
      if (Adapt.device.touch) {
        //accessibility is always on for touch devices
        //ignore toggle
        this._ignoreAccessibilityNavigation = false;
        return;
      }
      // skip renavigate for accessibility on desktop
      this._ignoreAccessibilityNavigation = true;
    },

    showPrompt: function() {
      var classes = 'is-pageincomplete ';
      classes += (this.model._classes || '');
      // standard prompt settings (from course.json)
      var promptObject = {
        title: this.model.title,
        body: this.model.message,
        _classes: classes,
        _prompts: [{
          promptText: this.model._buttons.yes,
          _callbackEvent: 'pageIncompletePrompt:leavePage',
        }, {
          promptText: this.model._buttons.no,
          _callbackEvent: 'pageIncompletePrompt:cancel'
        }],
        _showIcon: true
      };

      // override with page-specific settings?
      var pipConfig = this.pageModel.get('_pageIncompletePrompt');
      if (pipConfig && pipConfig._buttons) {
        promptObject.title = pipConfig.title;
        promptObject.body = pipConfig.message;
        promptObject._classes = pipConfig._classes;
        promptObject._prompts[0].promptText = pipConfig._buttons.yes;
        promptObject._prompts[1].promptText = pipConfig._buttons.no;
      }

      this.listenToOnce(Adapt, 'notify:cancelled', this.onLeaveCancel);
      Adapt.trigger('notify:prompt', promptObject);
      this.inPopup = true;
    },

    isEnabled: function() {
      if (!Adapt.location._currentId) return false;
      if (!this.handleRoute) return false;
      if (!this.inPage) return false;
      if (this.inPopup) return false;
      if (this.isChangingLanguage) return false;

      switch (Adapt.location._contentType) {
        case 'menu': case 'course':
          this.inPage = false;
          return false;
      }

      var pageModel = Adapt.findById(Adapt.location._currentId);
      if (pageModel.get('_isOptional')) return false;

      var isEnabledForCourse = this.model && !!this.model._isEnabled;
      var isEnabledForPage = pageModel.get('_pageIncompletePrompt') && !!pageModel.get('_pageIncompletePrompt')._isEnabled;
      return (isEnabledForCourse && isEnabledForPage !== false) || isEnabledForPage;
    },

    enableRouterNavigation: function(value) {
      Adapt.router.set('_canNavigate', value, { pluginName: this.PLUGIN_NAME });
    }

  });

  return new PageIncompletePrompt();

});

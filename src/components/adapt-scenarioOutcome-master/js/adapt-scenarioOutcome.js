define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function (Adapt, ComponentView, ComponentModel) {

  var ScenarioOutcomeView = ComponentView.extend({

    events: {
      'click .js-scenarioOutcome-btn': 'onButtonClick'
    },

    preRender: function () {
      this.checkIfResetOnRevisit();
    },

    postRender: function () {
      this.setReadyStatus();
      this.setupInview();
    },

    hideBlocks: function (page, currentBlockNthChild) {
      _.each(page.findDescendantModels('blocks'), function (block) {
        block.set('_isLocked', false);
        if (block.get('_nthChild') > currentBlockNthChild) {
          block.set('_isHidden', true);
          block.set('_isAvailable', false);
        }
      });
      Adapt.trigger('pageLevelProgress:update');
    },

    onButtonClick: function (event) {

      var $target = $(event.currentTarget);
      var interaction = $target.attr('data-type');
      var index = $target.attr('data-item-index');

      switch (interaction) {
        case '_restart':
          this.restartPage();
          break;
        case '_menu':
          this.goMenu();
          break;
        default:
          break;
      }
    },

    restartPage: function () {
      this.model.findAncestor('articles')._resetArticle();
      Backbone.history.navigate(location.hash, {
        trigger: true,
        replace: false
      });
    },

    goMenu: function () {
      var parents = this.model.getAncestorModels();
      for (var i = 0, l = parents.length; i < l; i++) {

        var model = parents[i];
        switch (model.get('_type')) {
          case 'menu':
            var id = model.get('_id');
            var isCourse = (id === Adapt.course.get('_id'));
            var hash = '#' + (isCourse ? '/' : '/id/' + id);
            Backbone.history.navigate(hash, {
              trigger: true,
              replace: false
            });
          case 'course':
            var id = model.get('_id');
            var isCourse = (id === Adapt.course.get('_id'));
            var hash = '#' + (isCourse ? '/' : '/id/' + id);
            Backbone.history.navigate(hash, {
              trigger: true,
              replace: false
            });
        }

      }
    },

    setupInview: function () {
      var selector = this.getInviewElementSelector();
      if (!selector) {
        this.setCompletionStatus();
        return;
      }

      this.setupInviewCompletion(selector);
    },

    /**
     * determines which element should be used for inview logic - body, instruction or title - and returns the selector for that element
     */
    getInviewElementSelector: function () {
      if (this.model.get('body')) return '.component__body';

      if (this.model.get('instruction')) return '.component__instruction';

      if (this.model.get('displayTitle')) return '.component__title';

      return null;
    },

    checkIfResetOnRevisit: function () {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    }
  }, {
    template: 'scenarioOutcome'
  });

  return Adapt.register('scenarioOutcome', {
    model: ComponentModel.extend({}), // create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: ScenarioOutcomeView
  });
});

define([
  'core/js/adapt',
  './themePageView',
  './themeArticleView',
  './themeBlockView',
  './themeView',
  './updatedNarrativeLogic',
], function (Adapt, ThemePageView, ThemeArticleView, ThemeBlockView, ThemeView, UpdatedNarrative) {

  function onDataReady() {
    $('html').addClass(Adapt.course.get('_courseStyle'));
  }

  function onPostRender(view) {
    var model = view.model;
    var theme = model.get('_sber-vanilla');

    // if (!theme) return;

    switch (model.get('_type')) {
      case 'page':
        new ThemePageView({ model: new Backbone.Model(theme), el: view.$el });
        break;
      case 'article':
        new ThemeArticleView({ model: new Backbone.Model(theme), el: view.$el });
        break;
      case 'block':
        new ThemeBlockView({ model: new Backbone.Model(theme), el: view.$el });
        break;
      default:
        new ThemeView({ model: new Backbone.Model(theme), el: view.$el });
    }
  }

  function onComponentRendered(view) {
    if (view.model.get('_component') === 'narrative') {
      new UpdatedNarrative({ model: new Backbone.Model(view.model), el: view.$el });
    }

    if (!view.model.isListeningToResult && view.model.get('_component') === 'assessmentResults') {
      view.model.isListeningToResult = true;
      Adapt.listenTo(view.model, 'change:_isVisible', function () {
        view.model.findAncestor('article').set('_isVisible', view.model.get('_isVisible'));
      });
    }
  }

  Adapt.on({
    'app:dataReady': onDataReady,
    'pageView:postRender articleView:postRender blockView:postRender': onPostRender,
    'componentView:postRender': onComponentRendered
  });
});

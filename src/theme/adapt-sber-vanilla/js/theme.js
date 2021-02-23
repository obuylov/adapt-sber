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

    if (view.model.get('_component') === 'assessmentResults') {
      let id = view.model.findAncestor('article').get('_id');

      function updateVisibility() {
        if (view.model.get('_isVisible')) {
          $('.' + id).removeClass('dn');

          let figures = Adapt.findById(id).get('_sberFigures');
          if (figures._isEnabled) {
            for (let i in figures._items) {
              let el = figures._items[i];

              $(`.${id} svg`).eq(i).css('top', el.y_pos + '%');
            }
          }
        } else {
          $('.' + id).addClass('dn');
        }
      }

      updateVisibility();

      let currentClassName = Adapt.offlineStorage.get('currentClassName');
      if (currentClassName) {
        $('.' + id).addClass(currentClassName);
      }

      Adapt.listenTo(view.model, 'change:_isVisible', () => {
        updateVisibility();
        let theClassName = $('.' + id).attr('class').split(' ')[3];
        Adapt.offlineStorage.set('currentClassName', theClassName);
      });
      Adapt.listenTo(Adapt, 'pageView:postRender', updateVisibility);
    }
  }

  Adapt.on({
    'app:dataReady': onDataReady,
    'pageView:postRender articleView:postRender blockView:postRender': onPostRender,
    'componentView:postRender': onComponentRendered
  });
});

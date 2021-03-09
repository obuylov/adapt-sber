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
      let v_id = view.model.get('_id');

      function updateVisibility(id) {
        let art = $('.' + id).parents('.article');

        if (Adapt.findById(id).get('_isVisible')) {
          art.removeClass('dn');

          let figures = Adapt.findById(id).findAncestor('article').get('_sberFigures');
          if (figures._isEnabled) {
            for (let i in figures._items) {
              let el = figures._items[i];

              art.find('svg').eq(i).css('top', el.y_pos + '%');
            }
          }
        } else {
          art.addClass('dn');
        }
      }

      updateVisibility(v_id);

      let theObject = Adapt.offlineStorage.get('currentClassName');
      theObject = theObject ? theObject : {};

      let currentClassName = theObject[id];
      if (currentClassName) {
        $('.' + id).addClass(currentClassName);
      }

      Adapt.listenTo(view.model, 'change:_isVisible', function () {
        updateVisibility(v_id);

        let matchedClass = $('.article.' + id).attr('class').match(/quiz-(in)?correct/g);
        if (matchedClass && matchedClass.length > 1) {
          matchedClass.shift();
        }

        theObject[id] = matchedClass ? matchedClass[0] : '';
        Adapt.offlineStorage.set('currentClassName', theObject);
      });
      Adapt.listenTo(Adapt, 'pageView:postRender', () => {
        updateVisibility(v_id);
      });
    }

    if (view.model.get('_component') === 'textinput') {
      $('.' + view.model.get('_id') + ' input').attr('autocomplete', 'off');
    }
  }

  Adapt.on({
    'app:dataReady': onDataReady,
    'pageView:postRender articleView:postRender blockView:postRender': onPostRender,
    'componentView:postRender': onComponentRendered
  });
});

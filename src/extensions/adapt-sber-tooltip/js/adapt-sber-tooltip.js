define([
  'coreJS/adapt'
], function (Adapt) {
  var SberTooltipView = Backbone.View.extend({
    _articleModels: [],

    initialize: function () {
      let current_components = [...this.model.findDescendantModels('component'), ...this.model.findDescendantModels('block')];
      this.component_models = current_components.filter(el => el.get('_sberTooltip') && el.get('_sberTooltip')._isEnabled);

      if (this.component_models.length === 0) return false;

      this.listenToOnce(Adapt, 'pageView:postReady', this.onPageReady.bind(this));
      this.listenToOnce(Adapt, 'remove', this.onRemove);
    },

    setupSelector: function (selectorName, tip) {
      let selector = $(selectorName);
      selector.addClass('sber-tooltip-container');
      selector.append(tip);

      setTimeout(function () {
        $(tip).css({
          top: -$(tip).height() - 20
        });
      }, 500);

      if (!selector.length) {
        console.error({
          title: 'Ошибка в настройке Сбер-подсказок!',
          body: `Вы добавили подсказку <b>${selectorName.split(' ')[1]}</b>, но в исходнике её не указали.<br> Проверьте компонент ` + this.currentId
        });
        return false;
      }

      selector[0].onclick = function (e) {
        if ($(e.target).hasClass('sber-tooltip-container')) {
          let theTooltip = $(this).find('.sber-tooltip');

          $('.sber-tooltip').each(function () {
            $(this).removeClass('open');
          });

          theTooltip.toggleClass('open');
          theTooltip.css('top', e.target.offsetTop - theTooltip.height());

          if (selectorName.match(/notify/)) {
            e.target.style.position = 'static';
          }
        }
      };
    },

    onPageReady: function () {
      for (let component of this.component_models) {
        let id = component.get('_id');
        this.currentId = id;

        for (let tool of component.get('_sberTooltip')._items) {
          let tip = document.createElement('div');
          tip.className = 'sber-tooltip';
          tip.innerHTML = tool.text;
          tip.onclick = function () {
            $(this).removeClass('open');
          };
          $(tip).css('minWidth', tool.min_width);

          if (component.get('_type') === 'block' || !component.get('_component').match(/hot/)) {
            let selector = `.${id} .` + tool._className;
            this.setupSelector(selector, tip);
          } else {
            this.listenTo(Adapt, 'notify:popup', function () {
              let selector = '.notify__content .' + tool._className;
              this.setupSelector(selector, tip);
            });
          }
        }
      }
    },

    onRemove: function () {
      this.stopListening(Adapt, 'notify:popup');
    }
  });

  Adapt.on('pageView:postRender', function (view) {
    var model = view.model;
    new SberTooltipView({
      model: model,
      el: view.el
    });
  });
});

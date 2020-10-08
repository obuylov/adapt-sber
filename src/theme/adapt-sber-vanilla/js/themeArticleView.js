define([
  './themeView',
  'core/js/adapt'
], function (ThemeView, Adapt) {

  var ThemeArticleView = ThemeView.extend({

    className: function () {
    },

    /**
     * @desc При инициализации статьи, если у нее есть класс фигуры, то мы добавляем их в статью,
     * и выставляем им случайный размер и положение
     */
    initialize: function () {
      if (this.$el.hasClass('figures')) {
        const figures = ['circle', 'rect'];
        const maxLeftPosition = $('.block__inner').offset().left - 30; // отнимаем 30, чтобы не рисовать фигуру прямо в компоненте

        const rnd = (min = 100, max = 200) => Math.floor(Math.random() * (max - min)) + min;

        for (let i = 0; i < rnd(7, 15); i++) {
          let leftSide = rnd(0, 10) > 5;

          this.$el.append(`<div class="figure ${figures[rnd(0, figures.length)]}" style="width: ${rnd()}px;height: ${rnd()}px;top: ${rnd(0, 100)}%;${leftSide ? 'left' : 'right'}: ${rnd(0, maxLeftPosition)}px;"></div>`);
        }

        window.lastScrollingPosition = 0;
        window.onscroll = this.parallax;
      }
    },

    /**
     * @desc Кастомная функция параллакса.
     * При скролле проходит циклом по всем отрисованным фигурам на странице, если фигура в области видимости,
     * смотрим скроллим ли мы вверх или вниз, и в зависимости от этого поднимаем или опускаем фигуру
     */
    parallax: function() {
      $('.figure').each(function () {
        if ($(this).offset().top + $(this).height() < pageYOffset || $(this).offset().top >= pageYOffset + innerHeight) {
          return;
        }

        let goingDown = pageYOffset > window.lastScrollingPosition;
        $(this).css('top', goingDown ? '-=1px' : '+=1px');
      });

      window.lastScrollingPosition = window.pageYOffset;
    },

    setCustomStyles: function () {
    },

    onRemove: function () {
      window.removeEventListener("onscroll", this.parallax);
    }

  });

  return ThemeArticleView;

});

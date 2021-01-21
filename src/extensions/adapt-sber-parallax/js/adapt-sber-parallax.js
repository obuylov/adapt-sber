define([
  'core/js/adapt'
], function (Adapt) {
  class SberParallaxView extends Backbone.View {
    initialize(options) {
      super.initialize(options);

      this.parallaxModel = Adapt.course.get('_sberParallax');
      this.hasParallax = this.parallaxModel && this.parallaxModel._isEnabled;

      if (!this.hasParallax) return;

      this.onPageReady();
    }

    onPageReady() {
      if (this.parallaxModel._areFiguresEnabled) {
        window.lastScrollingPosition = 0;
        window.onscroll = this.parallax;
      }

      if (this.parallaxModel._areImagesEnabled) {
        setTimeout(() => {
          $('.has-bg-image').css('background-attachment', 'fixed');
        }, 1000);
        setTimeout(() => {
          this.checkArticles();
        }, 1500);
      }
    }

    checkArticles() {
      const current_components = this.model.findDescendantModels('articles');
      this.article_models = current_components.filter(el => el.get('_sberParallax') && !el.get('_sberParallax')._isImageEnabled);

      if (this.article_models.length === 0) return false;

      this.article_models.forEach(el => {
        $('.' + el.get('_id')).css('background-attachment', 'initial');
      });
    }

    /**
     * Параллакс
     * Отслеживает последнюю позицию курсора и двигает видимые фигуры в зависимости от неё
     */
    parallax() {
      $('.figure').each(function () {
        // Сначала проверим, что фигура в зоне видимости экрана
        if ($(this).offset().top + $(this).height() < pageYOffset || $(this).offset().top >= pageYOffset + innerHeight) {
          return;
        }

        // Посмотрим куда мы двигаемся – наверх или вниз
        let goingDown = pageYOffset > window.lastScrollingPosition;
        // И подвинемся в нужную сторону
        $(this).css('top', goingDown ? '-=1px' : '+=1px');
      });

      // Обновим последнюю позицию скролла
      window.lastScrollingPosition = window.pageYOffset;
    }
  }

  // Для меню и страницы одинаковый класс, отличается только _target
  Adapt.on('pageView:postRender', function (view) {
    new SberParallaxView({
      model: view.model,
      el: view.el
    });
  });

  Adapt.on('menuView:postRender', function (view) {
    new SberParallaxView({
      model: view.model,
      el: view.el
    });
  });
});

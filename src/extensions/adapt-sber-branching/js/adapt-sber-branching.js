define([
  'core/js/adapt'
], function (Adapt) {

  class SberBranching extends Backbone.View {
    initialize(options) {
      super.initialize(options);

      const current_articles = this.model.findDescendantModels('article');
      this.article_models = current_articles.filter(el => el.get('_sberBranching') && el.get('_sberBranching')._isEnabled);

      if (this.article_models.length === 0) {
        return false;
      }

      this.onPageReady();
    }

    onPageReady() {
      this.first_article = this.getFirstArticle();
      this.article_models.forEach(el => {
        if (el !== this.first_article && !el.get('_hasBeenShown')) {
          this.hideArticle(el);
        }
      });
      this.article_models.splice(this.article_models.indexOf(this.first_article), 1);
      let question = this.first_article.findDescendantModels('component').filter(el => el.get('_isQuestionType'));

      if (question.length > 0) {
        this.listenTo(question[0], 'change:_isInteractionComplete', this.interactionCompleted);
      } else {
        this.showFeedback('Ошибка подключения к вопросу', 'Расширение не смогло найти вопрос в статье, которая указана как главная!');
      }

      this.q_model = Adapt.offlineStorage.get("q_model") || "";

      if (this.q_model && this.first_article.get('_sberBranching')._canReset) {
        this.hasButton = true;

        setTimeout(() => {
          let el = $('.' + this.q_model.get('_id'));
          let btn = this.generateResetingButton();
          el.find('.btn__response-container').append(btn);
        }, 500);
      }
    }

    showFeedback(title, body) {
      Adapt.notify.popup({
        title,
        body,
        _classes: "show-title"
      });
    }

    hideArticle(el) {
      el.set({
        '_isOptional': true,
        '_isAvailable': false,
        '_hasBeenShown': false
      });
      el.setOnChildren({ '_isOptional': true, '_isAvailable': false });
    }

    showArticle(el) {
      el.set({
        '_hasBeenShown': true,
        '_isOptional': false,
        '_isAvailable': true,
        '_isRendered': true
      });
      el.setOnChildren({ '_isOptional': false, '_isAvailable': true });

      let articleClass = Adapt.getViewClass('article');
      let newArticle = new articleClass({ model: el }).$el;
      newArticle.insertAfter($('[data-adapt-id=' + this.first_article.get('_id') + ']'));

      setTimeout(() => {
        let seen = {};
        $('.article').each(function () {
          if (seen[this.className]) {
            this.remove();
          } else {
            seen[this.className] = true;
          }
        });
      }, 500);
    }

    getFirstArticle() {
      let with_question = this.article_models.filter(el => el.get('_sberBranching')._isWithQuestion);

      let res = with_question[0];

      if (with_question.length > 1) {
        this.showFeedback('Слишком много ветвлений', 'Пока что расширение умеет работать только с одним ветвлением, главным стало первое');
      } else if (with_question.length === 0) {
        this.showFeedback('Нет настройки ветвления', 'Вы не добавили флаг \'Главная ветвь\' к какой-либо из статей, и ветвление сделать невозможно. Будет показана только первая ветвь');
      }

      return res;
    }

    resetQuestionView() {
      this.article_models.forEach(el => {
        this.hideArticle(el);
        $('.' + el.get('_id')).remove();
      });
      let id = this.q_model.get('_id');
      $.scrollTo('.' + this.first_article.get('_id'));

      this.q_model.set({
        '_attemptsLeft': 1,
        '_isComplete': false,
        '_isInteractionComplete': false,
        '_canReset': true
      });
      this.q_model.resetUserAnswer();
      Adapt.findViewByModelId(id).onResetClicked();

      $('.' + id + ' .btn-reset').remove();

      Adapt.trigger('pageLevelProgress:update');
      this.hasButton = false;
    }

    generateResetingButton() {
      let btn = document.createElement('button');
      btn.className = 'btn-text btn-reset';
      btn.innerHTML = this.first_article.get("_sberBranching")._btnText;
      btn.onclick = this.resetQuestionView.bind(this);
      btn.style.marginLeft = '20px';

      return btn;
    }

    interactionCompleted(model) {
      if (!model.get('_isInteractionComplete')) {
        return;
      }

      if (!this.hasButton && this.first_article.get('_sberBranching')._canReset) {
        this.hasButton = true;
        this.q_model = model;
        let el = $('.' + model.get('_id'));
        let btn = this.generateResetingButton();

        el.find('.btn__response-container').append(btn);
        Adapt.offlineStorage.set("q_model", model);
      }

      let id = model.get('_userAnswer')[0] + 1;
      let article_to_show = this.article_models.filter(el => el.get('_sberBranching')._branchID === id)[0];

      if (!article_to_show) {
        this.showFeedback('Ошибка в выборе ветви!', 'Вы добавили вариант ответа, но ветви с таким id нет!<br>id добавляется автоматически, он всегда равен порядковому номеру ответа');
      } else {
        this.showArticle(article_to_show);
      }
    }
  }

  Adapt.on('pageView:preRender', function (view) {
    new SberBranching({
      model: view.model,
      el: view.el
    });
  });
});

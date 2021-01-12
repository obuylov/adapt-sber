define([
  'core/js/adapt'
], function(Adapt) {

  class SberBranching extends Backbone.View {
    initialize(options) {
      super.initialize(options);

      const current_articles = this.model.findDescendantModels('article');
      this.article_models = current_articles.filter(el => el.get('_sberBranching') && el.get('_sberBranching')._isEnabled);

      if (this.article_models.length === 0) {
        return false;
      }

      this.listenToOnce(Adapt, 'pageView:ready', this.onPageReady.bind(this));
    }

    onPageReady() {
      let first_article = this.getFirstArticle();

      this.article_models.forEach(el => {
        if (el !== first_article && !el.get("_hasBeenShown")) {
          this.hideArticle(el)
        }
      });
      this.article_models.splice(this.article_models.indexOf(first_article), 1);
      let question = first_article.findDescendantModels("component").filter(el => el.get("_isQuestionType"));

      if (question.length > 0) {
        this.listenTo(question[0], "change:_isInteractionComplete", this.interactionCompleted)
      } else {
        this.showFeedback("Ошибка подключения к вопросу", "Расширение не смогло найти вопрос в статье, которая указана как главная!");
      }
    }

    showFeedback(title, body) {
      Adapt.notify.popup({
        title,
        body
      });
    }

    hideArticle(el) {
      el.set({
        "_isHidden": true,
        "_isAvailable": false,
        "_isVisible": false
      })
    }

    showArticle(el) {
      el.set({
        "_hasBeenShown": true,
        "_isHidden": false,
        "_isAvailable": true,
        "_isVisible": true
      });
    }

    getFirstArticle() {
      let with_question = this.article_models.filter(el => el.get("_sberBranching")._isWithQuestion);

      let res = with_question[0]

      if (with_question.length > 1) {
        this.showFeedback("Слишком много ветвлений", "Пока что расширение умеет работать только с одним ветвлением, главным стало первое");
      }
      else if (with_question.length === 0) {
        this.showFeedback("Нет настройки ветвления", "Вы не добавили флаг 'Главная ветвь' к какой-либо из статей, и ветвление сделать невозможно. Будет показана только первая ветвь");
      }

      return res;
    }

    interactionCompleted(model) {
      let id = model.get("_userAnswer")[0] + 1;

      let article_to_show = this.article_models.filter(el => el.get("_sberBranching")._branchID === id)[0];

      if (!article_to_show) {
        this.showFeedback("Ошибка в выборе ветви!", "Вы добавили вариант ответа, но ветви с таким id нет!<br>id добавляется автоматически, он всегда равен порядковому номеру ответа")
      }
      else
        this.showArticle(article_to_show);
    }
  }

  Adapt.on("pageView:postRender", function(view) {
    new SberBranching({
      model: view.model,
      el: view.el
    });
  });
});

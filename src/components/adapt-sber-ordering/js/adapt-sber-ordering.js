define([
  'core/js/adapt',
  'core/js/views/questionView',
  'core/js/models/questionModel',
  'libraries/Sortable.min'
], function (Adapt, QuestionView, QuestionModel, Sortable) {

  class SberOrderingView extends QuestionView {
    setupQuestion() {
      this.resetAnswers();
    }

    resetAnswers() {
      this.answers = [];
      this.items = this.model.get('_items');
    }

    resetQuestion() {
      if (!this.sort) {
        this.setupSortableLogic();
      }
      this.answers = [];
    }

    onQuestionRendered() {
      this.setReadyStatus();

      if (!this.sort) {
        this.setupSortableLogic();
      }

      if (!this.model.get('_isCorrect')) {
        if (this.model.get('_isRandom')) {
          this.setupRandomIndices();
        }
      } else {
        this.addDisabledStyles();
      }
    }

    setupRandomIndices() {
      let len = this.items.length;
      // сколько элементов нужно подвинуть
      let amount = Math.floor(len / 2);
      // какие индексы свободны
      let indices = [...Array(len).keys()];

      // от 0 до количества перемещений
      for (let i = 0; i < amount; i++) {
        // берем случайный индекс
        let idx = Math.floor(Math.random() * indices.length);
        // двигаем элемент с этим индексом
        this.$('.ordering__container')[0].prepend(this.$('.ordering__item').eq(indices[idx])[0]);
        // удаляем индекс из доступных
        indices.splice(idx, 1);
      }
    }

    setupSortableLogic() {
      this.sort = Sortable.create(this.$('.ordering__container')[0]);
    }

    onSubmitClicked() {
      this.resetAnswers();

      this.items.forEach((el) => {
        this.answers.push(this.$('.ordering__item').eq(el.position).text().trim() === el.text);
      });

      this.checkAnswers();
    }

    checkAnswers() {
      // есть ошибки
      if (this.answers.indexOf(false) !== -1) {
        this.showFeedback('incorrect');
        this.model.set('_isCorrect', false);
      } else {
        this.showFeedback('correct');
        this.model.set('_isCorrect', true);
        this.addDisabledStyles();
      }

      this.storeUserAnswer();

      this.setCompletionStatus();
    }

    showFeedback(what) {
      Adapt.notify.popup({
        title: this.model.get('_displayTitle'),
        body: this.model.get('_feedback')[what],
        _classes: 'ordering is-' + what
      });
    }

    addDisabledStyles() {
      this.sort.option('disabled', true);
      this.$('button').attr('disabled', 'disabled');
      this.$('button').addClass('disabled');
    }

    getAnswers() {
      return this.model.get('_items').map(el => el.text);
    }

    storeUserAnswer() {
      let userAnswers = [];
      let the_answers = this.getAnswers();

      this.$('.ordering__item').each(function () {
        userAnswers.push(the_answers.indexOf($(this)[0].innerText));
      });

      this.model.set('_userAnswer', userAnswers);
    }
  }

  SberOrderingView.template = 'sber-ordering';

  return Adapt.register('sber-ordering', {
    model: QuestionModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: SberOrderingView
  });
});

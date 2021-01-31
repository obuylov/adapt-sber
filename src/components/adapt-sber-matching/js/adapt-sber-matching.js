define([
  'core/js/adapt',
  'core/js/views/questionView',
  'core/js/models/questionModel',
], function (Adapt, QuestionView, QuestionModel) {

  class SberMatchingView extends QuestionView {
    events() {
      return {
        'click .sber-matching__question': 'questionClicked',
        'click .sber-matching__answer': 'answerClicked',
        'click .btn__action': 'onSubmitClicked'
      };
    }

    preRender() {
      this.colors = ['#42E3B4', '#00C86A',
        '#00D900', '#A0E720', '#0066FF'];

      this.resetAnswers();
    }

    resetAnswers() {
      this.canPlay = true;
      this.currentColor = undefined;
      this.currentAnswer = undefined;
      this.currentQuestion = undefined;

      this.answers = [];
      this.pairs = [];
      this.items = this.model.get('_items');
    }

    addDisabledStyles() {
      this.canPlay = false;
      this.$('button').attr('disabled', 'disabled');
    }

    postRender() {
      this.setReadyStatus();

      if (!this.model.get('_isComplete')) {
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
        this.$('.sber-matching__answers-container')[0].prepend(this.$('.sber-matching__answer').eq(indices[idx])[0]);
        // удаляем индекс из доступных
        indices.splice(idx, 1);
      }
    }

    setColor(reset = false) {
      if (reset) {
        this.currentColor = undefined;
      } else {
        if (!this.currentColor) {
          function rnd(arr) {
            return Math.floor(Math.random() * arr.length);
          }

          let id = rnd(this.items);
          this.currentColor = this.colors[id];
          this.colors.splice(id, 1);
        }
      }
    }

    questionClicked(e) {
      if (!this.canPlay) {
        return;
      }

      this.setColor();

      if (!this.currentQuestion) {
        this.currentQuestion = e.target;

        let arr = this.pairs.filter(el => el.q === this.currentQuestion.innerText);
        if (arr.length > 0) {
          this.$('[data-id=' + arr[0].a_id + ']').css('border-color', 'black');
          this.colors.push(arr[0].c);
          this.pairs = this.pairs.filter(el => el.q !== this.currentQuestion.innerText);
          this.currentQuestion.style.borderColor = 'black';
          this.currentQuestion = undefined;
        } else {
          this.currentQuestion.style.borderColor = this.currentColor;
          this.currentQuestion.classList.add('selected');
        }
      } else {
        this.colors.push(this.currentQuestion.style.borderColor);
        this.currentQuestion.style.borderColor = 'black';
        this.currentQuestion = undefined;
      }

      if (this.currentAnswer && this.currentQuestion) {
        this.addAnswerPair();
      }
    }

    answerClicked(e) {
      if (!this.canPlay) {
        return;
      }

      this.setColor();

      if (!this.currentAnswer) {
        this.currentAnswer = e.target;

        let arr = this.pairs.filter(el => el.a === this.currentAnswer.innerText);
        if (arr.length > 0) {
          this.$('[data-id=' + arr[0].q_id + ']').css('border-color', 'black');
          this.pairs = this.pairs.filter(el => el.a !== this.currentAnswer.innerText);
          this.colors.push(arr[0].c);
          this.currentAnswer.style.borderColor = 'black';
          this.currentAnswer = undefined;
        } else {
          this.currentAnswer.classList.add('selected');
          this.currentAnswer.style.borderColor = this.currentColor;
        }
      } else {
        this.colors.push(this.currentAnswer.style.borderColor);
        this.currentAnswer.style.borderColor = 'black';
        this.currentAnswer = undefined;
      }

      if (this.currentAnswer && this.currentQuestion) {
        this.addAnswerPair();
      }
    }

    addAnswerPair() {
      this.pairs.push({
        q: this.currentQuestion.innerText, a: this.currentAnswer.innerText, c: this.currentColor,
        q_id: this.currentQuestion.dataset.id, a_id: this.currentAnswer.dataset.id
      });

      this.setColor(true);
      this.currentQuestion = undefined;
      this.currentAnswer = undefined;
    }

    onSubmitClicked() {
      if (this.pairs.length < this.items.length) {
        return;
      }

      this.items.forEach((el) => {
        let item = this.pairs.filter(pair => pair.q === el.question)[0];
        this.answers.push(item.a === el.answer);
      });

      this.checkAnswers();

      this.resetAnswers();
    }

    checkAnswers() {
      // есть ошибки
      if (this.answers.indexOf(false) !== -1) {
        this.showFeedback('incorrect');
      } else {
        this.showFeedback('correct');
        this.setCompletionStatus();
        this.addDisabledStyles();
      }
    }

    showFeedback(what) {
      Adapt.notify.popup({
        body: this.model.get('_feedback')[what],
        _classes: 'matching ' + what
      });
    }

    onResetClicked() {
      this.resetAnswers();
      this.$('.item').each(function () {
        $(this).removeClass('selected');
        $(this).css('border-color', 'black');
      });
    }
  }

  SberMatchingView.template = 'sber-matching';

  return Adapt.register('sber-matching', {
    model: QuestionModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: SberMatchingView
  });
});

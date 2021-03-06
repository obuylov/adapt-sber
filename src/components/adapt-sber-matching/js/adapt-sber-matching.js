define([
  'core/js/adapt',
  'core/js/views/questionView',
  'core/js/models/questionModel',
], function (Adapt, QuestionView, QuestionModel) {

  class SberMatchingView extends QuestionView {
    events() {
      return {
        'click .item': 'elementClicked',
        'click .btn__submit': 'onSubmitClicked',
        'click .btn__reset': 'onResetClicked'
      };
    }

    preRender() {
      // сбрасываем настройки
      this.resetAnswers();
    }

    resetAnswers() {
      // очищаем текущие: цвет, ответ, вопрос, все ответы, все выбранные пары.
      this.canPlay = true;
      this.currentColor = undefined;
      this.currentAnswer = undefined;
      this.currentQuestion = undefined;

      this.answers = [];
      this.pairs = [];
      this.colors = ['rgb(66, 227, 180)', 'rgb(0, 200, 106)', 'rgb(0, 217, 0)', 'rgb(160, 231, 32)', 'rgb(0, 102, 255)'];
      // получаем элементы
      this.items = this.model.get('_items');
    }

    /**
     * @name addDisabledStyles
     * Отключает возможность играть и нажимать на кнопки
     */
    addDisabledStyles() {
      this.canPlay = false;
      this.$('button').attr('disabled', 'disabled').addClass('disabled');
    }

    postRender() {
      this.setReadyStatus();

      if (!this.model.get('_isComplete')) {
        if (this.model.get('_isRandom')) { // мы ещё не прошли компонент, сморим нужен ли случайный порядок вопросов
          this.setupRandomIndices();
        }
      } else { // компонент уже пройден, просто отключу возможность играть и покрашу элементы
        this.addDisabledStyles();

        this.model.get('_answers').forEach(el => {
          this.$(`[data-id=${el.a_id}]`).css('border-color', el.c);
          this.$(`[data-id=${el.q_id}]`).css('border-color', el.c);
        });
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

    /**
     * Устанавливает значение цвета.
     * Если цвет уже стоит, то ничего не делаем, а иначе берем случайный из списка
     * Чтобы не повторяться удаляем цвет из доступных
     * @param reset
     */
    setColor(reset = false) {
      if (reset) {
        this.currentColor = undefined;
      } else {
        if (!this.currentColor) {
          function rnd(arr) {
            return Math.floor(Math.random() * arr.length);
          }

          let id = rnd(this.colors);
          this.currentColor = this.colors[id];
          this.colors.splice(id, 1);
        }
      }
    }

    /**
     * Обрабатываем клик на любой из элементов
     * Код одинаковый, поэтому объединен в одну функцию
     * @param e
     */
    elementClicked(e) {
      // если не можем играть, то дальше не смотрим
      // или если нажали на бейджик
      if (!this.canPlay || e.target.classList.contains('badge')) {
        return;
      }

      // Смотрим, нажали ли мы на вопрос, или на ответ
      let isQuestion = e.target.classList.contains('sber-matching__question');
      let el = isQuestion ? 'currentQuestion' : 'currentAnswer';

      this.setColor();

      if (!this[el]) { // Если сейчас нет текущего ответа/вопроса
        this[el] = e.target; // Задаем его

        // Смотрим, не выбрали ли мы его раньше (есть ли он в списке готовых пар)
        let arr = this.pairs.filter(elem => elem[isQuestion ? 'q' : 'a'] === this[el].innerText.replace(/[0-9]$/g, '').replace('\n', ''));

        // Если есть, нужно открепить
        if (arr.length > 0) {
          // Если это вопрос, то чистим цвет у парного ответа, и наоборот в случае, если нажали на ответ
          this.$('[data-id=' + arr[0][isQuestion ? 'a_id' : 'q_id'] + ']').css('border-color', 'black');
          // Возвращаем цвет в список
          this.colors.push(arr[0].c);

          // удаляем бейджик
          this.removeBadgeFrom(arr[0]['q_id']);
          this.removeBadgeFrom(arr[0]['a_id']);

          // Удаляем эту пару
          this.pairs = this.pairs.filter(elem => elem[isQuestion ? 'q' : 'a'] !== this[el].innerText.replace(/[0-9]$/g, '').replace('\n', ''));

          // Очищаем сам элемент
          this[el].style.borderColor = 'black';
          this[el] = undefined;
        } else { // На этот элемент раньше не нажимали, просто красим его
          this[el].style.borderColor = this.currentColor;
          this[el].classList.add('selected');
        }
      } else { // У нас уже есть текущий элемент, и мы или нажали на него самого, или на его же категорию
        // Сбрасываем текущий выбранный
        const borderColor = this[el].style.borderColor;
        if (this.colors.indexOf(borderColor) === -1) {
          this.colors.push(borderColor);
        }
        this[el].style.borderColor = 'black';
        this.currentColor = undefined;
        this[el] = undefined;
      }

      // Если у нас есть пара, нужно её обработать и сохранить
      if (this.currentAnswer && this.currentQuestion) {
        this.addAnswerPair();
      }
    }

    appendBadgeToElement(element) {
      element.innerHTML += `<span class="badge">${+this.currentQuestion.dataset.id.split('-')[1] + 1}</span>`;
      element.querySelector('.badge').style.color = this.currentColor;
    }

    removeBadgeFrom(id) {
      this.$(`[data-id='${id}']`).find('.badge').remove();
    }

    addBadge() {
      if (!this.currentQuestion || !this.currentColor || !this.currentAnswer) {
        alert('Ошибка в присваивании бейджика');
        return;
      }

      this.appendBadgeToElement(this.currentAnswer);
      this.appendBadgeToElement(this.currentQuestion);
    }

    /**
     * Создаем пару вопрос-ответ
     * Сохраняем текст вопроса, текст ответа, цвет, id div'ов вопроса и ответа
     * Обнуляем все значения
     */
    addAnswerPair() {
      this.pairs.push({
        id: this.currentQuestion.dataset.id,
        q: this.currentQuestion.innerText, a: this.currentAnswer.innerText, c: this.currentColor,
        q_id: this.currentQuestion.dataset.id, a_id: this.currentAnswer.dataset.id
      });

      this.addBadge();

      this.setColor(true);
      this.currentQuestion = undefined;
      this.currentAnswer = undefined;
    }

    onSubmitClicked() {
      if (this.pairs.length < this.items.length) {
        return;
      }

      this.items.forEach((el) => {
        let item = this.pairs.filter(pair => {
          return pair.q === el.question;
        })[0];
        this.answers.push(item.a === el.answer);
      });

      this.checkAnswers();
      this.resetAnswers();
    }

    checkAnswers() {
      // есть ошибки
      if (this.answers.indexOf(false) !== -1) {
        this.showFeedback('incorrect');
        this.model.set('_isCorrect', false);
      } else {
        this.showFeedback('correct');
        this.model.set('_isCorrect', true);
        this.model.set('_answers', this.pairs);
        this.addDisabledStyles();
        this.setCompletionStatus();
      }
    }

    showFeedback(what) {
      Adapt.notify.popup({
        body: this.model.get('_feedback')[what],
        _classes: 'matching ' + 'is-' + what
      });
    }

    onResetClicked() {
      this.canPlay = true;
      this.resetAnswers();
      this.$('.item').each(function () {
        $(this).removeClass('selected');
        $(this).css('border-color', 'black');
      });
      this.$('.badge').remove();
    }
  }

  SberMatchingView.template = 'sber-matching';

  return Adapt.register('sber-matching', {
    model: QuestionModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: SberMatchingView
  });
});

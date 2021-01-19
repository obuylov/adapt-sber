define([
  'core/js/adapt',
  'core/js/views/questionView',
  'core/js/models/questionModel',
  'libraries/Sortable.min'
], function (Adapt, QuestionView, QuestionModel, Sortable) {

  class SberDragndropView extends QuestionView {
    setupQuestion() {
      this.answers = [];

      this.model.set('_canShowModelAnswer', false);
    }

    onQuestionRendered() {
      this.setReadyStatus();

      this.$('.component__header-inner .component__instruction').remove();

      this.setWidthStyle();
      this.shuffleAnswers();
      this.setupCorrectVersion();

      this.listenTo(Adapt, 'device:resize', this.setWidthStyle);
    }

    setupCorrectVersion() {
      let self = this;
      let type = this.model.get('_style_type');
      this.$('.sber-dragndrop__question-answer-placeholder').each(function (i) {
        const sort = Sortable.create($(this)[0], {
          group: {
            name: 'drag',
            put: function (to) {
              return type === 'first' || type === 'third' ? to.el.children.length < 2 : true;
            }
          },
          sort: false,
          filter: '.ignore',
          onAdd: function (e) {
            $(e.to).addClass('not-empty');
          },
          onRemove: function (e) {
            if (e.from.children.length <= 1) {
              $(e.from).removeClass('not-empty');
            }
          },
          animation: 150,
          scroll: true,
          scrollSensitivity: 100
        });
      });

      new Sortable(this.$('.sber-dragndrop__answers-container')[0], {
        group: 'drag',
        animation: 150,
        sort: false,
        filter: '.ignore',
        scroll: true,
        scrollSensitivity: 100
      });
    }

    setWidthStyle() {
      let cols = this.model.get('_columns');
      let computedVal = Math.floor(100 / cols);
      $('.sber-dragndrop__answers-answer').css('max-width', Adapt.device.screenSize === 'small' ? '100%' : computedVal + '%');
      document.querySelectorAll(`[data-adapt-id="${this.model.get('_id')}"] .sber-dragndrop__answers-answer:nth-child(${cols}n)`).forEach(el => el.style.marginRight = 0);
    }

    shuffleAnswers() {
      if (this.model.get('_isRandom')) {
        let parent = this.$('.sber-dragndrop__answers-container');
        let children = parent.children();

        for (let i = 0; i < Math.floor(children.length / 2); i++) {
          parent.append(children[Math.floor(Math.random() * children.length)]);
        }
      }
    }

    // QUESTION VIEW FUNCTIONS

    getAnswers() {
      let answers = [];
      this.model.get('_items').forEach(el => {
        answers = answers.concat(el.accepted);
      });

      return answers;
    }

    markAnswers() {
      let id = '.' + this.model.get('_id');
      let count = 0;
      let type = this.model.get('_style_type');

      _.each(this.model.get('_items'), function (item, i) {
        let answers = [];

        if (type === 'first') {
          answers = $(id + ' .sber-dragndrop__question-container').eq(i).find('.sber-dragndrop__question-answers-container')[0];
          answers = answers.innerText.split('\n');

          item._isCorrect = item.accepted.sort().join() === answers.sort().join();
        } else if (type === 'second') {
          answers = $(id + ' .sber-dragndrop__question-answer-placeholder').eq(i)[0];
          answers = answers.innerText.split('\n');
        }

        item._isCorrect = item.accepted.sort().join() === answers.sort().join();

        if (item._isCorrect) {
          count++;
        }
      }, this);

      this.model.set('_correctAnswerCount', count);
    }

    canSubmit() {
      let elements_count = this.$('.sber-dragndrop__answers-container').children().length;
      return elements_count <= 1;
    }

    isCorrect() {
      this.markAnswers();

      return !_.contains(_.pluck(this.model.get('_items'), '_isCorrect'), false);
    }

    storeUserAnswer() {
      let userAnswers = [];
      let the_answers = this.getAnswers();

      this.$('.sber-dragndrop__answers-answer').each(function () {
        userAnswers.push(the_answers.indexOf($(this)[0].innerText));
      });

      this.model.set('_userAnswer', userAnswers);
      console.log(userAnswers);
    }

    setScore() {
      let amount = this.model.get('_items').length;
      let weight = this.model.get('_questionWeight');
      let count = this.model.get('_correctAnswerCount') || 0;

      let score = count * weight / amount;
      this.model.set('_score', score);
    }
  }

  SberDragndropView.template = 'sber-dragndrop';

  return Adapt.register('sber-dragndrop', {
    model: QuestionModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: SberDragndropView
  });
});

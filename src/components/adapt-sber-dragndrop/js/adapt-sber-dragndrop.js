define([
  'core/js/adapt',
  'core/js/views/questionView',
  'core/js/models/questionModel',
  'libraries/Sortable.min'
], function (Adapt, QuestionView, QuestionModel, Sortable) {

  class SberDragndropView extends QuestionView {
    setupQuestion() {
      this.sortables = [];
      this.answers = [];
      window.Sortable = Sortable;
    }

    onQuestionRendered() {
      this.setReadyStatus();

      this.$('.component__header-inner .component__instruction').remove();

      this.setWidthStyle();
      this.shuffleAnswers();
      this.setupCorrectVersion();
    }

    setupCorrectVersion() {
      switch (this.model.get('_style_type')) {
        case 'first':
          let self = this;
          this.$('.sber-dragndrop__question-answer-placeholder').each(function () {
            Sortable.create($(this)[0], {
              group: {
                name: 'drag',
                put: function (to) {
                  return to.el.children.length < 2;
                }
              },
              sort: false,
              filter: '.ignore',
              onAdd: function (e) {
                $(e.to).addClass('not-empty');
              },
              onRemove: function (e) {
                $(e.from).removeClass('not-empty');
              },
              animation: 150
            });
          });

          new Sortable(this.$('.sber-dragndrop__answers-container')[0], {
            group: 'drag',
            animation: 150,
            sort: false,
            filter: '.ignore'
          });

          break;
      }
    }

    setWidthStyle() {
      let max = Math.max(...this.model.get('_items').map(el => el.accepted.length));
      let parentWidth = $('.sber-dragndrop__answers-container').width();

      $('.sber-dragndrop__answers-answer').css('max-width', parentWidth / max - 50);
    }

    shuffleAnswers() {

    }

    // DRAG N DROP

    setupSortable(el, group = '') {
      let res = {
        el,
        sortable: new Sortable.create(el,),
      };

      if (group) {
        res.group = group;
      }

      this.sortables.push(res);
    }

    // QUESTION VIEW FUNCTIONS

    toggleAnswer(show = true) {

    }

    markAnswers() {

    }

    canSubmit() {

    }

    isCorrect() {

    }

    resetQuestion() {

    }

    showCorrectAnswer() {
      this.toggleAnswer();
    }

    hideCorrectAnswer() {
      this.toggleAnswer(false);
    }

    storeUserAnswer() {
      let userAnswers = [];
      this.model.set('_userAnswer', userAnswers);
    }

    setScore() {
      let score = 0;
      this.model.set('_score', score);
    }
  }

  SberDragndropView.template = 'sber-dragndrop';

  return Adapt.register('sber-dragndrop', {
    model: QuestionModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: SberDragndropView
  });
});

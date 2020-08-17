define([
  'core/js/views/questionView'
], function(QuestionView) {

  var TextInputView = QuestionView.extend({

    events: {
      'focus .js-textinput-textbox': 'clearValidationError',
      'change .js-textinput-textbox': 'onInputChanged',
      'keyup .js-textinput-textbox': 'onInputChanged'
    },

    resetQuestionOnRevisit: function() {
      this.setAllItemsEnabled(false);
      this.resetQuestion();
    },

    setupQuestion: function() {
      this.model.setupRandomisation();
    },

    disableQuestion: function() {
      this.setAllItemsEnabled(false);
    },

    enableQuestion: function() {
      this.setAllItemsEnabled(true);
    },

    setAllItemsEnabled: function(isEnabled) {
      this.model.get('_items').forEach(function(item, index) {
        var $itemInput = this.$('.js-textinput-textbox').eq(index);

        $itemInput.prop('disabled', !isEnabled);
      }, this);
    },

    onQuestionRendered: function() {
      this.setReadyStatus();
    },

    clearValidationError: function() {
      this.$('.js-textinput-textbox').removeClass('has-error');
    },

    // Blank method for question to fill out when the question cannot be submitted
    onCannotSubmit: function() {
      this.showValidationError();
    },

    showValidationError: function() {
      this.$('.js-textinput-textbox').addClass('has-error');
    },

    // This is important and should give the user feedback on how they answered the question
    // Normally done through ticks and crosses by adding classes
    showMarking: function() {
      if (!this.model.get('_canShowMarking')) return;

      this.model.get('_items').forEach(function(item, i) {
        var $item = this.$('.js-textinput-item').eq(i);
        $item.removeClass('is-correct is-incorrect').addClass(item._isCorrect ? 'is-correct' : 'is-incorrect');
      }, this);
    },

    // Used by the question view to reset the look and feel of the component.
    resetQuestion: function() {
      this.$('.js-textinput-textbox').prop('disabled', !this.model.get('_isEnabled')).val('');

      this.model.set({
        _isAtLeastOneCorrectSelection: false,
        _isCorrect: undefined
      });
    },

    showCorrectAnswer: function() {

      if (this.model.get('_answers'))  {

        var correctAnswers = this.model.get('_answers');
        this.model.get('_items').forEach(function(item, index) {
          this.$('.js-textinput-textbox').eq(index).val(correctAnswers[index][0]);
        }, this);

      } else {
        this.model.get('_items').forEach(function(item, index) {
          this.$('.js-textinput-textbox').eq(index).val(item._answers[0]);
        }, this);
      }

    },

    hideCorrectAnswer: function() {
      this.model.get('_items').forEach(function(item, index) {
        this.$('.js-textinput-textbox').eq(index).val(item.userAnswer);
      }, this);
    },

    onInputChanged: function(e) {
      var $input = $(e.target);
      this.model.setItemUserAnswer($input.parents('.js-textinput-item').index(), $input.val());
    }

  });

  return TextInputView;

});

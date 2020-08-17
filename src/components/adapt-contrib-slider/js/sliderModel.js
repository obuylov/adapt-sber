define([
  'core/js/adapt',
  'core/js/models/questionModel'
], function(Adapt, QuestionModel) {

  var SliderModel = QuestionModel.extend({

    init:function() {
      QuestionModel.prototype.init.call(this);

      this.setupModelItems();

      this.set('_selectedItem', this.get('_items')[0]);
    },

    /**
     * Returns the number of decimal places in a specified number
     */
    getDecimalPlaces: function(num) {
      return (num.toString().split('.')[1] || []).length;
    },

    setupModelItems: function() {
      var items = [];
      var answer = this.get('_correctAnswer');
      var range = this.get('_correctRange');
      var start = this.get('_scaleStart');
      var end = this.get('_scaleEnd');
      var step = this.get('_scaleStep') || 1;

      var dp = this.getDecimalPlaces(step);

      for (var i = start; i <= end; i += step) {
        if (dp !== 0) {
          // Ensure that steps with decimal places are handled correctly.
          i = parseFloat(i.toFixed(dp));
        }

        items.push({
          value: i,
          selected: false,
          // _correctAnswer/answer is a String - this allows AAT users to assign it no value when _correctRange needs to be used instead
          // we therefore need to convert it to Number when checking the answer (see https://github.com/adaptlearning/adapt_framework/issues/2259)
          correct : answer ? i === Number(answer) : (i >= range._bottom && i <= range._top)
        });
      }

      this.set({
        '_items': items,
        '_marginDir': Adapt.config.get('_defaultDirection') === 'rtl' ? 'right' : 'left'
      });
    },

    /**
    * allow the user to submit immediately; the slider handle may already be in the position they want to choose
    */
    canSubmit: function() {
      return true;
    },

    restoreUserAnswers: function() {
      if (!this.get('_isSubmitted')) {
        this.set({
          _selectedItem: {},
          _userAnswer: undefined
        });
        return;
      }

      var items = this.get('_items');
      var userAnswer = this.get('_userAnswer');
      for (var i = 0, l = items.length; i < l; i++) {
        var item = items[i];
        if (item.value === userAnswer) {
          item.selected = true;
          this.set('_selectedItem', item);
          break;
        }
      }

      this.setQuestionAsSubmitted();
      this.markQuestion();
      this.setScore();
      this.setupFeedback();
    },

    //This preserves the state of the users answers for returning or showing the users answer
    storeUserAnswer: function() {
      this.set('_userAnswer', this.get('_selectedItem').value);
    },

    resetUserAnswer: function() {
      this.set({
        _isAtLeastOneCorrectSelection: false,
        _selectedItem: {},
        _userAnswer: undefined
      });
    },

    deselectAllItems: function() {
      _.each(this.get('_items'), function(item) {
        item.selected = false;
      }, this);
    },

    isCorrect: function() {
      var numberOfCorrectAnswers = 0;

      _.each(this.get('_items'), function(item, index) {
        if (item.selected && item.correct) {
          this.set('_isAtLeastOneCorrectSelection', true);
          numberOfCorrectAnswers++;
        }
      }, this);

      this.set('_numberOfCorrectAnswers', numberOfCorrectAnswers);

      return this.get('_isAtLeastOneCorrectSelection') ? true : false;
    },

    isPartlyCorrect: function() {
      return this.get('_isAtLeastOneCorrectSelection');
    },

    // Used to set the score based upon the _questionWeight
    setScore: function() {
      var numberOfCorrectAnswers = this.get('_numberOfCorrectAnswers');
      var questionWeight = this.get('_questionWeight');
      var score = questionWeight * numberOfCorrectAnswers;
      this.set('_score', score);
    },

    /**
    * Used by adapt-contrib-spoor to get the user's answers in the format required by the cmi.interactions.n.student_response data field
    */
    getResponse:function() {
      return this.get('_userAnswer').toString();
    },

    /**
    * Used by adapt-contrib-spoor to get the type of this question in the format required by the cmi.interactions.n.type data field
    */
    getResponseType:function() {
      return "numeric";
    }

  });

  return SliderModel;

});

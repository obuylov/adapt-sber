define([
  'core/js/models/questionModel'
], function(QuestionModel) {

  var TextInputModel = QuestionModel.extend({

    init: function() {
      QuestionModel.prototype.init.call(this);

      this.set( '_genericAnswerIndexOffset', TextInputModel.genericAnswerIndexOffset );

      this.setupQuestionItemIndexes();
      this.checkCanSubmit();
    },

    setupQuestionItemIndexes: function() {
      this.get('_items').forEach(function(item, index) {

        if (item._index === undefined) item._index = index;
        if (item._answerIndex === undefined) item._answerIndex = -1;

      });
    },

    restoreUserAnswers: function() {
      if (!this.get('_isSubmitted')) return;

      var userAnswer = this.get('_userAnswer');
      var genericAnswers = this.get('_answers');
      this.get('_items').forEach(function(item) {
        var answerIndex = userAnswer[item._index];
        if (answerIndex >= TextInputModel.genericAnswerIndexOffset) {
          item.userAnswer = genericAnswers[answerIndex - TextInputModel.genericAnswerIndexOffset];
          item._answerIndex = answerIndex;
        } else if (answerIndex > -1) {
          item.userAnswer = item._answers[answerIndex];
          item._answerIndex = answerIndex;
        } else {
          if (item.userAnswer === undefined) item.userAnswer = '******';
          item._answerIndex = -1;
        }
        if (item.userAnswer instanceof Array) item.userAnswer = item.userAnswer[0];
      });

      this.setQuestionAsSubmitted();
      this.markQuestion();
      this.setScore();
      this.setupFeedback();
    },

    setupRandomisation: function() {
      if (!this.get('_isRandom') || !this.get('_isEnabled')) return;

      this.set('_items', _.shuffle(this.get('_items')));
    },

    // Use to check if the user is allowed to submit the question
    canSubmit: function() {
      // can submit if every item has user input
      return this.get('_items').every(({ userAnswer }) => userAnswer);
    },

    setItemUserAnswer:function(itemIndex, userAnswer) {
      var item = this.get('_items')[itemIndex];
      item.userAnswer = userAnswer;
      this.checkCanSubmit();
    },

    //This preserve the state of the users answers for returning or showing the users answer
    storeUserAnswer: function() {
      var items = this.get('_items');

      this.isCorrect();

      var userAnswer = new Array( items.length );
      items.forEach(function(item, index) {
        userAnswer[ item._index ] = item._answerIndex;
      });
      this.set('_userAnswer', userAnswer);
    },

    isCorrect: function() {
      if (this.get('_answers')) {
        this.markGenericAnswers();
      } else {
        this.markSpecificAnswers();
      }
      // do we have any _isCorrect == false?
      return !_.contains(_.pluck(this.get('_items'), '_isCorrect'), false);
    },

    isPartlyCorrect: function() {
      return this.get('_isAtLeastOneCorrectSelection');
    },

    // Allows the learner to give answers into any input, ignoring the order.
    // (this excludes any inputs which have their own specific answers).
    markGenericAnswers: function() {
      var numberOfCorrectAnswers = 0;
      var correctAnswers = this.get('_answers').slice();
      var usedAnswerIndexes = [];

      this.get('_items').forEach(function(item) {
        correctAnswers.forEach(function(answerGroup, answerIndex) {
          if (_.indexOf(usedAnswerIndexes, answerIndex) > -1) return;

          if (this.checkAnswerIsCorrect(answerGroup, item.userAnswer) == false) return;

          usedAnswerIndexes.push(answerIndex);
          item._isCorrect = true;
          item._answerIndex = answerIndex + TextInputModel.genericAnswerIndexOffset;

          this.set({
            _numberOfCorrectAnswers: ++numberOfCorrectAnswers,
            _isAtLeastOneCorrectSelection: true
          });

        }, this);
        if(!item._isCorrect) item._isCorrect = false;
      }, this);
    },

    // Marks any items which have answers specific to it
    // (i.e. item has a _answers array)
    markSpecificAnswers: function() {
      var numberOfCorrectAnswers = 0;
      this.get('_items').forEach(function(item) {
        if (!item._answers) return;
        var userAnswer = item.userAnswer || '';
        if (this.checkAnswerIsCorrect(item._answers, userAnswer)) {
          item._isCorrect = true;
          item._answerIndex = _.indexOf(item._answers, this.cleanupUserAnswer(userAnswer));
          this.set({
            _numberOfCorrectAnswers: ++numberOfCorrectAnswers,
            _isAtLeastOneCorrectSelection: true
          });
        } else {
          item._isCorrect = false;
          item._answerIndex = -1;
        }
      }, this);
    },

    checkAnswerIsCorrect: function(possibleAnswers, userAnswer) {
      var uAnswer = this.cleanupUserAnswer(userAnswer);
      var matched = possibleAnswers.filter(function(cAnswer) {
        return this.cleanupUserAnswer(cAnswer) == uAnswer;
      }, this);

      var answerIsCorrect = matched && matched.length > 0;
      if (answerIsCorrect) this.set('_hasAtLeastOneCorrectSelection', true);
      return answerIsCorrect;
    },

    cleanupUserAnswer: function(userAnswer) {
      if (this.get('_allowsAnyCase')) {
        userAnswer = userAnswer.toLowerCase();
      }
      if (this.get('_allowsPunctuation')) {
        userAnswer = userAnswer.replace(/[\.,-\/#!$£%\^&\*;:{}=\-_`~()]/g, '');
        //remove any orphan double spaces and replace with single space (B & Q)->(B  Q)->(B Q)
        userAnswer = userAnswer.replace(/(  +)+/g, ' ');
      }
      // removes whitespace from beginning/end (leave any in the middle)
      return $.trim(userAnswer);
    },

    // Used to set the score based upon the _questionWeight
    setScore: function() {
      var numberOfCorrectAnswers = this.get('_numberOfCorrectAnswers');
      var questionWeight = this.get('_questionWeight');
      var itemLength = this.get('_items').length;

      var score = questionWeight * numberOfCorrectAnswers / itemLength;

      this.set('_score', score);
    },

    resetUserAnswer: function() {
      this.get('_items').forEach(function(item) {
        item._isCorrect = false;
        item.userAnswer = '';
      });
    },

    /**
    * used by adapt-contrib-spoor to get the user's answers in the format required by the cmi.interactions.n.student_response data field
    * returns the user's answers as a string in the format 'answer1[,]answer2[,]answer3'
    * the use of [,] as an answer delimiter is from the SCORM 2004 specification for the fill-in interaction type
    */
    getResponse: function() {
      return _.pluck(this.get('_items'), 'userAnswer').join('[,]');
    },

    /**
    * used by adapt-contrib-spoor to get the type of this question in the format required by the cmi.interactions.n.type data field
    */
    getResponseType: function() {
      return 'fill-in';
    }
  }, {
    genericAnswerIndexOffset: 65536
  });

  return TextInputModel;

});

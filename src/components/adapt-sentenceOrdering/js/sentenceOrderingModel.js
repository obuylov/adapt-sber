define(function(require) {
    var QuestionModel = require('core/js/models/questionModel');

    var SentenceOrderingModel = QuestionModel.extend({

        init: function() {
            QuestionModel.prototype.init.call(this);
        },

        restoreUserAnswers: function() {
            if (!this.get("_isSubmitted")) return;
            var userAnswer = this.get("_userAnswer");
            var itemArray = [];
            var items = _.sortBy(this.get("_items"));
            _.each(userAnswer, function(item, index) {
                itemArray[index] = items[item - 1];
            }, this);
            this.set("_items", itemArray);
            this.setPrefixTitle();
            this.setQuestionAsSubmitted();
            this.markQuestion();
            this.setScore();
            this.setupFeedback();
        },

        setupRandomisation: function() {
            this.setPrefixTitle();
            if (this.get('_isRandom') && this.get('_isEnabled')) {
                this.set("_items", _.shuffle(this.get("_items")));
            }
        },

        setPrefixTitle: function() {
            if (!this.get("_isPrefixTitle")) return;
            var items = _.sortBy(this.get('_items'), 'id');
            this.set("_prefixTitles", _.pluck(items, 'prefixTitle'));
        },

        // check if the user is allowed to submit the question
        canSubmit: function() {
            return true;

        },

        // This is important for returning or showing the users answer
        // This should preserve the state of the users answers
        storeUserAnswer: function() {
            var userAnswer = [];
            var tempArray = [];
            var items = _.sortBy(this.get('_items'), 'id');
            var userSortedList = this.get('_sentenceListJqueryObject').children();
            this.set("userSortedList", userSortedList);
            _.each(userSortedList, function(item, index) {
                userAnswer.push(parseInt(item.dataset.itemid));
                tempArray.push(items[parseInt(item.dataset.itemid) - 1]);
            });
            this.set({
                '_items': tempArray,
                '_userAnswer': userAnswer
            });
        },

        isCorrect: function() {
            var userAnswer = this.get('_userAnswer'),
                itemsSorted = _.sortBy(this.get("_items"), 'id'),
                items = this.get("_items"),
                numberOfCorrectAnswers = 0,
                numberOfIncorrectAnswers = 0,
                isItemOnCorrectPlace = [];
            _.each(userAnswer, function(item, index) {
                if (_.contains(itemsSorted[index].position, item)) {
                    numberOfCorrectAnswers++;
                    isItemOnCorrectPlace.push(true);
                } else {
                    numberOfIncorrectAnswers++;
                    isItemOnCorrectPlace.push(false);
                }
            }, this);
            this.set('isItemOnCorrectPlace', isItemOnCorrectPlace);
            this.set('_numberOfCorrectAnswers', numberOfCorrectAnswers);
            this.set('_numberOfIncorrectAnswers', numberOfIncorrectAnswers);
            // Check if correct answers matches correct items and there are no incorrect selections
            var answeredCorrectly = (numberOfCorrectAnswers === items.length) && (numberOfIncorrectAnswers === 0);
            return answeredCorrectly;
        },

        // Sets the score based upon the questionWeight
        // Can be overwritten if the question needs to set the score in a different way
        setScore: function() {
            var questionWeight = this.get("_questionWeight");
            var answeredCorrectly = this.get('_isCorrect');
            var score = answeredCorrectly ? questionWeight : 0;
            this.set('_score', score);
        },
        isPartlyCorrect: function() {
            return this.get('_numberOfCorrectAnswers') >= this.get('_items').length / 2;
        },
        /*resetItems: function() {
            if(!this.get('_previousItems')) return;
            this.set('_items', this.get('_previousItems'));
        },*/
        resetUserAnswer: function() {
            this.set({_userAnswer: []});
        }
    });

    return SentenceOrderingModel;

});
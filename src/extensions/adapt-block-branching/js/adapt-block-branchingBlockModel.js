define([
  'coreJS/adapt',
  'coreModels/blockModel'
], function (Adapt, CoreBlockModel) {
  var ScenarioBranchingModel = {

    setupModel: function () {
      CoreBlockModel.prototype.setupModel.call(this);
    },

    setCompletionStatus: function () {
      this.set({
        '_isComplete': true,
        '_isInteractionComplete': true,
      });
    },

    // //PUBLIC
    isBranchingEnabled: function () {
      var o = this.get('_blockBranching');
      if (o && o._isEnabled && this.isConfigValid()) return true;
      return false;
    },

    getConfig: function () {
      return this.get('_blockBranching');
    },

    findBlockByScenarioId: function (scenarioId) {
      var ancestorModels = this.getAncestorModels();
      var page = ancestorModels[1];
      return _.find(page.findDescendantModels('blocks'), function (block) {
        if (block.get('_blockBranching')._scenarioId == parseInt(scenarioId, 10)) return true;
      });
    },

    revealBlock: function (answerNum) {
      var block = this.findBlockByScenarioId(this.get('_blockBranching')._userAnswer[answerNum]);
      block.set('_isHidden', false);
      block.set('_isAvailable', true);
      Adapt.trigger('pageLevelProgress:update');
      return block;
    },

    getQuestion: function () {
      var components = this.get('_children').models;
      var question = _.find(components, function (component) {
        return component.get('_isQuestionType');
      });
      if (question === undefined) return -1;
      return question;
    },
    // /**
    //  * Checks if the config object passed from JSON is valid
    //  */
    isConfigValid: function () {
      var config = this.getConfig(),
        id = this.get('_id');
      //
      var question = this.getQuestion();

      if (question === -1) {
        console.error('BranchingBlockModel', 'Missing question', id);
        return false;
      }

      if (question.get('_items').length != this.get('_blockBranching')._userAnswer.length) {
        console.error('BranchingBlockModel', 'Number of questions doesn\'t equal branching');
        return false;
      }

      return true;
    },

    isQuestionComplete: function () {
      var questionModel = this.getQuestionModel();
      return questionModel ? questionModel.get('_isComplete') : false;
    },

    getChosenAnswer: function () {
      var questionModel = this.getQuestionModel();
      return _.indexOf(questionModel.get('_userAnswer'), true);
    },
    /**
     * Returns Question model
     */
    getQuestionModel: function () {
      return this.getQuestion();
    }
  };
  return ScenarioBranchingModel;
});

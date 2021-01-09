define([
  'coreJS/adapt',
  'coreViews/articleView'
], function (Adapt, CoreArticleView) {
  var ScenarioBranchingView = {

    postRender: function () {
      CoreArticleView.prototype.postRender.call(this);
      if (!this.model.get('_blockBranching')._isEnabled) return;

      this.listenTo(Adapt, 'remove', this.onRemove);

      if (this.model.isBranchingEnabled()) {
        this.listenTo(this.model.getQuestionModel(), 'change:_isInteractionComplete', this.onQuestionComplete);
      }
    },

    onQuestionComplete: function (model) {
      var answer = _.indexOf(model.get('_userAnswer'), true);
      var blockModel = model.getParent();
      blockModel.revealBlock(answer);
    }
  };

  return ScenarioBranchingView;
});

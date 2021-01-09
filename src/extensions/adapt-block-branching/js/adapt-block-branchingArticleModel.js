define([
  'coreJS/adapt',
  'coreModels/articleModel'
], function (Adapt, ArticleModel) {
  var ScenarioBranchingArticleModel = {

    _setup: function () {
      if (this.get('_type') === 'menu') return;
      if (!this.get('_blockBranching') || !this.get('_blockBranching')._isEnabled) return;

      this.listenTo(Adapt, 'remove', this.onRemove);

      if (!this.get('_blockBranching')._resetOnRevisit) {
        this.listenTo(Adapt, 'articleView:postRender', this.hideFutureBlocks);
      } else {
        this.listenTo(Adapt, 'articleView:postRender', this.hideFutureBlocksStart);
        // this.listenTo(Adapt, 'pageView:postRender', this.startListener);
      }
    },

    startListener: function () {
      this.listenTo(Adapt, {
        'router:page': this._resetArticle
      });
    },

    hideFutureBlocksStart: function () {
      this.hideFutureBlocks(false);
    },

    findFirstQuestion: function (restoreProgress) {
      var context = this;
      return _.find(this.findDescendantModels('blocks'), function (block) {
        if (!block.get('_blockBranching') || !block.get('_blockBranching')._isEnabled) return false;
        return true;
      });
    },

    hideFutureBlocks: function (restoreProgress) {
      var getProgress = restoreProgress === false ? false : true;
      var firstQuestionBlock = this.findFirstQuestion(getProgress);
      var blockNth = firstQuestionBlock.get('_nthChild');
      var context = this;
      _.each(this.findDescendantModels('blocks'), function (block, index) {
        if (index <= blockNth && (!block.get('_blockBranching') || !block.get('_blockBranching')._isEnabled)) {
          context.showBlock(block);
        } else if (blockNth === index + 1) {
          context.showBlock(block);
          return;
        } else {
          context.hideBlock(block);
        }
      });
      this.showPath(firstQuestionBlock);
      Adapt.trigger('pageLevelProgress:update');
    },

    showPath: function (block) {
      if (!block.get('_blockBranching') || !block.get('_blockBranching')._isEnabled) {
        this.showBlock(block);
        return;
      }
      var answer = block.getChosenAnswer();
      if (answer === -1) return;
      var nextBlock = block.revealBlock(answer);
      this.showPath(nextBlock);
    },

    showBlock: function (block) {
      block.set('_isHidden', false);
      block.set('_isAvailable', true);
    },

    hideBlock: function (block) {
      block.set('_isHidden', true);
      block.set('_isAvailable', false);
    },

    showBlocks: function () {
      _.each(this.findDescendantModels('blocks'), function (block) {
        block.set('_isHidden', false);
        block.set('_isAvailable', true);
      });
      Adapt.trigger('pageLevelProgress:update');
    },

    _resetArticle: function () {
      var allModels = this.getAllDescendantModels();
      _.each(allModels, function (model) {
        model.set('_isComplete', false);
        model.set('_isResetOnRevisit', true);
        model.set('_isHidden', false);
        model.set('_isAvailable', true);
        model.set('_isInteractionComplete', false);
        model.set('_userAnswer', []);
      });
      // Adapt.trigger("pageLevelProgress:update");
    },

    onRemove: function () {
      this.showBlocks();
    }
  };
  return ScenarioBranchingArticleModel;
});

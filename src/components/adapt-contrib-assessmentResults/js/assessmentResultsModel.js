define([
  'core/js/adapt',
  'core/js/models/componentModel'
], function(Adapt, ComponentModel) {

  class AssessmentResultsModel extends ComponentModel {

    init(...args) {
      this.set('originalBody', this.get('body'));// save the original body text so we can restore it when the assessment is reset

      this.listenTo(Adapt, {
        'assessments:complete': this.onAssessmentComplete,
        'assessments:reset': this.onAssessmentReset
      });

      super.init(...args);
    }

    /**
     * Checks to see if the assessment was completed in a previous session or not
     */
    checkIfAssessmentComplete() {
      if (!Adapt.assessment || this.get('_assessmentId') === undefined) {
        return;
      }

      const assessmentModel = Adapt.assessment.get(this.get('_assessmentId'));
      if (!assessmentModel || assessmentModel.length === 0) return;

      const state = assessmentModel.getState();
      const isResetOnRevisit = assessmentModel.get('_assessment')._isResetOnRevisit;
      if (state.isComplete && (!state.allowResetIfPassed || !isResetOnRevisit)) {
        this.onAssessmentComplete(state);
        return;
      }

      this.setVisibility();
    }

    onAssessmentComplete(state) {
      if (this.get('_assessmentId') === undefined ||
          this.get('_assessmentId') != state.id) return;

      /*
      make shortcuts to some of the key properties in the state object so that
      content developers can just use {{attemptsLeft}} in json instead of {{state.attemptsLeft}}
      */
      this.set( {
        _state: state,
        attempts: state.attempts,
        attemptsSpent: state.attemptsSpent,
        attemptsLeft: state.attemptsLeft,
        score: state.score,
        scoreAsPercent: state.scoreAsPercent,
        maxScore: state.maxScore,
        isPass: state.isPass
      });

      this.setFeedbackBand(state);

      this.checkRetryEnabled(state);

      this.setFeedbackText();

      this.toggleVisibility(true);
    }

    setFeedbackBand(state) {
      const scoreProp = state.isPercentageBased ? 'scoreAsPercent' : 'score';
      const bands = _.sortBy(this.get('_bands'), '_score');

      for (let i = (bands.length - 1); i >= 0; i--) {
        const isScoreInBandRange =  (state[scoreProp] >= bands[i]._score);
        if (!isScoreInBandRange) continue;

        this.set('_feedbackBand', bands[i]);
        break;
      }
    }

    checkRetryEnabled(state) {
      const assessmentModel = Adapt.assessment.get(state.id);
      if (!assessmentModel.canResetInPage()) return false;

      const feedbackBand = this.get('_feedbackBand');
      const isRetryEnabled = (feedbackBand && feedbackBand._allowRetry) !== false;
      const isAttemptsLeft = (state.attemptsLeft > 0 || state.attemptsLeft === 'infinite');
      const showRetry = isRetryEnabled && isAttemptsLeft && (!state.isPass || state.allowResetIfPassed);

      this.set({
        _isRetryEnabled: showRetry,
        retryFeedback: showRetry ? this.get('_retry').feedback : ''
      });
    }

    setFeedbackText() {
      const feedbackBand = this.get('_feedbackBand');

      // ensure any handlebars expressions in the .feedback are handled...
      const feedback = feedbackBand ? Handlebars.compile(feedbackBand.feedback)(this.toJSON()) : '';

      this.set({
        feedback,
        body: this.get('_completionBody')
      });
    }

    setVisibility() {
      if (!Adapt.assessment) return;

      const isVisibleBeforeCompletion = this.get('_isVisibleBeforeCompletion') || false;
      const wasVisible = this.get('_isVisible');

      const assessmentModel = Adapt.assessment.get(this.get('_assessmentId'));
      if (!assessmentModel || assessmentModel.length === 0) return;

      const state = assessmentModel.getState();
      const isComplete = state.isComplete;
      const isAttemptInProgress = state.attemptInProgress;
      const attemptsSpent = state.attemptsSpent;
      const hasHadAttempt = (!isAttemptInProgress && attemptsSpent > 0);

      const isVisible = (isVisibleBeforeCompletion && !isComplete) || hasHadAttempt;

      if (!wasVisible && isVisible) isVisible = false;

      this.toggleVisibility(isVisible);
    }

    toggleVisibility (isVisible) {
      if (isVisible === undefined) {
        isVisible = !this.get('_isVisible');
      }

      this.set('_isVisible', isVisible, { pluginName: 'assessmentResults' });
    }

    checkCompletion() {
      if (this.get('_setCompletionOn') === 'pass' && !this.get('isPass')) {
        return;
      }

      this.setCompletionStatus();
    }

    /**
     * Handles resetting the component whenever its corresponding assessment is reset
     * The component can either inherit the assessment's reset type or define its own
     */
    onAssessmentReset(state) {
      if (this.get('_assessmentId') === undefined ||
          this.get('_assessmentId') != state.id) return;

      let resetType = this.get('_resetType');
      if (!resetType || resetType === 'inherit') {
        resetType = state.resetType || 'hard';// backwards compatibility - state.resetType was only added in assessment v2.3.0
      }
      this.reset(resetType, true);
    }

    reset(...args) {
      this.set({
        body: this.get('originalBody'),
        state: null,
        feedback: '',
        _feedbackBand: null,
        retryFeedback: '',
        _isRetryEnabled: false
      });

      super.reset(...args);
    }
  }

  return AssessmentResultsModel;

});

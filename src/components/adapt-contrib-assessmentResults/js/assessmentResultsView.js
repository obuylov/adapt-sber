define([
  'core/js/adapt',
  'core/js/views/componentView'
], function(Adapt, ComponentView) {

  class AssessmentResultsView extends ComponentView {

    events() {
      return {
        'click .js-assessment-retry-btn': 'onRetryClicked'
      }
    }

    preRender() {
      this.model.setLocking('_isVisible', false);

      this.listenTo(Adapt.parentView, 'preRemove', function () {
        this.model.unsetLocking('_isVisible');
      });

      this.listenTo(this.model, {
        'change:_feedbackBand': this.addClassesToArticle,
        'change:body': this.render
      });
    }

    postRender() {
      this.model.checkIfAssessmentComplete();
      this.setReadyStatus();
      this.setupInviewCompletion('.component__inner', this.model.checkCompletion.bind(this.model));
    }

    /**
     * Resets the state of the assessment and optionally redirects the user
     * back to the assessment for another attempt.
     */
    onRetryClicked() {
      const state = this.model.get('_state');

      Adapt.assessment.get(state.id).reset(null, wasReset => {
        if (!wasReset) {
          return;
        }
        if (this.model.get('_retry')._routeToAssessment === true) {
          Adapt.navigateToElement('.' + state.articleId);
        }
      });
    }

    /**
     * If there are classes specified for the feedback band, apply them to the containing article
     * This allows for custom styling based on the band the user's score falls into
     */
    addClassesToArticle(model, value) {
      if (!value || !value._classes) return;

      this.$el.parents('.article').addClass(value._classes);
    }

  }

  AssessmentResultsView.template = 'assessmentResults';

  return AssessmentResultsView;

});

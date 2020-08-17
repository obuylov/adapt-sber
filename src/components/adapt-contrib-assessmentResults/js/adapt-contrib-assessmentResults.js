define([
  'core/js/adapt',
  './assessmentResultsModel',
  './assessmentResultsView'
], function(Adapt, AssessmentResultsModel, AssessmentResultsView) {

  return Adapt.register("assessmentResults", {
    model: AssessmentResultsModel,
    view: AssessmentResultsView
  });

});

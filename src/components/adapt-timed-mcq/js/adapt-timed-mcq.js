define([
    'core/js/adapt',
    './timedMcqView',
    'core/js/models/questionModel'
], function(Adapt, TimedMcqView, QuestionModel) {

    return Adapt.register("timedMcq", {
        view: TimedMcqView,
        model: QuestionModel
    });

});
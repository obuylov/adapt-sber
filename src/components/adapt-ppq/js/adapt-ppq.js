define([
    'core/js/adapt',
    './ppqView',
    'core/js/models/questionModel'
], function(Adapt, PpqView, QuestionModel) {

    return Adapt.register("ppq", {
        view: PpqView,
        model: QuestionModel
    });

});
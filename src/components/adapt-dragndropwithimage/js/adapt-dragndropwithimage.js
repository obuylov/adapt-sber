define([
    'core/js/adapt',
    './dragndropwithimageView',
    'core/js/models/questionModel'
], function(Adapt, DragndropwithimageView, QuestionModel) {

    return Adapt.register("dragndropwithimage", {
        view: DragndropwithimageView,
        model: QuestionModel
    });

});
define(function(require) {
    var Adapt = require('core/js/adapt');
    var SentenceOrderingModel = require('./sentenceOrderingModel');
    var SentenceOrderingView = require('./sentenceOrderingView');

    return Adapt.register("sentenceOrdering", {
        view: SentenceOrderingView,
        model: SentenceOrderingModel
    });
});
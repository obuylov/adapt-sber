define([
  'core/js/adapt'
],function(Adapt) {

  Adapt.on('questionView:showFeedback', function(view) {

    var alertObject = {
      title: view.model.get('feedbackTitle'),
      body: view.model.get('feedbackMessage')
    };

    var attributes = {};
    var classes = [];

    if (view.model.has('_isCorrect')) {
      // Attach specific classes so that feedback can be styled.
      if (view.model.get('_isCorrect')) {
        classes.push('is-correct');
      } else {
        if (view.model.has('_isAtLeastOneCorrectSelection')) {
          // Partially correct feedback is an option.
          if (view.model.get('_isAtLeastOneCorrectSelection')) {
            classes.push('is-partially-correct');
          } else {
            classes.push('is-incorrect');
          }
        } else {
          classes.push('is-incorrect');
        }
      }
    }

    // Add the extension/component type which triggered this.
    if (view.model.has('_component')) {
      classes.push('is-component is-' + view.model.get('_component').toLowerCase());
    } else if (view.model.has('_extension')) {
      classes.push('is-extension is-' + view.model.get('_extension').toLowerCase());
    }

    // Add the _id property as attribute.
    attributes['data-adapt-id'] = view.model.get('_id');

    alertObject._classes = classes.join(' ');
    alertObject._attributes = attributes;

    Adapt.once('notify:closed', function() {
      Adapt.trigger('tutor:closed', view, alertObject);
    });

    Adapt.trigger('notify:popup', alertObject);

    Adapt.trigger('tutor:opened', view, alertObject);

  });

});

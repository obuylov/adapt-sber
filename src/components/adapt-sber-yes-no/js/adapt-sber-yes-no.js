define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function (Adapt, ComponentView, ComponentModel) {

  class SberYesNoView extends ComponentView {
    events() {
      return {
        'click .btn-text': 'checkAnswer',
      };
    }

    postRender() {
      this.setReadyStatus();
    }

    checkAnswer(event) {
      let el = event.target;
      // если пользователь нажал на "Да", то условие пройдет, и user_answered_yes будет true
      // а иначе, оно будет false
      let user_answered_yes = el.dataset.answer === 'yes';
      let feedback = this.model.get('_feedback');

      // если нужно выбрать, и нажали на кнопку "да", в условии будет true === true
      // если выбирать не нужно, а мы нажали на "да", в условии будет false === true
      // если нужно выбрать, а мы не нажали на "да", в условии будет true === false
      if (this.model.get('_shouldBeSelected') === user_answered_yes) {
        this.showFeedback(feedback._correct_title, feedback._correct, 'is-correct');
      } else {
        this.showFeedback(feedback._incorrect_title, feedback._incorrect, 'is-incorrect');
      }

      this.disableButtons();
      this.setCompletionStatus();
    }

    showFeedback(title, body, type) {
      Adapt.notify.popup({
        title,
        body,
        _classes: 'yes-no ' + type
      });
    }

    disableButtons() {
      this.$('button').each(function () {
        $(this).addClass('disabled');
        $(this).attr('disabled', 'disabled');
      });
    }
  }

  SberYesNoView.template = 'sber-yes-no';

  return Adapt.register('sber-yes-no', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: SberYesNoView
  });
});

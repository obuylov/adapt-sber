define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function (Adapt, ComponentView, ComponentModel) {

  class SberTxtMessages extends ComponentView {
    preRender() {
      this.model.set('_stage', -1);
    }

    postRender() {
      this.setReadyStatus();

      this.$('.sber-txtmessages-item').each(function () {
        let side = $(this).hasClass('right-message') ? 1 : -1;
        $(this).css('transform', 'translateX(' + $(this).parent()[0].offsetWidth * side + 'px)');
      });

      let self = this;
      this.started = false;

      this.$('.sber-txtmessages-widget').on('inview', function (event, isInView) {
        if (!isInView || self.started) {
          return;
        }

        self.started = true;
        // whole part of element is visible
        if (self.model.get('_isComplete')) {
          console.log('!!already completed!!');
          self.model.set('offsetTime', 100);
          self.fireMessage();
          return;
        }

        self.fireMessage();
      });
    }

    nextMessage(stage) {
      stage++;

      this.$('.sber-txtmessages-item').eq(stage).addClass('open');
      this.model.set('_stage', stage);
      return stage;
    }

    fireMessage() {
      let elements = this.$('.sber-txtmessages-item').length;
      let stage = this.model.get('_stage');

      if (stage < elements) {
        if (stage === -1) {
          setTimeout(function () {
            stage = this.nextMessage(stage);
          }.bind(this), 500);
        }

        let mainInterval = setInterval(function () {
          if (stage < elements) {
            stage = this.nextMessage(stage);

            if (stage >= elements)
              this.onComplete();
          } else {
            this.onComplete();
            clearInterval(mainInterval);
          }
        }.bind(this), parseInt(this.model.get('offsetTime')));

        Adapt.on('remove', function () {
          clearInterval(mainInterval);
        });
      }
    }

    onComplete() {
      this.setCompletionStatus();
    }
  }

  SberTxtMessages.template = 'sber-txtmessages';

  return Adapt.register('sber-txtmessages', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: SberTxtMessages
  });
});

define(function (require) {
  var ComponentView = require('coreViews/componentView');
  var Adapt = require('coreJS/adapt');

  var TxtMessages = ComponentView.extend({
    preRender: function () {
      this.model.set("_stage", -1);
    },

    postRender: function () {
      this.setReadyStatus();

      let self = this;

      this.$(".sber-txtmessages-item").each(function (){
        let side = $(this).hasClass('right-message') ? 1 : -1;
        $(this).css('transform', 'translateX(' + $(this).parent()[0].offsetWidth * side + "px)");
      });

      this.$('.sber-txtmessages-widget').on('inview', function (event, isInView) {
        if (!isInView)
          return;
        // whole part of element is visible
        if (self.model.get('_isComplete')) {
          self.model.set('offsetTime', 100);
          self.fireMessage();
          return;
        }

        if (self.model.get("waitFor")) {
          let modelId = self.model.get("waitFor");
          if (Adapt.components._byAdaptID[modelId][0].attributes._isComplete)
            self.fireMessage();
        } else {
          self.fireMessage();
        }
      });

      if (this.model.get('_autoCompleted'))
        this.setCompletionStatus();
    },

    nextMessage: function(stage) {
      stage++;

      this.$(".sber-txtmessages-item").eq(stage).addClass('open');
      this.model.set('_stage', stage);
      return stage;
    },

    fireMessage: function() {
      let elements = this.$(".sber-txtmessages-item").length;
      let stage = this.model.get('_stage');

      if (stage < elements) {
        if (stage === -1) {
          setTimeout(function() {
            stage = this.nextMessage(stage);
          }.bind(this), 500)
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

        Adapt.on("remove", function() {
          clearInterval(mainInterval);
        })
      }

      if (!this.model.get("_isComplete") && stage >= elements)
        this.onComplete();
    },

    onComplete: function () {
      this.setCompletionStatus();
    }
  });

  Adapt.register('sber-txtmessages', TxtMessages);

  return TxtMessages;

});

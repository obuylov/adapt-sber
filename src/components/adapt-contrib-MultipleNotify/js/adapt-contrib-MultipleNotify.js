define([
    'core/js/models/componentModel', // add this
    'core/js/views/componentView', // change these to use proper paths
    'core/js/adapt'
], function(ComponentModel, ComponentView, Adapt) {

    var TextMultipleNotify = ComponentView.extend({

        template: "text",
        preRender: function() {
            this.listenTo(Adapt, 'device:changed', this.resizeImage);

            // Checks to see if the graphic should be reset on revisit
            this.checkIfResetOnRevisit();
        },

        postRender: function() {
            this.resizeImage(Adapt.device.screenSize, true);

            ComponentView.prototype.postRender.apply(this);

        },

        events: function() {
            return Adapt.device.touch == true ? {
                'inview': 'inview',
                'touchmove .multiplenotify__body-inner [data-index]' : 'completePopup',
                'touchmove .textnotify-bottom-text [data-index]' : 'completePopup',
                'click .component__inner #mybutton' : 'mynotifyButton'
            } : {
                'inview': 'inview',
                'mouseout .multiplenotify__body-inner [data-index]' : 'completePopup',
                'mouseout .textnotify-bottom-text [data-index]' : 'completePopup',
                'keydown .multiplenotify__body-inner [data-index]' : 'completePopup',
                'keydown .textnotify-bottom-text [data-index]' : 'completePopup',
                'click .component__inner #mybutton' : 'mynotifyButton'
            }
        },

        // Used to check if the graphic should reset on revisit
        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {

            if (visible) {

                if (visiblePartY === 'top') {
                    this._isVisibleTop = true;
                } else if (visiblePartY === 'bottom') {
                    this._isVisibleBottom = true;
                } else {
                    this._isVisibleTop = true;
                    this._isVisibleBottom = true;
                }

                if (this._isVisibleTop && this._isVisibleBottom) {
                    this.$('.component__widget').off('inview');
                    this.completePopup();
                }

            }
        },

        remove: function() {

            // Remove any 'inview' listener attached.
            this.$('.component__widget').off('inview');

            ComponentView.prototype.remove.apply(this, arguments);
            
        },

        resizeImage: function(width, setupInView) {
            var imageWidth = width === 'medium' ? 'small' : width;
            var imageSrc = (this.model.get('_graphic')) ? this.model.get('_graphic')[imageWidth] : '';
            this.$('.graphic__widget img').attr('src', imageSrc);

            this.$('.graphic__widget').imageready(_.bind(function() {
                this.setReadyStatus();

                if (setupInView) {
                    // Bind 'inview' once the image is ready.
                    this.$('.component__widget').on('inview', _.bind(this.inview, this));
                }
            }, this));
        },

        completePopup: function () {
            var getcurrentid = this.model.get('_id');
            var howmanymypopup = this.$("[data-index]").length;
            var howmanyclicked = this.$(".popcount").length;

            if (howmanymypopup === 0 && howmanyclicked === 0 ) {
                //Do nothing as it is zero
            } else if (howmanymypopup === howmanyclicked ) {
                this.setCompletionStatus();
            } 

            $('.accessibility .' + getcurrentid + ' .multiplenotify__body-inner').removeAttr('tabindex');
            $('.accessibility .' + getcurrentid + ' .multiplenotify__body-inner p').attr('tabindex','0');
            $('.accessibility .' + getcurrentid + ' .textnotify-bottom-text').removeAttr('tabindex');
            $('.accessibility .' + getcurrentid + ' .textnotify-bottom-text p').attr('tabindex','0');
        },

        mynotifyButton: function (event) {
            event.preventDefault();

            this.model.set('_active', false);

            var getcurrentid = this.model.get('_id');
            var bodyText3 = this.model.get("_buttonData").button.message;
            var titleText3 = this.model.get("_buttonData").button.title;
            var confirmText3 = this.model.get("_buttonData").button.confirmButton;

            var buttonObject = {
                title: titleText3,
                body: bodyText3,
                confirmText: confirmText3,
                _classes: ' txtbutnotify'
            };

            Adapt.trigger('notify:alert', buttonObject);
            this.setCompletionStatus();
            $('.accessibility .' + getcurrentid + ' .multiplenotify__body-inner').removeAttr('tabindex');
            $('.accessibility .' + getcurrentid + ' button').attr('tabindex','0');
        }

    });

    //Adapt.register('MultipleNotify', TextMultipleNotify);
    Adapt.register('MultipleNotify', {
      model: ComponentModel.extend({}), // register the model, it should be an extension of ComponentModel, an empty extension is fine
      view: TextMultipleNotify
    });
    
    return TextMultipleNotify;
});

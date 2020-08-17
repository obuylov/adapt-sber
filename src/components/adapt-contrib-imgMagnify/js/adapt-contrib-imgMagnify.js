define([
    'core/js/models/componentModel', // add this
    'core/js/views/componentView', // change these to use proper paths
    'core/js/adapt',
    'libraries/jquery.magnify',
    'libraries/jquery.magnifymobile'
],function(ComponentModel, ComponentView, Adapt, magnify, magnifymobile) {
    'use strict';

    var ImgMagnify = ComponentView.extend({

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
                'inview':                       'inview',
                'click .imgmagnify__body-inner #mypopup' : 'mynotifyPopup',
                'click .imgmagnify__body-inner #myalert' : 'mynotifyAlert',
                'click .imgmagnify__body-inner #myexternalink' : 'myexternaLink',
                'click .component__inner #mybutton' : 'mynotifyButton',
                'click .imgMagnify-bottom-text #mypopup' : 'mynotifyPopup',
                'click .imgMagnify-bottom-text #myalert' : 'mynotifyAlert',
                'click .imgMagnify-bottom-text #myexternalink' : 'myexternaLink',
                'touchmove .enableMagnify' : 'enabledZoom'
            } : {
                'inview':                       'inview',
                'click .imgmagnify__body-inner #mypopup' : 'mynotifyPopup',
                'click .imgmagnify__body-inner #myalert' : 'mynotifyAlert',
                'click .imgmagnify__body-inner #myexternalink' : 'myexternaLink',
                'click .component__inner #mybutton' : 'mynotifyButton',
                'click .imgMagnify-bottom-text #mypopup' : 'mynotifyPopup',
                'click .imgMagnify-bottom-text #myalert' : 'mynotifyAlert',
                'click .imgMagnify-bottom-text #myexternalink' : 'myexternaLink',
                'mousemove .enableMagnify' : 'enabledZoom',
                'keydown .enableMagnify' : 'accessibleZoom'
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

        mynotifyPopup: function (event) {
            event.preventDefault();

            this.model.set('_active', false);

            var getcurrentid = this.model.get('_id');
            var bodyText = this.model.get("_popupData").mypopup.message;
            var titleText = this.model.get("_popupData").mypopup.title;

            var popupObject = {
                title: titleText,
                body: bodyText,
                _classes: ' txtpopnotify'
            };

            Adapt.trigger('notify:popup', popupObject);
            this.setCompletionStatus();
            $('.accessibility .' + getcurrentid + ' .imgmagnify__body-inner').removeAttr('tabindex');
            $('.accessibility .' + getcurrentid + ' .imgmagnify__body-inner p').attr('tabindex','0');
        },

        mynotifyAlert: function (event) {
            event.preventDefault();

            this.model.set('_active', false);

            var getcurrentid = this.model.get('_id');
            var bodyText2 = this.model.get("_alertData").myalert.message;
            var titleText2 = this.model.get("_alertData").myalert.title;
            var confirmText2 = this.model.get("_alertData").myalert.confirmButton;

            var alertObject = {
                title: titleText2,
                body: bodyText2,
                confirmText: confirmText2,
                _classes: ' txtalertnotify'
            };

            Adapt.trigger('notify:alert', alertObject);
            this.setCompletionStatus();
            $('.accessibility .' + getcurrentid + ' .imgmagnify__body-inner').removeAttr('tabindex');
            $('.accessibility .' + getcurrentid + ' .imgmagnify__body-inner p').attr('tabindex','0');
        },
        
        myexternaLink: function (event) {
            event.preventDefault();

            this.model.set('_active', false);

            var getcurrentid = this.model.get('_id');
            this.setCompletionStatus();
            $('.accessibility .' + getcurrentid + ' .imgmagnify__body-inner').removeAttr('tabindex');
            $('.accessibility .' + getcurrentid + ' .imgmagnify__body-inner p').attr('tabindex','0');
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
            $('.accessibility .' + getcurrentid + ' .imgmagnify__body-inner').removeAttr('tabindex');
            $('.accessibility .' + getcurrentid + ' .imgmagnify__body-inner p').attr('tabindex','0');
        },

        enabledZoom: function (event) {
            this.setCompletionStatus();
        },

        accessibleZoom: function (event) {
            var getcurrentid = this.model.get('_id');
            $('.accessibility .' + getcurrentid + ' .enableMagnify').focus(this.setCompletionStatus());
        }

    });

    //Adapt.register('imgMagnify', ImgMagnify);
    Adapt.register('imgMagnify', {
      model: ComponentModel.extend({}), // register the model, it should be an extension of ComponentModel, an empty extension is fine
      view: ImgMagnify
    });

    return ImgMagnify;
});

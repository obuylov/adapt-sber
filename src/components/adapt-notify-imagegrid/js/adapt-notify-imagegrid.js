
define([
    'core/js/models/componentModel', // add this
    'core/js/views/componentView', // change these to use proper paths
    'core/js/adapt'
], function(ComponentModel, ComponentView, Adapt) {

    var Notifyimagegrid = ComponentView.extend({

        preRender: function () {
            this.listenTo(Adapt, 'device:changed', this.resizeControl);

            this.setDeviceSize();
            this.checkIfResetOnRevisit();
        },

        events: function() {
            return Adapt.device.touch == true ? {
                'inview': 'inview',
                'click button' : 'gridnotifyPopup'
            } : {
                'inview': 'inview',
                'mouseover button' : 'gridnotifyPopup'
            }
        },

        setDeviceSize: function() {
            if (Adapt.device.screenSize === 'large') {
                this.$el.addClass('desktop').removeClass('mobile');
                this.model.set('_isDesktop', true);
            } else {
                this.$el.addClass('mobile').removeClass('desktop');
                this.model.set('_isDesktop', false);
            }
        },

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
                    //this.setCompletionStatus();
                    this.completePopup();
                }

            }
        },

        remove: function() {
          // Remove any 'inview' listener attached.
          this.$('.component__widget').off('inview');

          ComponentView.prototype.remove.apply(this, arguments);
        },

        postRender: function() {
            this.setUpColumns();

            this.$('.notify-imagegrid__widget').imageready(_.bind(function() {
                this.setReadyStatus();

                // Bind 'inview' once the image is ready.
                this.$('.component__widget').on('inview', _.bind(this.inview, this));

            }, this));

            this.reverseDirection();
            this.constrainHeight();
        },

        resizeControl: function() {
            this.setDeviceSize();
            this.render();
        },

        reverseDirection: function() {

            if (this.model.get('_reverseDirection') && this.model.get('_isEnabled')) {
                this.$(".notify-imagegrid-grid-inner").addClass("reverserow");
            }
        },

        constrainHeight: function() {
            var rowheight = this.model.get('_gridrowHeight')._heightAmount;

            if ( this.model.get('_gridrowHeight')._constrainHeight && this.model.get('_isEnabled')) {
                this.$(".notify-imagegrid-item-image img").addClass("constrainimg");
                this.$(".constrainimg").css({"max-height": rowheight + 'px',"min-height": rowheight + 'px'});
            }
        },

        setUpColumns: function() {
            var columns = this.model.get('_columns');

            if (columns && Adapt.device.screenSize === 'large') {
                var griditempercent = (100 / columns);
                var gridminuspad = (5 / columns);
                this.$('.notify-imagegrid-grid-item').css('width', griditempercent + '%');
            }
        },

        completePopup: function () {
            var mycurrentid = '.' + this.model.get('_id');
            var howmanygridimg = $(mycurrentid + " .howmanygrid").length;
            var howmanystr = $(mycurrentid + " .totalgrid").text();
            
            if (howmanystr >= howmanygridimg ) {
                this.setCompletionStatus();
            } else if (howmanygridimg == 0) {
                this.setCompletionStatus();
            }
        }, 

        gridnotifyPopup: function (event) {
            event.preventDefault();

            this.model.set('_active', false);

            var mycurrentid = '.' + this.model.get('_id');
            var howmanygridimg = $(mycurrentid + " .howmanygrid").length;
            var howmanystr = $(mycurrentid + " .totalgrid").text();
            
            if (howmanystr >= howmanygridimg ) {
                this.setCompletionStatus();
            } else if (howmanygridimg == 0) {
                this.setCompletionStatus();
            }
        }

    },{
        template: "notify-imagegrid"
    });

    //return Adapt.register("notify-imagegrid", Notifyimagegrid);
    Adapt.register('notify-imagegrid', {
      model: ComponentModel.extend({}), // register the model, it should be an extension of ComponentModel, an empty extension is fine
      view: Notifyimagegrid
    });

    return Notifyimagegrid;
    
});

define([
    'core/js/models/componentModel', // add this
    'core/js/views/componentView', // change these to use proper paths
    'core/js/adapt'
], function(ComponentModel, ComponentView, Adapt) {

    var Beforeafter = ComponentView.extend({

        preRender: function() {
            this.listenTo(Adapt, 'device:changed', this.resizeImage);

            // Checks to see if the beforeafter should be reset on revisit
            this.checkIfResetOnRevisit();
        },

        postRender: function() {
            this.resizeImage(Adapt.device.screenSize, true);
            this.beforeAfterReveal();
        },

         events: function() {
            return Adapt.device.touch == true ? {
                'inview': 'inview',
                'touchmove .handle' : 'sliderHandle'
            } : {
                'inview': 'inview',
                'mousedown .handle' : 'sliderHandle',
                'keydown .handle' : 'sliderHandle'
            }
        },

        // Used to check if the beforeafter should reset on revisit
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
                }

            }
        },

        sliderHandle: function (event) {
            this.setCompletionStatus();
        },

        remove: function() {
          // Remove any 'inview' listener attached.
          this.$('.component__widget').off('inview');

          ComponentView.prototype.remove.apply(this, arguments);
        },

        resizeImage: function(width, setupInView) {
            var imageWidth = width === 'medium' ? 'small' : width;
            var imageSrc = (this.model.get('_beforeafter')) ? this.model.get('_beforeafter')[imageWidth] : '';
            this.$('.beforeafter__widget img').attr('src', imageSrc);

            this.$('.beforeafter__widget').imageready(_.bind(function() {
                this.setReadyStatus();

                if (setupInView) {
                    // Bind 'inview' once the image is ready.
                    this.$('.component__widget').on('inview', _.bind(this.inview, this));
                }
            }, this));
        },

        beforeAfterReveal: function() {
          $('.beforeafter__widget').each(function () {
            var cur = $(this);
            // Adjust the slider
            var width = cur.width() + 'px';
            cur.find('.resize img').css({'width': width, 'min-width': width});
            // Bind dragging events
            drags(cur.find('.handle'), cur.find('.resize'), cur);
          });

            // Update sliders on resize. 
            // Because we all do this: i.imgur.com/YkbaV.gif
            $(window).resize(function () {
              $('.beforeafter__widget').each(function () {
                var cur = $(this);
                var width = cur.width() + 'px';
                cur.find('.resize img').css({'width': width, 'min-width': width});
              });
            });

            function drags(dragElement, resizeElement, container) {

              // Initialize the dragging event on mousedown.
              dragElement.on('mousedown touchstart', function (e) {

                dragElement.addClass('draggable');
                resizeElement.addClass('resizable');


                  // Check if it's a mouse or touch event and pass along the correct value
                  var startX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;

                  // Get the initial position
                  var dragWidth = dragElement.outerWidth(),
                      posX = dragElement.offset().left + dragWidth - startX,
                      containerOffset = container.offset().left,
                      containerWidth = container.outerWidth();

                  // Set limits
                  var minLeft = containerOffset + 0;
                  var maxLeft = containerOffset + containerWidth - dragWidth - 0;

                  // Calculate the dragging distance on mousemove.
                  dragElement.parents().on("mousemove", function (e) {

                      if (e.pageX >= 1) {
                          // Check if it's a mouse or touch event and pass along the correct value
                          var moveX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;

                          var leftValue = moveX + posX - dragWidth;

                    // Prevent going off limits
                    if (leftValue <= minLeft) {
                      leftValue = minLeft;
                    } else if (leftValue >= maxLeft) {
                      leftValue = maxLeft;
                    }

                    // Translate the handle's left value to masked divs width.
                          var widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + '%';

                    // Set the new values for the slider and the handle. 
                    // Bind mouseup events to stop dragging.
                    $('.draggable').css('left', widthValue).on('mouseup', function () {
                      $(this).removeClass('draggable');
                      resizeElement.removeClass('resizable');
                    });
                    $('.resizable').css('width', widthValue);
                  }else{
                    //Mouse position at 0 do nothing
                  }

                }).on('mouseup', function () {
                  dragElement.removeClass('draggable');
                  resizeElement.removeClass('resizable');
                });
                // Calculate the dragging distance on mousemove.
                dragElement.parents().on("touchmove", function (e) {

                    // Check if it's a mouse or touch event and pass along the correct value
                    var moveX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;

                    var leftValue = moveX + posX - dragWidth;

                    // Prevent going off limits
                    if (leftValue <= minLeft) {
                      leftValue = minLeft;
                    } else if (leftValue >= maxLeft) {
                      leftValue = maxLeft;
                    }

                    // Translate the handle's left value to masked divs width.
                    var widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + '%';

                    // Set the new values for the slider and the handle. 
                    // Bind mouseup events to stop dragging.
                    $('.draggable').css('left', widthValue).on('touchend touchcancel', function () {
                      $(this).removeClass('draggable');
                      resizeElement.removeClass('resizable');
                    });
                    $('.resizable').css('width', widthValue);

                }).on('touchend touchcancel', function () {
                  dragElement.removeClass('draggable');
                  resizeElement.removeClass('resizable');
                });
                e.preventDefault();
              }).on('mouseup touchend touchcancel', function (e) {
                dragElement.removeClass('draggable');
                resizeElement.removeClass('resizable');
              });
            }

            ///SCRIPT BELOW IS FOR ACCESSIBILITY
            $('.beforeafter__widget').each(function () {
                var whereisit = ( 100 * parseFloat($('.resize').css('width')) / parseFloat($('.resize').parent().css('width')) );
                var strokeCount = whereisit;
                var cur = $(this);
                
                $(function(){
                    
                    cur.find('.handle').keyup(function(e){

                      switch(e.which) {

                        case 37: // left
                        if ((strokeCount >= 0)) {
                          cur.find('.handle').css('left', (--strokeCount)-1+'%'),
                          cur.find('.resize').css('width', (--strokeCount)+'%');
                        } else {
                          cur.find('.handle').css('left', '1%'),
                          cur.find('.resize').css('width', '1%');
                        };
                        break;

                        case 39: // right
                        if ((strokeCount <= 100)) {
                          cur.find('.handle').css('left', (++strokeCount)+1+'%'),
                          cur.find('.resize').css('width', (++strokeCount)+'%');
                        } else {
                          cur.find('.handle').css('left', '100%'),
                          cur.find('.resize').css('width', '100%');
                        };
                        break;

                        default: return; // exit this handler for other keys
                     }
                     e.preventDefault(); // prevent the default action (scroll / move caret)
                    });
                });
            });
        }
    });

    //Adapt.register('beforeafter', Beforeafter);
    Adapt.register('beforeafter', {
      model: ComponentModel.extend({}), // register the model, it should be an extension of ComponentModel, an empty extension is fine
      view: Beforeafter
    });

    return Beforeafter;

});

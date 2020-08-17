define([
    'core/js/adapt',
    'core/js/views/questionView',
    './draggabilly',
    './round'
], function(Adapt, QuestionView, Draggabilly, round) {

    var PpqView = QuestionView.extend({

        events: {
            "click .ppq-pinboard":"onPinboardClicked"
        },

        render:function() {
            QuestionView.prototype.render.apply(this, arguments);

            // unsafe to run in postRender due to QuestionView deferreds
            this.setupPinboardImage(Adapt.device.screenSize);
            this.setupCorrectZones();
            this.addPinViews();

            if (this.model.get('_isSubmitted')) this.showMarking();

            this.checkCompatibility();

            return this;
        },

        addPinViews:function() {
            var userAnswer = _.extend([], this.model.get('_userAnswer'));
            var isDesktop = Adapt.device.screenSize != 'small';

            // restore positions if submitted
            if (this.model.get('_isSubmitted') && userAnswer.length > 0) {
                userAnswer.shift();
            }

            // pre-population simplifies code (particularly hide/show user answer)
            for (var i=0, l=this.model.get('_maxSelection'); i<l; i++) {
                var pin = new PinView();
                pin.setPosition(userAnswer[i*2]/100, userAnswer[i*2+1]/100);
                this._pinViews.push(pin);
                this.$('.ppq-boundary').append(pin.$el);
            }
        },

        resetQuestionOnRevisit: function(type) {
            this.setAllItemsEnabled(true);
            this.resetQuestion();
        },

        setupQuestion:function() {
            if (!this.model.has('_minSelection')) this.model.set('_minSelection', 1);

            this.model.set('_maxSelection', Math.max(this.model.get('_maxSelection') || 0, this.model.get('_items').length));

            this._pinViews = [];

            this.model.restoreUserAnswers();
        },

        setupPinboardImage:function(screenSize) {
            var imageObj = screenSize == 'small' ? this.model.get('_pinboardMobile') : this.model.get('_pinboardDesktop');
            if (imageObj) {
                this.$('img.ppq-pinboard').attr({
                    'src':imageObj.src,
                    'alt':imageObj.alt,
                    'title':imageObj.title
                });
            }
        },

        setupCorrectZones:function() {
            var props, isDesktop = Adapt.device.screenSize != 'small';

            _.each(this.model.get('_items'), function(item, index) {
                props = isDesktop ? item.desktop : item.mobile;
                this.$('.ppq-correct-zone').eq(index).css({left:props.left+'%', top:props.top+'%', width:props.width+'%', height:props.height+'%'});
            }, this);
        },

        restoreUserAnswers:function() {
            if (!this.model.get("_isSubmitted")) return;

            this.setQuestionAsSubmitted();
            this.markQuestion();
            this.setScore();
            this.showMarking();
            this.setupFeedback();
        },

        disableQuestion: function() {
            this.setAllItemsEnabled(false);
        },

        enableQuestion: function() {
            this.setAllItemsEnabled(true);
        },

        setAllItemsEnabled: function(isEnabled) {
            _.each(this._pinViews, function(pin) {
                if (pin.dragObj) {
                    isEnabled ? pin.dragObj.enable() : pin.dragObj.disable();
                }
            });
        },

        updatePinPositions:function() {
            var $pinboard = this.$('.ppq-pinboard');
            var boardw = $pinboard.width();
            var boardh = $pinboard.height();
            var pin, pos;

            for (var i=0, l=this._pinViews.length; i<l; i++) {
                pin = this._pinViews[i];
                pos = pin.getPosition();

                if (pos) {
                    pin.$el.css({
                        left:boardw * pos.percentX/100 - pin.$el.width() / 2,
                        top:boardh * pos.percentY/100 - pin.$el.height()
                    });
                }
            }
        },

        onQuestionRendered:function() {
                var $pinboardContainerInner = this.$('.ppq-pinboard-container-inner');

                $pinboardContainerInner.imageready(_.bind(function() {

                for (var i=0, l=this._pinViews.length; i<l; i++) {
                    var pin = this._pinViews[i];
                    
                    pin.dragObj = new Draggabilly(pin.el, {
                        containment: $pinboardContainerInner
                    });

                    if (!this.model.get('_isEnabled')) pin.dragObj.disable();

                    pin.dragObj.on('dragStart', _.bind(this.onDragStart, this, pin));
                    pin.dragObj.on('dragEnd',  _.bind(this.onDragEnd, this, pin));
                }

                this.setReadyStatus();
            }, this));

            this.listenTo(Adapt, 'device:changed', this.onDeviceChanged);
            this.listenTo(Adapt, 'device:resize', this.updatePinPositions);
        },

        onDeviceChanged:function(screenSize) {
            this.setupPinboardImage(screenSize);

            this.setupCorrectZones();

            if (this.model.get('_resetPinsOnPinboardChange')) {
                if (this.model.get('_isSubmitted')) {
                    this.checkCompatibility();
                    this.$('.ppq-other-device').toggleClass('display-none', !this.model.get('_showOtherDeviceCompletionMessage'));
                    this.$('.ppq-pinboard-container, .buttons').toggleClass('display-none', this.model.get('_showOtherDeviceCompletionMessage'));
                } else {
                    this.resetPins();
                }
            } else {
                this.updatePinPositions();
            }
        },

        checkCompatibility:function() {
            var isSubmitted = this.model.get('_isSubmitted');

            if (!isSubmitted) return;

            var isDesktop = Adapt.device.screenSize != 'small',
                isUserAnswerDesktop = this.model.get('_userAnswer')[0] === 1,
                resetPinsOnPinboardChange = this.model.get('_resetPinsOnPinboardChange');

            if (isSubmitted && isDesktop != isUserAnswerDesktop && resetPinsOnPinboardChange) {
                this.model.set('_showOtherDeviceCompletionMessage', true);
            } else {
                this.model.set('_showOtherDeviceCompletionMessage', false);
            }
        },

        getNextUnusedPin:function() {
            for (var i=0, l=this._pinViews.length; i<l; i++) {
                if (!this._pinViews[i].$el.is('.in-use')) return this._pinViews[i];
            }
            return null;
        },

        onPinboardClicked: function(event) {
            event.preventDefault();

            var pin = this.getNextUnusedPin();

            if (!pin || this.$('.component__widget').is('.disabled')) return;

            var offset = this.$('.ppq-pinboard').offset();
            var $pinboard = this.$('.ppq-pinboard');
            var boardw = $pinboard.width();
            var boardh = $pinboard.height();
            var x = event.pageX-offset.left;
            var y = event.pageY-offset.top;
            var percentX = 100 * x / boardw;
            var percentY = 100 * y / boardh;

            //this.$('.ppq-debug').html((percentX)+','+(percentY));
            pin.$el.css({
                left:x - pin.$el.width() / 2,
                top:y - pin.$el.height()
            });
            pin.setPosition(percentX, percentY);
        },

        canSubmit: function() {
            return this.$(".ppq-pin.in-use").length >= this.model.get("_minSelection");
        },

        storeUserAnswer:function() {
            var userAnswer = [Adapt.device.screenSize == 'small' ? 0 : 1];
            var pin, pos;

            for (var i=0, l=this._pinViews.length; i<l; i++) {
                pin = this._pinViews[i];
                pos = pin.getPosition();

                if (pos) userAnswer.push(round(pos.percentX*100, -2), round(pos.percentY*100, -2));
            }

            this.model.set('_userAnswer', userAnswer);
        }, 

        isCorrect:function() {
            var items = this.model.get('_items');
            var userAnswer = this.model.get('_userAnswer');
            var isDesktop = userAnswer[0];
            var map = new Array(items.length);

            for (var i=1, l=userAnswer.length; i<l; i+=2) {
                var itemIndex = this.getIndexOfItem(userAnswer[i]/100, userAnswer[i+1]/100, isDesktop);
                if (itemIndex != -1) map[itemIndex] = true;
            }

            this.model.get('_isAtLeastOneCorrectSelection', _.indexOf(map, true) != -1);

            return _.compact(map).length == items.length;
        },

        isPartlyCorrect: function() {
            return this.model.get('_isAtLeastOneCorrectSelection');
        },

        setScore: function() {
            var questionWeight = this.model.get("_questionWeight");
            var answeredCorrectly = this.model.get('_isCorrect');
            var score = answeredCorrectly ? questionWeight : 0;
            this.model.set('_score', score);
        },

        showMarking: function() {
            if (!this.model.get('_canShowMarking')) return;

            var map = new Array(this.model.get('_items').length);

            for (var i=0, l=this._pinViews.length; i<l; i++) {
                var pin = this._pinViews[i];
                var pos = pin.getPosition();

                if (pos) {
                    var itemIndex = this.getIndexOfItem(pos.percentX, pos.percentY);

                    // if pin inside item mark as correct, but mark any others in same item as incorrect
                    if (itemIndex != -1 && !map[itemIndex]) {
                        map[itemIndex] = true;
                        pin.$el.addClass('correct').removeClass('incorrect');
                    } else {
                        pin.$el.addClass('incorrect').removeClass('correct');
                    }
                }
            }
        },

        resetUserAnswer: function() {
            this.model.set({_userAnswer: []});
        },

        resetQuestion: function() {
            this.resetPins();
            this.model.set({_isAtLeastOneCorrectSelection: false});
        },

        resetPins: function() {
            _.each(this._pinViews, function(pin) {
                pin.reset();
            });
        },

        showCorrectAnswer: function() {
            var isDesktop = Adapt.device.screenSize != 'small',
                items = this.model.get('_items'),
                map = new Array(this.model.get('_items').length),
                free = [],
                i = 0, l = 0, pin, zone;

            // map first correctly placed pin to item and log other pins as free for moving
            _.each(this._pinViews, function(pin, pinIndex) {
                var pos = pin.getPosition();
                if (pos) {
                    var itemIndex = this.getIndexOfItem(pos.percentX, pos.percentY);
                    if (itemIndex != -1 && !map[itemIndex]) map[itemIndex] = true;
                    else free.push(pin);
                }
            }, this);

            // ensure every item has a pin
            for (l=items.length; i<l; i++) {
                if (!map[i]) {
                    zone = isDesktop ? items[i].desktop : items[i].mobile;
                    pin = free.shift();
                    pin.setPosition(zone.left+zone.width/2, zone.top+zone.height/2);
                }
            }

            // remove any superfluous pins
            for (i=l, l=this._pinViews.length; i<l; i++) {
                pin = this._pinViews[i];
                pin.reset();
            }

            this.updatePinPositions();
        },

        hideCorrectAnswer:function() {
            var userAnswer = this.model.get('_userAnswer');
            var i = 1, l = 0, pin;

            for (l=userAnswer.length; i<l; i+=2) {
                pin = this._pinViews[(i-1) >> 1];
                pin.setPosition(userAnswer[i]/100, userAnswer[i+1]/100);
            }
            for (i=userAnswer.length-1 >> 1, l=this._pinViews.length; i<l; i++) {
                pin = this._pinViews[i];
                pin.reset();
            }

            this.updatePinPositions();
        },

        // given a coordinate return the index of the containing item if found
        getIndexOfItem:function(x, y, desktop) {
            var isDesktop = _.isBoolean(desktop) ? desktop : Adapt.device.screenSize != 'small';
            var items = this.model.get('_items');
            for (var i=0, l=items.length; i<l; i++) {
                var zone = isDesktop ? items[i].desktop : items[i].mobile;
                if (x >= zone.left && y >= zone.top && x < zone.left+zone.width && y < zone.top+zone.height) {
                    return i;
                }
            }
            return -1;
        },

        onDragStart: function(pin, event) {
            console.log("Drag Start");
        },

        onDragEnd: function(pin, event) {
            console.log("Drag End");

            var $pinboard = this.$('.ppq-pinboard');
            var boardw = $pinboard.width();
            var boardh = $pinboard.height();
            var pos = pin.$el.position();
            var x = pos.left + pin.$el.width() / 2;
            var y = pos.top + pin.$el.height();
            var percentX = 100 * x / boardw;
            var percentY = 100 * y / boardh;
            pin.setPosition(percentX, percentY);
            //this.$('.ppq-debug').html(percentX+'%,'+percentY+'% '+x+'px,'+y+'px');
        }

    }, {
        template:'ppq'
    });

    var PinView = Backbone.View.extend({
        tagName:'a',

        className:'ppq-pin',

        events: {
            "click .ppq-icon":"preventDefault"
        },

        initialize:function() {
            this.state = new Backbone.Model();
            this.render();
            this.$el.attr('href', '#');
        },

        render:function() {
            var template = Handlebars.templates['ppqPin'];

            this.$el.html(template());

            return this;
        },

        preventDefault:function(event) {
            event.preventDefault();
        },

        reset:function() {
            this.$el.removeClass('in-use correct incorrect');
            this.state.unset('position');
        },

        getPosition:function() {
            return this.state.get('position');
        },

        setPosition:function(percentX, percentY) {
            if (!this.isGraphable(percentX) || !this.isGraphable(percentY)) return;

            this.$el.addClass('in-use');
            this.state.set('position', {
                'percentX':percentX,
                'percentY':percentY
            });
        },

        isGraphable:function(o) {
            return _.isNumber(o) && !isNaN(o) && isFinite(o);
        },

        /**
         * Called when the user clicks submit and this.model.canSubmit() returns false
         * Not necessary but you
         */
        onCannotSubmit: function() {}

    });

    return PpqView;

});

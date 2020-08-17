define([
    'core/js/adapt',
    'core/js/views/componentView'
], function(Adapt, ComponentView) {

    var iFrameComponent = ComponentView.extend({

        postRender: function() {
            var $iframe = this.$('iframe');

            _.bindAll(this, 'onIframeLoaded', 'onMessage', 'onInview');
            $iframe.on('load', this.onIframeLoaded);
            this.listenTo(Adapt, 'device:resize', this.onResize);

            switch (this.model.get('_setCompletionOn')) {
                case 'message':
                    window.addEventListener('message', this.onMessage);
                    break;
                case 'inview':
                default:
                    $iframe.on('inview', this.onInview);
            }
        },

        onIframeLoaded: function(){
            this.iframeContents = this.$('iframe').contents();

            var delegateSelector = this.model.get('_dimensionDelegateSelector');

            if(delegateSelector){
                this.$dimensionDelegate = $(this.iframeContents.find(delegateSelector));
                this.model.set({
                    '_initialWidth': this.$dimensionDelegate.width(),
                    '_initialHeight': this.$dimensionDelegate.height()
                });
            }
            this.onResize();

            this.setReadyStatus();
        },

        aspectRatio: function(){
            var width = this.model.get('_initialWidth');
            var height = this.model.get('_initialHeight');

            return width && height ? height/width : 0.56;
        },

        width: function(){
            return this.$('.iframe-container').width();
        },

        height: function(){
            return this.width() * this.aspectRatio();
        },

        dimensions: function(){
            return {
                width: this.width(),
                height: this.height()
            };
        },

        onResize: function(){
            if (!this.iframeContents) return;

            var dimensions = this.dimensions();
            this.$('iframe').css(dimensions);

            if (this.$dimensionDelegate) this.$dimensionDelegate.css(dimensions);
        },

        onMessage: function(event) {
            if (event.data !== 'complete') return;

            this.setCompletionStatus();
            window.removeEventListener('message', this.onMessage);
        },

        onInview: function(event, visible, visiblePartX, visiblePartY) {
            if (!visible) return;

            switch (visiblePartY) {
                case 'top':
                    this.hasSeenTop = true;
                    break;
                case 'bottom':
                    this.hasSeenBottom = true;
                    break;
                case 'both':
                    this.hasSeenTop = true;
                    this.hasSeenBottom = true;
            }

            if (!this.hasSeenTop || !this.hasSeenBottom) return;

            this.$('iframe').off('inview', this.onInview);
            this.setCompletionStatus();
        }

    });

    return Adapt.register('iframe', iFrameComponent);
});
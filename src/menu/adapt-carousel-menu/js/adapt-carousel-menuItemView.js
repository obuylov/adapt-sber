define([ "core/js/views/adaptView", "core/js/adapt" ], function(AdaptView, Adapt) {

    var CarouselMenuItemView = AdaptView.extend({

        className: function() {
            var classes = "carousel-menu-item";
            var modelClasses = this.model.get("_classes");

            if (modelClasses) classes += " " + modelClasses;
            if (this.isVisited()) classes += " visited";
            if (this.model.get("_isOptional")) classes += " optional";
            if (this.model.get("_isComplete")) classes += " completed";
            if (this.model.get("_isLocked")) classes += " locked";

            return classes;
        },

        events: {
            "click .carousel-menu-item-button": "onClick"
        },

        postRender: function() {
            this.setBackgroundImage();
            this.$el.imageready(_.bind(this.setReadyStatus, this));
        },

        onClick: function() {
            if (!this.model.get("_isLocked")) {
                //Adapt.navigateToElement(this.model.get("_id"));
                Backbone.history.navigate('#/id/' + this.model.get('_id'), {trigger: true});
            }
            /* Below addes page number in for the menu */
            var models = this.model.getParent().getAvailableChildModels();
            var numofpgs = models.length;
            var addmodels =parseInt(models.indexOf(this.model)+1);
            $('.navpagenum').text( 'Page ' + addmodels + ' of ' + numofpgs );
            $('.arianavpgnum').text( 'Page ' + addmodels + ' of ' + numofpgs ).attr('role','region').attr('tabindex','0').addClass('aria-label');

            //BELOW PULLS TITLE
            var navtitle2 = $( '.carousel-menu-item[data-adapt-id="home"] .carousel-menu-item-title' ).text();
            $( ".modulehead" ).html( navtitle2 );
        },

        setBackgroundImage: function() {
            var graphic = this.model.get("_graphic");
            var src = graphic && graphic.src;

            if (src) this.$el.css("background-image", "url(" + src + ")");
        },

        isVisited: function() {
            if (this.model.get("_isVisited")) return true;

            var components = this.model.findDescendantModels("components");

            return _.find(components, function(component) {
                return component.get("_isComplete") && component.get("_isAvailable") &&
                    !component.get("_isOptional");
            });
        }

    }, { template: "carouselMenuItem", type: "menu" });

    return CarouselMenuItemView;

});

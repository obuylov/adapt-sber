define([
    "./adapt-carousel-menuItemView",
    "core/js/adapt"
], function(CarouselMenuItemView, Adapt) {

    var CarouselMenuItemIndicatorView = CarouselMenuItemView.extend({

        attributes: function() {
            var models = this.model.getParent().getAvailableChildModels();

            return _.extend(CarouselMenuItemView.prototype.attributes.call(this), {
                "data-item-index": parseInt(models.indexOf(this.model)+1)
            });
        },

        className: function() {
            var classes = CarouselMenuItemView.prototype.className.call(this);

            return classes += " carousel-menu-item-indicator";
        },

        events: {
            "click .carousel-menu-item-indicator-button": "onClick",
            "mouseover .carousel-menu-item-indicator-button": "onOver",
            "mouseout .carousel-menu-item-indicator-button": "onOut"
        },

        postRender: function() {},

        onClick: function() {
            var index = this.$el.data("item-index");

            Adapt.trigger("carouselMenu:setItem", this.model.get("_id"), index);
        },

        onOver: function() {
            var index = this.$el.data("item-index");
            $('.carousel-menu-item[data-item-index="' + index + '"] .menu-tooltip').css({'opacity':'1','-webkit-animation-name': 'fadeInUp','animation-name': 'fadeInUp'});
        },

        onOut: function() {
            var index = this.$el.data("item-index");
            $('.carousel-menu-item[data-item-index="' + index + '"] .menu-tooltip').css({'opacity':'0','-webkit-animation-name': 'none','animation-name': 'none'});
        }

    }, { template: "carouselMenuItemIndicator" });

    return CarouselMenuItemIndicatorView;

});

define([
    "core/js/views/menuView",
    "core/js/adapt",
    "./adapt-carousel-menuItemView",
    "./adapt-carousel-menuItemIndicatorView"
], function(MenuView, Adapt, CarouselMenuItemView, CarouselMenuItemIndicatorView) {

    var CarouselMenuView = MenuView.extend({

        attributes: function() {
            return _.extend(MenuView.prototype.attributes.call(this), {
                "data-item-count": this.model.getAvailableChildModels().length+1
            });
        },

        className: function() {
            return MenuView.prototype.className.call(this) + " carousel-menu";
        },

        events: {
            "click .carousel-menu-item-control": "onControlClick",
            "click .numspothome": "onHome",
            "mouseover .numspothome": "homeOver",
            "mouseout .numspothome": "homeOut",
            "click .tooltips6 .skipme": "toolTip"
        },

        postRender: function() {

            var item = this.getNextIncompleteItem();

            this.listenTo(Adapt, {
                "carouselMenu:setItem": this.setItem,
                "menuView:ready": this.onReady
            });

            this.setBackgroundImage();
            this.setUpItems();
            this.setItem(item.id, item.index);
            
            // Checks if you are on Main Menu or Sub Menu
            if ($('.navigation-back-button').hasClass('display-none')) {
                //Do Nothing on Main Menu

                //BELOW PULLS TITLE
                var navtitle2 = $( '.carousel-menu-item[data-adapt-id="home"] .carousel-menu-item-title' ).text();
                Adapt.offlineStorage.set('mycourseTitle', navtitle2);
                var courseholder = Adapt.offlineStorage.get("mycourseTitle");
            } else {
                $('.location-menu .carousel-menu').addClass('submenu-carousel');
                //BELOW PULLS TITLE
                var navtitle2 = $( '.carousel-menu-item[data-adapt-id="home"] .carousel-menu-item-title' ).text();
                Adapt.offlineStorage.set('mycourseTitle', navtitle2);
                var courseholder = Adapt.offlineStorage.get("mycourseTitle");
            }

            // Triggers Page 1 when Accessibility button is pressed
            if ($('.location-menu').hasClass('accessibility')) {
                // Checks if you are on Main Menu or Sub Menu
                if ($('.navigation-back-button').hasClass('display-none')) {
                    window.setTimeout(function(){
                        $( '.carousel-menu-item:nth-child(2) .carousel-menu-item-button' ).trigger( 'click' );
                    }, 250);
                } else {
                    window.setTimeout(function(){
                        $( '.carousel-menu-item:nth-child(2) .carousel-menu-item-button' ).trigger( 'click' );
                        window.setTimeout(function(){
                            $('head').prepend("<style>.accessibility .audio-controls .audio-inner button {display:none;}</style>");
                            $( '.carousel-menu-item:nth-child(2) .carousel-menu-item-button' ).trigger( 'click' );
                        }, 250);
                    }, 250);
                }
            }

            window.setTimeout(function(){
                $(".tooltips6").remove(); 
            }, 15000);
        },

        setItem: function(id, index) {
            this.model.set("_coverId", id);
            Adapt.offlineStorage.set("coverId", id);
            this.$el.attr("data-item-index", index);
        },

        onReady: function() {
            if (Adapt.device.screenSize !== "large") this.scroll();

            this.$(".carousel-menu-item-container").removeClass("no-transition");

            if ( $(".visited.carousel-menu-item-indicator .carousel-menu-item-indicator-button-inner div").hasClass("page-level-progress-menu-item") ) {
                $( ".carousel-menu-item-indicator .page-level-progress-menu-item-indicator-bar" ).each(function( percent ) {
                    $('.visited.carousel-menu-item-indicator').addClass('pgpercent');
                    //console.log( parseInt(percent+1) + ": " + $( this ).css("width") );
                    $( ".pgpercent" ).each(function( pgcount ) {
                        $( this ).addClass('pgcount' + parseInt(pgcount+1));
                        $('.carousel-menu-item-indicator-container .pgpercent.pgcount' + parseInt(pgcount+1) + ' .carousel-menu-item-indicator-button-inner').css('width', $( '.pgcount' + parseInt(pgcount+1) + ' .page-level-progress-menu-item-indicator-bar' ).css("width"));
                    });
                });
            }
        },

        onControlClick: function(event) {
            var index = $(event.currentTarget).hasClass("back") ?
                parseInt(this.$el.attr("data-item-index"), 10) - 1 :
                parseInt(this.$el.attr("data-item-index"), 10) + 1;

            var models = this.model.getAvailableChildModels();

            if (index > -1 && index < models.length) {
                this.setItem(models[index].get("_id"), index);
            }
            if ( $(event.currentTarget).hasClass("next")) {
                if (index == models.length) {
                    $(".carousel-menu").attr("data-item-index",models.length);
                }
            }
        },

        onHome: function() {
            $(".carousel-menu").attr("data-item-index","0");
        },

        homeOver: function() {
            $('.carousel-menu-item[data-adapt-id="home"] .menu-tooltip').css({'opacity':'1','-webkit-animation-name': 'fadeInUp','animation-name': 'fadeInUp'});
        },

        homeOut: function() {
            $('.carousel-menu-item[data-adapt-id="home"] .menu-tooltip').css({'opacity':'0','-webkit-animation-name': 'none','animation-name': 'none'});
        },

        toolTip: function() {
            $(".tooltips6").css({'opacity':'0','display': 'none','z-index': '-1'});
        },

        setBackgroundImage: function() {
            var config = this.model.get("_carouselMenu");
            var src = config && config._backgroundSrc;

            if (src) this.$el.css("background-image", "url(" + src + ")");
        },

        setUpItems: function() {
            var items = this.model.getAvailableChildModels();
            var $items = this.$(".carousel-menu-item-container");
            var $indicators = this.$(".carousel-menu-item-indicator-container");

            for (var i = 0, j = items.length; i < j; i++) {
                var options = { model: items[i] };

                $items.append(new CarouselMenuItemView(options).$el);
                $indicators.append(new CarouselMenuItemIndicatorView(options).$el);
            }
        },

        getNextIncompleteItem: function() {
            var models = this.model.getAvailableChildModels();
            var id = this.model.get("_coverId") || Adapt.offlineStorage.get("coverId");

            var index = _.findIndex(models, function(model) {
                return model.get("_id") === id;
            });

            if (index === -1) index = 0;

            for (var i = index, j = models; i < j; i++) {
                var model = models[i];

                if (!model.get("_isComplete")) return { id: model.get("_id"), index: i };
            }

            return { id: id, index: parseInt(index+1)};
        },

        scroll: function() {
            var $item = this.$(".carousel-menu-item")
                .filter("[data-adapt-id='" + this.model.get("_coverId") + "']");

            if (Adapt.device.screenSize == "large") Adapt.scrollTo($item);
        },

    }, { template: "carouselMenu" });

    Adapt.on("router:menu", function(model) {
        $("#wrapper").append(new CarouselMenuView({ model: model }).$el);
    });

});

define([
    "core/js/views/menuView",
    "./adapt-hotspotMenuItemView",
    "core/js/adapt",
], function(MenuView, HotspotMenuItemView, Adapt) {

    var HotspotMenuView = MenuView.extend({

        className: function() {
            return MenuView.prototype.className.call(this) + " hotspot-menu";
        },
        
        postRender: function() {
            this.setBackgroundImage();
            this.setUpItems();

            var nthChild = this.model.getAvailableChildModels();
            /* COUNTS MENU ITEMS AND PLACES NUMBER */
            $(".hotspot-menu-item").each(function(u) {
                $(this).attr('name', 'nth-child-' + parseInt(u+1)).addClass('nth-child-' + parseInt(u+1));
                $('.hotspot-menu-item[name="nth-child-' + parseInt(u+1) + '"]').click(function(){
                    /* Below addes page number in for the menu */
                    $('.navpagenum').text( 'Page ' + parseInt(u+1) + ' of ' + nthChild.length );
                    $('.arianavpgnum').text( 'Page ' + parseInt(u+1) + ' of ' + nthChild.length ).attr('role','region').attr('tabindex','0').addClass('aria-label');
                });
            });

            // IF NEW FRAMEWORK OR NOT
            if ($('.navigation-inner button').is('#accessibility2toggle')) {
                $('.navigation-back-button').addClass('hotspot-adjust');
            } else{
                //OLD FRAMEWORK DO NOTHING
            }

            if ($('.hotspot-menu .hotspot-menu-header div').hasClass('hotspot-menu-body')) {
                console.log("Menu has body text!");
            } else {
               $('.hotspot-menu .hotspot-menu-header .hotspot-menu-title:not(.submenu-title)').css({"text-align": "center", "width": "100%"});
            }
 
            // Checks if you are on Main Menu or Sub Menu
            if ($('.navigation-back-button').hasClass('display-none')) {
                //Do Nothing on Main Menu
                var navtitle2 = $( ".hotspot-menu-title" ).text();
                $( ".modulehead" ).html( navtitle2 );
            } else {
                $('.location-menu .hotspot-menu').addClass('submenu-hotspot');
                $('.location-menu .hotspot-menu .hotspot-menu-header .hotspot-menu-title').addClass('submenu-title');
                $('.location-menu .hotspot-menu .hotspot-menu-header .hotspot-menu-body').addClass('submenu-body');
                //BELOW PULLS TITLE
                var navtitle2 = $( ".hotspot-menu-title" ).text();
                $( ".modulehead" ).html( navtitle2 );
            }

            // Triggers Page 1 when Accessibility button is pressed
            if ($('.location-menu').hasClass('accessibility')) {
                // Checks if you are on Main Menu or Sub Menu
                if ($('.navigation-back-button').hasClass('display-none')) {
                    window.setTimeout(function(){
                        $( '.hotspot-menu-item.nth-child-1' ).trigger( 'click' );
                    }, 250);
                } else {
                    window.setTimeout(function(){
                        $( '.hotspot-menu-item.nth-child-1' ).trigger( 'click' );
                        window.setTimeout(function(){
                            $('head').prepend("<style>.accessibility .audio-controls .audio-inner button {display:none;}</style>");
                            $( '.hotspot-menu-item.nth-child-1' ).trigger( 'click' );
                        }, 250);
                    }, 250);
                }
            }
        },

        setBackgroundImage: function() {
            var config = this.model.get("_hotspotMenu");
            var src = config && config._backgroundSrc;

            if (src) this.$el.parent().css({"background-image": "url(" + src + ")", "background-size": "cover", "background-position": "center", "background-repeat": "no-repeat"});
        },

        setUpItems: function() {
            var items = this.model.getAvailableChildModels();
            var $items = this.$(".hotspot-menu-item-container");

            for (var i = 0, j = items.length; i < j; i++) {
                $items.append(new HotspotMenuItemView({ model: items[i] }).$el);
            }
        }

    }, { template: "hotspotMenu" });

    Adapt.on("router:menu", function(model) {
        $("#wrapper").append(new HotspotMenuView({ model: model }).$el);
    });

});

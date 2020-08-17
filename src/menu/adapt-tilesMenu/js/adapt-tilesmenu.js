define([
    'core/js/adapt',
    'core/js/views/menuView',
    'core/js/views/menuItemView'
], function(Adapt, MenuView, MenuItemView) {

    var BoxMenuView = MenuView.extend({

        className: function() {
            return MenuView.prototype.className.apply(this) + " tilesmenu-menu";
        },

        postRender: function() {
            var nthChild = 0;
            this.model.getChildren().each(function(item) {
                if (item.get('_isAvailable') && !item.get('_isHidden')) {
                    item.set('_nthChild', ++nthChild);
                    this.$('.menu-tile-items').append(new BoxMenuItemView({model: item}).$el);
                }

                if(item.get('_isHidden')) {
                    item.set('_isReady', true);
                }
            });

            /* COUNTS MENU ITEMS AND PLACES NUMBER */
            $(".menu-item").each(function(i) {
                $(this).attr('name', 'nth-child-' + parseInt(i+1));
                $(this).find(".menu-item-button").attr('data-content', ++i);
                $('.menu-item-button[data-content="' + i + '"]').click(function(){
                    /* Below addes page number in for the menu */
                    $('.navpagenum').text( 'Page ' + i + ' of ' + nthChild );
                    $('.arianavpgnum').text( 'Page ' + i + ' of ' + nthChild ).attr('role','region').attr('tabindex','0').addClass('aria-label');
                });

                //Replace UL list tags to p tags
                $('.menu-item-button[data-content="' + i + '"] .origbutton ul').replaceWith(function(){
                    return $("<p />", {html: $(this).html()});
                });

                //Replace OL list tags to p tags
                $('.menu-item-button[data-content="' + i + '"] .origbutton ol').replaceWith(function(){
                    return $("<p />", {html: $(this).html()});
                });

                //PUT P tags in front of TABLE tags to hide
                $('.menu-item-button[data-content="' + i + '"] .origbutton').find('table').wrap( "<p></p>" );

                //BELOW COUNTS BODY MESSAGE STRING COUNT IF TOO LONG MAKES BUTTON
                var myPtag = $('.menu-item-button[data-content="' + i + '"] .origbutton').find('p:first');
                var howmanyPtag = $('.menu-item-button[data-content="' + i + '"] .origbutton').find('p');

                if(myPtag.text().length >= 200 || howmanyPtag.length > 1){
                    $('.menu-item-button[data-content="' + i + '"] .origbutton p:first').addClass('myPtag').html($('.menu-item-button[data-content="' + i + '"] .origbutton p:first').html().substring(0, 200) + " ...<br/>" + "<div id=\"tilemenupopup\">+ Read more</div>");
                } else {
                    $('.menu-item-button[data-content="' + i + '"] .origbutton p:first').addClass('myPtag');
                }
            });

            // Checks if you are on Main Menu or Sub Menu
            if ($('.navigation-back-button').hasClass('display-none')) {
                //Do Nothing on Main Menu
                //BELOW PULLS TITLE
                var navtitle2 = $( '.menu-title-inner' ).text();
                Adapt.offlineStorage.set('mycourseTitle', navtitle2);
                var courseholder = Adapt.offlineStorage.get("mycourseTitle");
            } else {
                $('.tilesmenu-menu .menu-container-inner .menu-header .menu-header-inner .menu-title').addClass('submenu-title');
                $('.tilesmenu-menu .menu-container-inner .menu-header .menu-header-inner .menu-body').addClass('submenu-body');
                //BELOW PULLS TITLE
                var navtitle2 = $( '.menu-title-inner' ).text();
                Adapt.offlineStorage.set('mycourseTitle', navtitle2);
                var courseholder = Adapt.offlineStorage.get("mycourseTitle");
            }

            // Triggers Page 1 when Accessibility button is pressed
            if ($('.location-menu').hasClass('accessibility')) {
                // Checks if you are on Main Menu or Sub Menu
                if ($('.navigation-back-button').hasClass('display-none')) {
                    window.setTimeout(function(){
                        $( '.nth-child-1 .viewtext' ).trigger( 'click' );
                    }, 250);
                } else {
                    window.setTimeout(function(){
                        $( '.nth-child-1 .viewtext' ).trigger( 'click' );
                        window.setTimeout(function(){
                            $('head').prepend("<style>.accessibility .audio-controls .audio-inner button {display:none;}</style>");
                            $( '.nth-child-1 .viewtext' ).trigger( 'click' );
                        }, 250);
                    }, 250);
                }
            }

        }

    }, {
        template: 'tilesmenu'
    });

    var BoxMenuItemView = MenuView.extend({

        events: {
            'click .viewtext' : 'onClickMenuItemButton',
            'click #tilemenupopup' : 'menunotifyPopup'
        },

        className: function() {
            var nthChild = this.model.get('_nthChild');
            return [
                'menu-item',
                'menu-item-' + this.model.get('_id') ,
                this.model.get('_classes'),
                this.model.get('_isVisited') ? 'visited' : '',
                this.model.get('_isComplete') ? 'completed' : '',
                this.model.get('_isLocked') ? 'locked' : '',
                'nth-child-' + nthChild,
                nthChild % 2 === 0 ? 'nth-child-even' : 'nth-child-odd'
            ].join(' ');
        },

        preRender: function() {
            this.model.checkCompletionStatus();
            this.model.checkInteractionCompletionStatus();
        },

        postRender: function() {
            var graphic = this.model.get('_graphic');
            var nthChild = this.model.get("_nthChild");

            if (graphic && graphic.src) {
                this.$el.imageready(this.setReadyStatus.bind(this));
                return;
            }

            this.setReadyStatus();
        },

        onClickMenuItemButton: function(event) {
            if(event && event.preventDefault) event.preventDefault();
            if(this.model.get('_isLocked')) return;

            Backbone.history.navigate('#/id/' + this.model.get('_id'), {trigger: true});
        },

        menunotifyPopup: function (event) {
            event.preventDefault();

            this.model.set('_active', false);

            var bodyText = this.model.get('body');
            var titleText = this.model.get('displayTitle');

            var popupObject = {
                title: titleText,
                body: bodyText
            };

            Adapt.trigger('notify:popup', popupObject);

        }

    }, {
        template: 'tilesmenu-item'
    });

    Adapt.on('router:menu', function(model) {

        $('#wrapper').append(new BoxMenuView({model: model}).$el);

    });

});

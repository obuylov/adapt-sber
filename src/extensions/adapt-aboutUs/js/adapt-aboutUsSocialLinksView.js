/*
 * adapt-aboutUs
 * License - https://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
 * Maintainers - Chuck Lorenz <chuck.lorenz@clearlearning.tech>
 * Code was based on adapt-contrib-glossary and adapt-contrib-resources
 */

define([
    'core/js/adapt'
], function(Adapt) {

    var AboutUsSocialLinksView = Backbone.View.extend({

        className: "aboutus__item",

        attributes: {
            role: 'listitem'
        },

        initialize: function() {
            this.render();
        },

        render: function() {
            var modelData = this.model;
            var template = Handlebars.templates["aboutUsSocialLinks"];
            this.$el.html(template(modelData));
            _.defer(_.bind(function() {
                this.postRender();
            }, this));
            return this;
        },

        postRender: function() {
            this.listenTo(Adapt, 'drawer:openedItemView', this.remove);
            this.listenTo(Adapt, 'drawer:triggerCustomView', this.remove);
        }

    });

    return AboutUsSocialLinksView;
});

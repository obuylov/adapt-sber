/*
 * adapt-aboutUs
 * License - https://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
 * Maintainers - Chuck Lorenz <chuck.lorenz@clearlearning.tech>
 * Code was based on adapt-contrib-glossary and adapt-contrib-resources
 */

define([
    'core/js/adapt',
    './adapt-aboutUsItemView',
    './adapt-aboutUsSocialLinksView'
], function(Adapt, AboutUsItemView, SocialLinksView) {

    var AboutUsView = Backbone.View.extend({

        className: "aboutus",

        initialize: function() {
            this.listenTo(Adapt, 'remove drawer:closed', this.remove);
            this.render();
        },

        render: function() {
            var template = Handlebars.templates["aboutUs"];
            this.$el.html(template(this.model.toJSON()));
            this.renderAboutUsItems();
            _.defer(_.bind(function() {
                this.postRender();
            }, this));
            return this;
        },

        renderAboutUsItems: function() {
            var $aboutUsItemContainer = this.$('.aboutus__items-container').empty();
            _.each(this.collection.models, function(item, index) {
                var itemView = new AboutUsItemView({model: item});
                itemView.$el.appendTo($aboutUsItemContainer);
            }, this);
            new SocialLinksView({model: Adapt.course.get('_aboutUs')._socialLinks})
                .$el.appendTo($aboutUsItemContainer);
        },

        postRender: function() {
            this.listenTo(Adapt, 'drawer:openedItemView', this.remove);
            this.listenTo(Adapt, 'drawer:triggerCustomView', this.remove);
        }

    });

    return AboutUsView;
});

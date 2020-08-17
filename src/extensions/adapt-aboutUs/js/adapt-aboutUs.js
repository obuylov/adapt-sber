/*
 * adapt-aboutUs
 * License - https://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
 * Maintainers - Chuck Lorenz <chuck.lorenz@clearlearning.tech>
 * Code was based on adapt-contrib-glossary and adapt-contrib-resources
 */

define([
    'core/js/adapt',
    './adapt-aboutUsView'
], function(Adapt, AboutUsView) {

    function setupAboutUs(aboutUsModel, aboutUsItems, socialLinks) {

        var aboutUsModel = new Backbone.Model(aboutUsModel);
        var itemsCollection = new Backbone.Collection(aboutUsItems);
        var socialLinksCollection = new Backbone.Collection(socialLinks);

        var options = {
            model: aboutUsModel,
            collection: itemsCollection,
            sociallinks: socialLinksCollection
        };

        Adapt.on('aboutUs:showAboutUs', function() {
            Adapt.drawer.triggerCustomView(new AboutUsView(options).$el);
        });
    }

    function initAboutUs() {
        var courseAboutUs = Adapt.course.get('_aboutUs');

        if (!courseAboutUs || !courseAboutUs._isEnabled) {
            return;
        }

        var drawerObject = {
            title: courseAboutUs.title,
            description: courseAboutUs.description,
            className: 'is-aboutus',
            drawerOrder: courseAboutUs._drawerOrder || 0
        };

        Adapt.drawer.addItem(drawerObject, 'aboutUs:showAboutUs');

        setupAboutUs(courseAboutUs, courseAboutUs._aboutUsItems, courseAboutUs._socialLinks);
    }

    Adapt.on('app:dataReady', initAboutUs);

});

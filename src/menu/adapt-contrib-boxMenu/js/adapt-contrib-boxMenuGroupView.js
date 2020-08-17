define([
  'core/js/views/menuItemView',
  './adapt-contrib-boxMenuItemView'
], function(MenuItemView, BoxMenuItemView) {

  var BoxMenuGroupView = MenuItemView.extend({

    postRender: function() {
      _.defer(this.addChildren.bind(this));
      this.$el.imageready(this.setReadyStatus.bind(this));
      this.$el.parents('.boxmenu__item-container').addClass('has-groups');
    }

  }, {
    childContainer: '.js-group-children',
    childView: BoxMenuItemView,
    className: 'boxmenu-group',
    template: 'boxMenuGroup'
  });

  return BoxMenuGroupView;

});

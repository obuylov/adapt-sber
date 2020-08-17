define([
  'core/js/views/menuItemView'
], function(MenuItemView) {

  var BoxMenuItemView = MenuItemView.extend({

    events: {
      'click .js-btn-click' : 'onClickMenuItemButton'
    },

    onClickMenuItemButton: function(event) {
      if (event && event.preventDefault) event.preventDefault();
      if (this.model.get('_isLocked')) return;
      Backbone.history.navigate('#/id/' + this.model.get('_id'), {trigger: true});
    }

  }, {
    className: 'boxmenu-item',
    template: 'boxMenuItem'
  });

  return BoxMenuItemView;

});

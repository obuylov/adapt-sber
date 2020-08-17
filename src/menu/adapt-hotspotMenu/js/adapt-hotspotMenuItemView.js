define([ "core/js/views/adaptView", "core/js/adapt" ], function(AdaptView, Adapt) {

	var HotspotMenuItemView = AdaptView.extend({

		tagName: "button",

		className: function() {
			var classes = "hotspot-menu-item";
			var modelClasses = this.model.get("_classes");

			if (modelClasses) classes += " " + modelClasses;
			if (this.isVisited()) classes += " visited";
			if (this.model.get("_isOptional")) classes += " optional";
			if (this.model.get("_isComplete")) classes += " completed";
			if (this.model.get("_isLocked")) classes += " locked";

			return classes;
		},

		events: {
			"click": "onClick"
		},

		postRender: function() {
			this.setPosition();
			this.setReadyStatus();
		},

		setPosition: function() {
			var config = this.model.get("_hotspotMenu");

			if (config) {
				this.$el.css({ top: config._top + "%", left: config._left + "%" });
			}
		},

		onClick: function() {
			if (!this.model.get("_isLocked")) {
				//Adapt.navigateToElement(this.model.get("_id"));
				Backbone.history.navigate('#/id/' + this.model.get('_id'), {trigger: true});
			}
		},

		isVisited: function() {
			if (this.model.get("_isVisited")) return true;

			var components = this.model.findDescendantModels("components");

			return components.some(function(component) {
				return component.get("_isComplete") && component.get("_isAvailable") &&
					!component.get("_isOptional");
			});
		}

	}, { template: "hotspotMenuItem", type: "menu" });

	return HotspotMenuItemView;

});

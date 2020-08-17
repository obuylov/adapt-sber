define([ 'core/js/adapt' ], function(Adapt) {

	var position = {};

	function savePosition() {
		if (!isEnabled()) return;

		position[Adapt.location._currentId] = $(window).scrollTop();
	}

	function restorePosition() {
		if (!isEnabled()) return;

		var savedPosition = position[Adapt.location._currentId];
		if (!savedPosition) return;

		$(window).scrollTop(savedPosition);
	}

	function isEnabled() {
		if (!Adapt.location._currentId) return false;

		var model = Adapt.findById(Adapt.location._currentId);
		var config = model.get('_keepScrollPosition');
		return (config && config._isEnabled);
	}

	Adapt.on({
		'menuView:ready pageView:ready': restorePosition,
		'remove': savePosition
	});

});

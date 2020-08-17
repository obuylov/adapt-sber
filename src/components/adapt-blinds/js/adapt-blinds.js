define([
    'core/js/models/componentModel', // add this
    'core/js/views/componentView', // change these to use proper paths
    'core/js/adapt'
], function(ComponentModel, ComponentView, Adapt) {

	var Blinds = ComponentView.extend({

		preRender: function() {
			this.listenTo(Adapt, "device:resize", this.calculateWidths, this);
			this.setDeviceSize();
		},

		postRender: function() {
			this.$(".blinds__inner").imageready(_.bind(function() {
				this.setupBlinds();
				this.setReadyStatus();
			}, this));

		},

		setupBlinds: function() {
			if(!this.model.has("_items") || !this.model.get("_items").length) return;
			this.model.set("_itemCount", this.model.get("_items").length);
			this.model.set("_active", true);
			this.calculateWidths();
			this.setupEventListeners();
		},

		setupEventListeners: function() {
			if (!this.model.get("_isDesktop")) return;

			var that = this;
			var $items = this.$(".blinds__item");
			var _items = this.model.get("_items");
			var wItem = this.itemWidth;
			var animationTime = 400;
			var captionDelay = this.model.has("captionDelay") ? this.model.get("captionDelay") : 800;
			var expandBy = this.model.get("_expandBy") || 2;
			var count = 0;
			var currentItem;
			var queue = [];

			//Below is a fix for accessibility
			var countaccess = this.model.get("_items").length;
			var minuscountaccess = countaccess - 1;
			var divcountaccess = wItem / minuscountaccess;
			var subtractaccess = wItem - divcountaccess;
			    $('.blinds__item').focus(
			    function(){
				$(this).css('width',wItem * expandBy);
				$(this).find('.blinds__captions p').css('opacity','1');
			    }).blur(
			    function(){
				$(this).css('width', subtractaccess+'px');
				$(this).find('.blinds__captions p').css('opacity','0');
			    });

// 				$('p').focus(
// 			    function(){
// 				$(this).parent('div').parent('div').css('width',wItem * expandBy);
// 				$(this).css('opacity','1');
// 			    }).blur(
// 			    function(){
// 				$(this).parent('div').parent('div').css('width', subtractaccess+'px');
// 				$(this).css('opacity','0');
// 			    });

			    $('.accessibility-state span').focus(
			    function(){
				$('.blinds__item').css('width',wItem);
			    }).blur(
			    function(){
				$('.blinds__item').css('width',wItem);
			    });
			    //Above is fix for accessibility

			$items.on({
				mouseenter: function() {
					currentItem = this;


					var $this = $(this);
					var itemIndex = $this.index();
					var _item = _items[itemIndex];
					var $siblings = $this.siblings();
					var $p = $this.find("p");
					var wItemNew = wItem * expandBy;
					var wSiblingsNew = wItem - ((wItemNew - wItem) / $siblings.length);
					var currTop = 10;

					$this.outerWidth(wItemNew);

					that.setStage(itemIndex);

					$p.each(function(i, el) {
					    
						(function(i, el) {
							var t = animationTime + (i * captionDelay);
							var caption = _item._captions[i];
							var left = caption.left || _item.left || 0;
							var top = caption.top;
							if (!top && i === 0) top = 0;
							var width = caption.width || wItem * expandBy + "px";
							queue[i] = setTimeout(function() {
								if (top === undefined) {
									top = $p.eq(i - 1).outerHeight() + currTop + 10;
								}
								currTop = parseInt(top);
								$(el).css({
									opacity: 1,
									marginTop: top,
									left: left,
									maxWidth: width
								});
							}, t);
						})(i, el);
					});
					$siblings.outerWidth(wSiblingsNew);
				},
				mouseleave: function() {
					for (var i = 0; i < queue.length; i++) {
						clearTimeout(queue[i]);
					}
					currentItem = null;
					count = 0;
					var $this = $(this);
					$this.outerWidth(wItem);
					$this.find("p").css("opacity", 0);
					$this.siblings().outerWidth(wItem);
				}
			});

			this.completionEvent = this.model.get("_setCompletionOn") || "allItems";

			if (this.completionEvent !== "inview" && this.model.get("_items").length > 1) {
				this.on(this.completionEvent, _.bind(this.onCompletion, this));
			} else {
				this.$(".component__widget").on("inview", _.bind(this.inview, this));
			}
		},

		calculateWidths: function() {
			if (this.model.get("height")) this.$(".blinds__item").height(this.model.get("height"));
			var wTotal = this.$(".blinds__container").width();
			var $items = this.$(".blinds__item");
			var margin = parseInt($items.css("marginRight"));
			var wItem = (wTotal / $items.length) - (margin * 2);
			this.itemWidth = wItem;
			$items.outerWidth(wItem);
		},

		setStage: function(stage) {
			this.model.set("_stage", stage);
			if (this.model.get("_isDesktop")) {
				// Set the visited attribute for large screen devices
				var currentItem = this.getCurrentItem(stage);
				currentItem._isVisited = true;
			}

			this.evaluateCompletion();
		},

		getCurrentItem: function(index) {
			return this.model.get("_items")[index];
		},

		getVisitedItems: function() {
			return _.filter(this.model.get("_items"), function(item) {
				return item._isVisited;
			});
		},

		evaluateCompletion: function() {
			if ($("html").hasClass("accessibility")) {
				$(".component__widget").on("inview", _.bind(this.inview, this));
			} else{
				if (this.getVisitedItems().length === this.model.get("_items").length) {
					this.trigger("allItems");
				}
			}
		},

		inview: function(event, visible, visiblePartX, visiblePartY) {
			if (visible) {
				if (visiblePartY === "top") {
					this._isVisibleTop = true;
				} else if (visiblePartY === "bottom") {
					this._isVisibleBottom = true;
				} else {
					this._isVisibleTop = true;
					this._isVisibleBottom = true;
				}

				if (this._isVisibleTop && this._isVisibleBottom) {
					this.$(".component__inner").off("inview");
					this.setCompletionStatus();
				}
			}
		},

		onCompletion: function() {
			this.setCompletionStatus();
			if (this.completionEvent && this.completionEvent != "inview") {
				this.off(this.completionEvent, this);
			}
		},

		setDeviceSize: function() {
			if (Adapt.device.screenSize === "large") {
				this.$el.addClass("desktop").removeClass("mobile");
				this.model.set("_isDesktop", true);
			} else {
				this.$el.addClass("mobile").removeClass("desktop");
				this.model.set("_isDesktop", false);
				this.setCompletionStatus();
			}
		}
	});

	//Adapt.register("blinds", Blinds);
	Adapt.register('blinds', {
      model: ComponentModel.extend({}), // register the model, it should be an extension of ComponentModel, an empty extension is fine
      view: Blinds
    });

	return Blinds;

});

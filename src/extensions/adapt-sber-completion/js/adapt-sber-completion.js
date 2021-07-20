define([
        'core/js/adapt',
        'libraries/tincan-min'
    ],

    function (Adapt) {

        const CustomCompletion = Backbone.Controller.extend({

            customConfig: undefined,
            pageVisited: false,
            componentCompleted: false,

            initialize: function () {
                this.listenToOnce(Adapt, "router:location", this.onAdaptInitialize);
            },

            onAdaptInitialize: function () {
                if (!this.checkIsCustomCompletion()) return;
                this.setupEventListeners();
            },

            checkIsCustomCompletion: function () {
                if (!Adapt.offlineStorage) return false;

                if (Adapt.config.has('_sberCompletionCriteria')) {
                    let AdaptConfig = Adapt.config.get('_sberCompletionCriteria');
                    this.customConfig = AdaptConfig._sberCustomCompletion;
                    this.customConfig["_activityID"] = AdaptConfig._activityID;
                }

                return this.customConfig !== undefined;
            },

            checkIfCompletedEverything() {
                // You always need page completion, but if you need to complete a component, we need to check that first
                if (this.customConfig._requireComponentVisited !== "") {
                    if (this.pageVisited && this.componentCompleted) {
                        this.setContentCompleted();
                    }
                } else {
                    if (this.pageVisited) {
                        this.setContentCompleted();
                    }
                }
            },

            setupEventListeners: function () {
                this.listenTo(Adapt, 'pageView:preRender', this.onPageVisit);
                if (this.customConfig._requireComponentVisited) {
                    let model = Adapt.findById(this.customConfig._requireComponentVisited);
                    Adapt.listenTo(model, "change:_isComplete", function () {
                        this.componentCompleted = true;
                        this.checkIfCompletedEverything();
                    }.bind(this))
                }
            },

            onPageVisit: function (pageView) {
                let _sCurrentScreenId = pageView.model.get('_id'),
                    _sPageId = this.customConfig._requirePageVisited;

                console.log('_sCurrentScreenId - ', _sCurrentScreenId, ' _sPageId - ', _sPageId);
                if (_sPageId !== undefined) {
                    if (_sCurrentScreenId === _sPageId) {
                        this.pageVisited = true;
                        this.checkIfCompletedEverything();
                    }
                }
            },

            setContentCompleted: function () {
                const tincan = new TinCan({
                    url: window.location.href
                });
                tincan.sendStatement({
                    verb: {
                        id: "http://adlnet.gov/expapi/verbs/passed"
                    },
                    object: {
                        "id": this.customConfig._activityID,
                        "objectType": "Activity"
                    }
                });

                let _sCompletionData = Adapt.offlineStorage.get('completion');
                if (_sCompletionData) {
                    _sCompletionData = _sCompletionData.replace(/0/g, 1);
                    Adapt.offlineStorage.set('completion', _sCompletionData);
                }
            }
        });

        return new CustomCompletion();
    });

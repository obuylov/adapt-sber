define([
    'core/js/adapt',
    'libraries/tincan-min'
  ],

  function (Adapt) {

    const CustomCompletion = Backbone.Controller.extend({

      customConfig: undefined,

      initialize: function () {
        this.listenToOnce(Adapt, 'router:location', this.onAdaptInitialize);
      },

      onAdaptInitialize: function () {
        if (!this.checkIsCustomCompletion()) return;
        this.setupEventListeners();
      },

      checkIsCustomCompletion: function () {
        if (!Adapt.offlineStorage) return false;

        if (!Adapt.config.has('_xapi')) {
          Adapt.trigger('notify:popup', {
            title: 'Вы не подключили xapi!',
            body: 'Для корректной работы кастомного завершения необходимо расширение xapi'
          });
          return false;
        }

        if (!Adapt.config.get('_xapi')._activityID) {
          Adapt.trigger('notify:popup', {
            title: 'Вы не ввели _activityID!',
            body: 'Для корректной работы кастомного завершения необходимо ввести в xapi _activityID'
          });
          return false;
        }

        if (Adapt.config.has('_sberCompletionCriteria')) {
          this.customConfig = Adapt.config.get('_sberCompletionCriteria');
          this.customConfig['_activityID'] = Adapt.config.get('_xapi')._activityID;
        }

        return this.customConfig !== undefined;
      },

      setupEventListeners: function () {
        let model = Adapt.findById(this.customConfig._requireComponentVisited);
        Adapt.listenTo(model, 'change:_isComplete', function () {
          this.setContentCompleted();
        }.bind(this));
      },

      setContentCompleted: function () {
        const tincan = new TinCan({
          url: window.location.href
        });
        tincan.sendStatement({
          verb: {
            id: 'http://adlnet.gov/expapi/verbs/passed'
          },
          object: {
            'id': this.customConfig._activityID,
            'objectType': 'Activity'
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

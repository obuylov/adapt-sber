define([
  'core/js/adapt',
  './adapt-offlineStorage-xapi',
  './adapt-contrib-xapi',
], function (Adapt, offlineStorage) {

  Adapt.on('app:dataLoaded', initialise);
  Adapt.on('componentView:postRender', rendered);

  /**
   * rendered - Функция, которая добавляет обработчик на появившийся на странице компонент.
   * Когда компонент будет в видимости пользователя, отправится стейт, и только 1 раз.
   * Когда он пропадет, отправка будет снова разрешена.
   * @param model Модель отрендеренного компонента
   */
  function rendered(model) {
    let el = model.el; // Берем сам DOM-элемент
    let blacklist = Adapt.xapi.config._componentBlacklist || '';

    // Смотрим, что компонента нет в черном списке, и xapi вообще включен
    if (blacklist.split(',').indexOf(model.model.get('_component')) === -1 && Adapt.xapi && Adapt.xapi.config._isEnabled) {
      if (Adapt.config.get('_xapi')._coreEvents.components['change:_isExperienced']) {
        // onscreen проверяет положение элемента на экране
        $(el).on('onscreen', function (event, measurement) {
          // Элемент больше не виден
          if (measurement.percentInview <= 0) {
            // Если мы отправили стейт
            if (el.dataset.experienced === 'y') {
              // Обнуляем значение "отправленности"
              el.dataset.experienced = 'n';
            }
            return;
          }

          // Если стейт уже отправили
          if (el.dataset && el.dataset.experienced === 'y') {
            return;
          }

          // Если такого свойства нет вообще, или оно показывает,
          // Что стейтмент ещё не отправили
          if (!el.dataset.experienced || el.dataset.experienced === 'n') {
            el.dataset.experienced = 'y';
            Adapt.xapi.onItemExperience(model.model);
          }
        });
      }

      // У медиа-компонента есть свои кастомные стейтменты
      if (model.model.get('_component') === 'media' && Adapt.config.get('_xapi')._video) {
        const videoElement = model.$el.find('video')[0];
        model.model.initialVolumeChanged = false; // первый стейт всегда устанавливает аудио

        // Запускаем функции отправки при разных ситуациях
        $(videoElement).on({
          'play': function () {
            // Запуск видео, ничего дополнительного отправлять не нужно
            sendMediaStatement('played', model);
          },
          'pause': function () {
            // В событии паузы нужно отправить общую длину видео, сколько мы посмотрели, и какой % прогресса
            const duration = videoElement.duration;
            const currentTime = videoElement.currentTime;

            sendMediaStatement('paused', model, {
              'https://w3id.org/xapi/video/extensions/time': duration.toFixed(3),
            }, {
              'https://w3id.org/xapi/video/extensions/time': currentTime.toFixed(3),
              'https://w3id.org/xapi/video/extensions/progress': (currentTime / duration).toFixed(2)
            });
          },
          'ended': function () {
            sendMediaStatement('ended', model);
          },
          'seeked': function () {
            // При перемотке нужно отправить с какого и на какое время мы перепрыгнули
            sendMediaStatement('seeked', model, {
              'https://w3id.org/xapi/video/extensions/time-from': model.model.attributes.startTime.toFixed(3),
              'https://w3id.org/xapi/video/extensions/time-to': videoElement.currentTime.toFixed(3)
            });
          },
          'volumechange': function () {
            // При изменении звука мы не отправляем системную установку
            if (!model.model.initialVolumeChanged) {
              model.model.initialVolumeChanged = true;
            } else {
              sendMediaStatement('interacted', model, {
                'https://w3id.org/xapi/video/extensions/volume': videoElement.volume.toFixed(1)
              });
            }
          }
        });

        // Отдельно слушаем переключение полноэкранного режима
        $(model.$el.find('.mejs-fullscreen-button')).on('click', function () {
          // В этом стейте нужно передать full-screen (true/false), и размеры самого видео и экрана
          const isFullScreen = model.mediaElement.player.isFullScreen;
          const screenSize = Adapt.device.screenWidth + '*' + Adapt.device.screenHeight;
          const videoSize = $(model.mediaElement).width() + '*' + $(model.mediaElement).height();

          sendMediaStatement('interacted', model, {
            'https://w3id.org/xapi/video/extensions/video-playback-size': videoSize,
            'https://w3id.org/xapi/video/extensions/screen-size': screenSize,
            'https://w3id.org/xapi/video/extensions/full-screen': isFullScreen
          });
        });

        // При закрытии страницы, если не досмотрели видео, отправляем terminated
        Adapt.on('preRemove', function () {
          // Нам нужны только видео, которые уже начали смотреть, и не досмотрели
          if (model.model.get('startTime') !== 0 && !model.model.get('_isComplete')) {
            const duration = videoElement.duration;
            const currentTime = videoElement.currentTime || 0;

            sendMediaStatement('terminated', model, {
              'https://w3id.org/xapi/video/extensions/completion-threshold': '1.0',
              'https://w3id.org/xapi/video/extensions/length': model.$el.find('video')[0].duration
            }, {
              'https://w3id.org/xapi/video/extensions/time': currentTime.toFixed(3),
              'https://w3id.org/xapi/video/extensions/progress': (currentTime / duration).toFixed(2)
            });

            // Если мы ушли со страницы с медиа-компонентом, больше не нужно его искать
            Adapt.off('preRemove');
          }
        });
      }
    }
  }

  /**
   *  Отправляет стейтмент "от лица" медиа компонента.
   *
   * @param {object} verb verb to send (действие для отправки)
   * @param {object} model model of an element (модель элемента)
   * @param {object} extensions additional extensions for a statement (доп параметр для контекста)
   * @param {object} result result extension (доп параметр для результата)
   * */
  function sendMediaStatement(verb, model, extensions = {}, result = {}) {
    // Вместо Object.assign приходится использоваться метод из jQuery, чтобы работало в IE
    let resultsExtension = $.extend(result, {
      'https://w3id.org/xapi/video/extensions/time': model.$el.find('video')[0].currentTime.toFixed(3)
    });
    // getStatement, получает объекты verb, object, result(?), context(?)
    let statement = Adapt.xapi.getStatement({
        'display': {
          'en-US': verb
        },
        'id': 'http://adlnet.gov/expapi/verbs/' + verb
      },
      {
        'definition': {
          'type': 'http://adlnet.gov/expapi/activities/media',
          'name': {
            'en': model.model.get('title')
          }
        },
        'id': Adapt.xapi.attributes.activityId + '#/id/' + model.model.get('_id'),
        'objectType': 'Activity'
      },
      {
        'extensions': resultsExtension
      },
      {
        'extensions': extensions
      });

    // Добавляем группировку в контексте
    Adapt.xapi.addGroupingActivity(model.model, statement);

    Adapt.xapi.sendStatement(statement);
  }

  function initialise() {
    var config = Adapt.config.get('_xapi') || {};

    if (!config._isEnabled) {
      return;
    }

    offlineStorage.load();

    // Wait for offline storage to be restored if _shouldTrackState is enabled
    var successEvent = config._shouldTrackState ? 'xapi:stateLoaded' : 'xapi:lrs:initialize:success';

    // Ensure that the course still loads if there is a connection error
    Adapt.once('xapi:lrs:initialize:error ' + successEvent, function () {
      Adapt.offlineStorage.get();
      Adapt.offlineStorage.setReadyStatus();
    });
  }

});

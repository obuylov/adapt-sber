# Основные изменения

Для лучшей работы курса и сбора статистики было необходимо переписать текущее расширение `adapt-contrib-xapi`, добавив в
него нужный функционал, а именно:

1. Добавить в поле `context` значения:
   - `os` – текущая операционная система
   - `browser` – текущий браузер
   - `screen-size` – текущее разрешение экрана
2. Генерировать стейтмент `experienced` при каждом запуске компонентов, а не только `completed` один раз
3. Обновить видеопрофиль для компонента `media`
4. Генерировать карту курса в `tincan.xml` с подсчетом количества знаков)

Ниже описан процесс изменения исходного кода, который позволил добиться нужного функционала.

## Вывод xapi как глобальной переменной

Чтобы нормально работал код ниже, и мы могли сами отлаживать код, можно подключить xapi в Адапт. Для этого в
файле `adapt-contrib-xapi` найти строку, которая инициализирует xapi: `var xapi = xAPI.getInstance();`

Далее нужно вставить только 1 строку кода:

```javascript
Adapt.xapi = xapi;
```

## Добавление полей контекста

Все стейтменты посылаются функцией `onStatementReady`, поэтому нужно ее найти и отредактировать.

1. Задаем игрока:

```javascript
statement.actor = { "mbox": "mailto:" + pipwerks.SCORM.data.get('cmi.core.student_id') };
```

2. Получаем расширения:
     ```javascript
    let extensions = {
      'https://sberbank.ru/os': Adapt.device.OS,
      'https://sberbank.ru/browser': Adapt.device.browser,
      'https://sberbank.ru/screen-size': outerWidth + "*" + outerHeight
    };
    ```
   В самом адапте уже хранится информация о браузере и ОС, поэтому придумывать что-то свое нет необходимости. Ну а для
   размера экрана хватит стандартных JavaScript-свойств окна – `window.outerWidth` и `window.outerHeight`
3. Нужно добавить эти расширения в стейтмент, но так как их может изначально не быть, нужно это проверить:
    ```javascript
    if (!statement.context) // проверяем что контекст вообще есть
      statement.context = { // его нет, значит, нужно добавить поле
        extensions // и в него уже записать расширения
      };
    else if (!statement.context.extensions) // контекст есть, но вдруг нет расширений
      statement.context.extensions = extensions;
    else // все объекты есть, значит просто добавим новые расширения к уже имеющимся
      statement.context.extensions = Object.assign(statement.context.extensions, extensions);
    ``` 
4. Используя такую же логику, нужно добавить поле `result`, в котором будет храниться время выполнения стейта:
    ```javascript
    if (!statement.result)
      statement.result = {
        duration: this.convertMillisecondsToISO8601Duration(this.getAttemptDuration())
      };
    else if (!statement.result.duration)
      statement.result.duration = this.convertMillisecondsToISO8601Duration(this.getAttemptDuration());
    ```
   Функция `convertMillisecondsToISO8601Duration()` стандартная в `adapt-contrib-xapi`, она переводит время в секундах в
   нужный формат.
5. И остается только передать стейтмент в LRS:
    ```javascript
    let xapiState = new ADL.XAPIStatement(statement);
    let resp = ADL.XAPIWrapper.sendStatement(xapiState);
    ```

## Генерация стейтмента `experienced`

Изначально, расширение поддерживает отправку стейтмента `experienced` только при открытии меню, и при переходе на
страницу курса. Поэтому для отправки таких стейтментов, нужно добавить новый функционал.

1. Отслеживать появление каждого компонента на странице
2. При скролле проверять положение компонентов
3. Если компонент в зоне видимости, нужно отправить стейтмент
   - Отправив 1 раз, больше отправлять не нужно, пока компонент в зоне видимости пользователя
4. Еси пользователь вернулся к компоненту, нужно снова отправить стейтмент


1. Для отслеживания используется функция системное событие адапта `componentView:postRender`, срабатывающее после
   рендера компонента на странице. Её нужно вставить в файл `index.js`:
    ```javascript
    Adapt.on('componentView:postRender', rendered);
    ```     
2. Для проверки положения элемента, используется событие `onscreen`
3. Далее проверяем виден ли компонент
   - Если да, отправляем запрос, и добавляем свойство, которое показывает, что мы уже отправили
   - Если компонент не виден, обнуляем отправку

```javascript
// onscreen проверяет положение элемента на экране
    $(el).on('onscreen', function (event, measurement) {
        // элемент больше не виден
      if (measurement.percentInview <= 0) {
        // если мы отправили стейт
        if (el.dataset.experienced === 'y') {
          console.log(id + " больше не видно!");
        // обнуляем значение "отправленности"
          el.dataset.experienced = 'n';
        }
        return;
      }
      // если такого свойства нет вообще, или оно показывает, 
      // что стейтмент ещё не отправили
      if (!el.dataset.experienced || el.dataset.experienced === 'n') {
        console.log('experience ' + id);
        Adapt.xapi.onItemExperience(model.model);
        el.dataset.experienced = 'y';
      }
    });
```

## Обновление видеопрофиля для компонента `media`

Стандартный компонент `adapt-contrib-media` отправляет только состояние completed. Нам необходимо получать большее
количество статистических данных, а именно:

- Запуск видео
- Пауза
- Переметка видео
- Открытие и выход из полноэкранного режима
- Изменение громкости
- Включение субтитров
- Завершение просмотра
- Прерывание видео

Итак, для запуска кастомных стейтов, нам нужно поставить обработчики событий на необходимые ситуации:

```javascript
const videoElement = model.$el.find("video")[0];

// Запускаем функции отправки при разных ситуациях
$(videoElement).on({
  "play": function() { /*...*/ },
  "pause": function() { /*...*/ },
  ...
});
```  

События прописаны в документации, их
можно [посмотреть по ссылке](https://github.com/mediaelement/mediaelement/blob/master/docs/api.md).

Так как у всех стейтов видео-компонента схожая структура, была написана отдельная функция, генерирующая и отправляющая
стейт в правильном формате.

```
function sendMediaStatement(verb, model, extensions = {}, result = {}) {}
```

В неё обязательно нужно передать `verb` (что именно произошло), и `model` (с каким элементом), а также можно
дополнительно отправить расширния для `result` и `extensions`.

После получения данных и формирования стейта, добавляется конкетст компонента – группировка по курсу/статье, и
происходит отправка:

```
Adapt.xapi.addGroupingActivity(model.model, statement);
Adapt.xapi.sendStatement(statement);
```  

Для отправки информации о переходе в полноэкранный режим, нужно тоже добавить обработчик события:

```javascript
$(model.$el.find(".mejs-fullscreen-button")).on("click", function () {
  // В этом стейте нужно передать full-screen (true/false), и размеры самого видео и экрана
  const isFullScreen = model.mediaElement.player.isFullScreen;
  const screenSize = Adapt.device.screenWidth + "*" + Adapt.device.screenHeight;
  const videoSize = $(model.mediaElement).width() + "*" + $(model.mediaElement).height();

  sendMediaStatement("interacted", model, {
    "https://w3id.org/xapi/video/extensions/video-playback-size": videoSize,
    "https://w3id.org/xapi/video/extensions/screen-size": screenSize,
    "https://w3id.org/xapi/video/extensions/full-screen": isFullScreen
  });
});
```

Для отправки состояния `terminated` нужно поставить обработчик перехода на другую страницу, это стандартное событие
адапта, поэтому обработчик добавляется на него:

```javascript
// При закрытии страницы, если не досмотрели видео, отправляем terminated
Adapt.on("preRemove", function() {
  // Нам нужны только видео, которые уже начали смотреть, и не досмотрели
  if(model.model.get("startTime") !== 0 && !model.model.get("_isComplete")) {
    const duration = videoElement.duration;
    const currentTime = videoElement.currentTime || 0;

    // Отправляем стейтмент
    sendMediaStatement("terminated", model, {
      "https://w3id.org/xapi/video/extensions/completion-threshold": "1.0",
      "https://w3id.org/xapi/video/extensions/length": model.$el.find("video")[0].duration
    }, {
      "https://w3id.org/xapi/video/extensions/time": currentTime.toFixed(3),
      "https://w3id.org/xapi/video/extensions/progress": (currentTime / duration).toFixed(2)
    });

    // Если мы ушли со страницы с медиа-компонентом, больше не нужно его искать
    Adapt.off("preRemove");
  }
});
``` 

### Проверка компонентов на нахождение в черном списке

Так как некоторые компоненты не нужно отслеживать, например, навигацию `quicknav` и `blank`, перед запуском всех функций
и обработчиков событий, нужно реализовать проверку на нахождение компонента в черном списке.

Согласно документации, компонент в своем конфиге содержит свойство `_componentBlacklist`, которое является строкой, в
него через запятую вносятся "нежелательные" компоненты.

Для реализации такой проверки, нам нужно получить весь черный список, и перед установкой дополнительных событий
проверить компонент. Список сохраняется в отдельную переменную как строка. Если мы сразу
пропишем `Adapt.xapi.config._componentBlacklist.split(',')`, в случае если его не указали в конфигурации, может
произойти ошибка. Поэтому мы задаем значение, которое берем из конфига, а если его вообще нет, то просто пустую
строку `""`:

```javascript
let blacklist = Adapt.xapi.config._componentBlacklist || "";
```   

И остается только проверить запущен ли xapi, и находится ли наш текущий компонент в черном списке. Для этого строку с
названиями мы переведем в массив, испольлзуя функцию `split(',')`, и проверим если ли в этом массиве название
компонента:

```javascript
if (blacklist.split(',').indexOf(model.model.get("_component")) === -1 && Adapt.xapi && Adapt.xapi.config._isEnabled) {
}
``` 

Только в случае, когда компонента нет в черном списке и xapi включен, можно отслеживать состояния и отправлять запросы.

## Генерация XML-карты курса

В стандартной реализации расширения `adapt-xapi` при генерации курса, создается его минимальная карта, в которой
выводится только название и описание всего курса.

Для улучшения получаемой статистики необходимо увеличить объем получаемых данных, нужно выводить информацию о:

- стать 

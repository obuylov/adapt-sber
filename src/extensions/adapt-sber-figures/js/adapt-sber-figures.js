define([
  'core/js/adapt'
], function (Adapt) {
  // Ссылка для namespace svg-элемента
  const url = 'http://www.w3.org/2000/svg';
  /**
   * Возвращает количество фигур на странице
   * Используется для генерации id новых фигур
   * @returns {number}
   */
  const l = () => document.querySelectorAll('.figure').length;

  // Для удобства использования и добавления новых фигур они были выделены в отдельный
  // JSON-файл со свойствами для каждой нужной фигуры
  let figures = window.figures || {};
  $.ajax('assets/figures.json').done(function (data) {
    figures = data;
    window.figures = data;
  });

  class SberFiguresView extends Backbone.View {
    initialize(options) {
      super.initialize(options);

      // Добавляем мы фигуры в меню или в article
      this._target = options._target;

      // Массив для добавления статей. Для простоты оставил значение и для меню
      this._articleModels = [];

      if (this._target === 'article') {
        // Если мы добавляем фигуры в статью, то просто ищем все статьи с включенным расширением на странице
        this._articleModels = this.model.findDescendantModels('article').filter(function (el) {
          return el.get('_sberFigures') && el.get('_sberFigures')._isEnabled;
        });
      } else {
        /*
          Если мы добавляем в меню, то нужно проверить 3 вещи:
          1. Есть расширение
          2. Оно включено
          3. Нужно добавить фигуры
        */
        let _sberFigures = this.model.get('_sberFigures');
        if (_sberFigures && _sberFigures._isEnabled && _sberFigures._items.length > 0) {
          this._articleModels = [true];
        }
      }

      // Если нет статей с фигурами, и в меню добавлять не нужно, ничего не делаем
      if (this._articleModels.length === 0) {
        return;
      }

      // Нужно узнать рендера какого объекта дожидаться – страницы или меню
      let what = this._target === 'article' ? 'page' : 'menu';
      this.listenTo(Adapt, what + 'View:ready', this.onDeviceResize);

      this.listenTo(Adapt, {
        'device:resize': this.onDeviceResize,
        'remove': this.remove
      });
    }

    /**
     * Подгоняет размер фигур под размер экрана
     * Если 900 < экран < 1920, то подгонится коэффициент
     * * @param size начальный размер фигуры
     * * @returns {number} новый размер
     */
    setupFiguresRatio(size) {
      let newSize = size;

      if (innerWidth > 900 && innerWidth < 1920 && size > 300) {
        let initial_ratio = 1920 / size;
        newSize = innerWidth / initial_ratio;
      }

      return newSize;
    }

    /**
     * Отслеживает изменение экрана, а так же отвечает за первый рендер.
     * Если ширина экрана <= 900px, фигуры удаляются и не показываются
     * Если ширина больше, фигуры генерируются
     */
    onDeviceResize() {
      if (window.innerWidth <= 900) {
        $('.figures-container').each(function () {
          $(this).find('svg.figure').remove();
        });
      } else {
        if (!this.$('.figure').length) {
          this.onPageReady();
        }
      }
    }

    /**
     * Метод, который запускает рендер фигур
     * Тут происходит проверка таргета – куда вставлять фигуры
     */
    onPageReady() {
      if (this._target === 'article') {
        // Если мы добавляем фигуры в статью, то мы должны пройтись по всем статьям на странице, где есть фигуры
        for (let article of this._articleModels) {
          let id = article.get('_id');

          // $containing_el – свойство класса, которое хранит в себе элемент, в который нужно добавлять фигуры
          // В случае рендера фигур в статье, containing_element – текущая статья из цикла
          this.$containing_el = this.$('.' + id).eq(0);
          this.$containing_el.addClass('figures-container');

          // Чтобы далее можно было спокойно брать информацию из текущей статьи, создадим новое свойство
          // Все получаемые данные можно посмотреть в example.json, или в properties.schema
          this.data = article.get('_sberFigures');

          this.renderingFunction();
        }
      } else { // Фигуры нужно добавлять в меню
        // Если вдруг мы добавили фигуры, но на странице меню нет body, нужно прекратить рендер и показать ошибку
        if (!$('.menu__body').length) {
          Adapt.notify.popup({
            title: 'Ошибка в Сбер Фигурах!',
            body: 'Вы добавили фигуры, но на странице меню поле Body пустое. Фигуры некуда добавлять'
          });
        } else {
          // Текущий элемент – menu__body
          this.$containing_el = this.$('.menu__body');
          this.$containing_el.addClass('figures-container');

          this.data = this.model.get('_sberFigures');
          this.renderingFunction();
        }
      }
    }

    /**
     * Генерирует новый svg-элемент и вызывает this.createFigure()
     * Она повторяется как для отдельной статьи в цикле, так и для меню
     */
    renderingFunction() {
      // Если вдруг в настройках курса забыли фон, нужно поставить просто черный
      let color = 'linear-gradient(#000000 0%, #000000 100%);';

      // Достаем значение градиента из настроек курса
      let course_val = Adapt.course.get('_sberFigures');
      if (course_val && course_val[this.data.gradient]) {
        color = course_val[this.data.gradient];
      }

      // Для каждой фигуры из массива _items нужно сделать svg
      for (let figure of this.data._items) {
        let figure_color = color;
        // Обнуляем прошлые значения, или создаем новые
        this.svg = null;
        this.defs = null;
        this.shape = null;

        // Сохраним информацию о размере и текущей позиции, чтобы нормально передать в функцию генерации
        this.data.current_size = this.setupFiguresRatio(figure.size);
        this.data.current_height = figure.height || -1;
        this.data.current_pos = {
          top: figure.y_pos,
          left: figure.x_pos
        };

        if (figure.gradient && figure.gradient !== 'default') {
          figure_color = course_val[figure.gradient];
        }

        // Передаем что за фигуру нужно сделать, CSS-градиент и прозрачность фигуры
        this.createFigure(figure._type, figure_color, this.data._opacity);
      }
    }

    /**
     * Конвертирует RGBA в HEX формат
     * @param channels строка с rgba()
     * @returns {string} hex код
     */
    convertRGBAtoHEX(channels) {
      const hexChannels = channels.map(entry => (`0${entry.toString(16)}`).slice(-2));
      return (`#${hexChannels.join('')}`);
    }

    /**
     * Парсит RGB или RGBA в численный формат
     * @param raw строка свойств
     * @returns {*} [r, b, g, a] как числа
     */
    parseRGBA(raw) {
      return raw
        .replace(/rgba|rgb|\(|\)/g, '')
        .split(/,\s*/g)
        .map((entry, index) => {
          const number = parseFloat(entry, 10);
          return (index === 3) ? Math.floor(number * 255) : number;
        });
    }

    /**
     * Генерирует массив значений для градиента из стиля
     * @param style
     * @returns [{color, offset}] цвет и точку
     */
    generateArray(style) {
      // Создаем очищенный стиль и удаляем из него лишние части
      let clearedStyle = style;
      ['linear-gradient(', '180deg, ', ');', ';'].forEach(el => clearedStyle = clearedStyle.replace(el, ''));

      // Чтобы можно было спокойно разделить строку по пробелу и получить цвет с позицией, придется rgba переводить в hex
      clearedStyle = clearedStyle.replace(/rgba?\(\d*, \d*, \d*, \d*\.?\d*\)/gm, match => {
        return this.convertRGBAtoHEX(this.parseRGBA(match));
      });

      // Результатом будет массив объектов со значениями цвета и его позиции
      let res = [];

      for (let el of clearedStyle.split(', ')) {
        // Сначала разделили стиль и получили каждую пару "цвет-процент", а теперь и их разделяем
        let values = el.split(' ');
        let color = values[0];

        // Если в значении цвета есть градусы (не 180), нужно повернуть градиент
        if (color.match(/deg/gm)) {
          // пока не работает
          // this.current_gradient.setAttribute("gradientTransform", "rotate(" + parseFloat(color) * (Math.PI/180)+ ")");
          continue; // в массив добавлять не нужно, просто идем дальше
        }

        // Добавляем объект с цветом и процентом в формате 0.XXXX
        res.push({
          color: color,
          offset: (parseFloat(values[1]) / 100).toFixed(4),
        });
      }

      return res;
    }

    /**
     * Генерирует linearGradient и его stops
     * @param style
     * @returns {string} Ссылка на градиент
     */
    generateSVG(style) {
      // Создаем правило градиента
      this.current_gradient = document.createElementNS(url, 'linearGradient');

      // Задаем id как grad_ + индекс последней фигуры
      this.current_gradient.id = 'grad_' + l();
      this.current_gradient.setAttribute('x1', '0');
      this.current_gradient.setAttribute('x2', '0');
      this.current_gradient.setAttribute('y1', '0');
      this.current_gradient.setAttribute('y2', '1');

      // Если вдруг после градиента должна быть подложка обычным цветом, то нужно её отделить
      let bg = '';
      // Проверяем если ли в стиле похожая запись: linear-gradient(), #color
      let postBG = style.match(/%\), (#.*)/gm);
      if (postBG) { // Если все же есть, то мы сохраняем этот цвет, и удаляем его из исходной строки
        bg = postBG[0].split(' ')[1];
        style = style.replace(postBG[0], '%);');
      }

      if (bg) {
        // Если есть цвет-подложка, нам нужно:
        // 1. Скопировать текущую фигуру
        // 2. Задать ей этот фон или границу (this.toBeAdded)
        // 3. Поменять id
        // 4. Сохранить в текущем svg-элементе

        let back_shape = this.shape.cloneNode(false);
        back_shape.setAttribute(this.toBeAdded, bg.slice(0, -1));
        back_shape.id = 'shape_' + l();
        this.svg.prepend(back_shape);
      }

      // Каждая пара "цвет-положение" называется стоп
      let stops = this.generateArray(style);

      for (let stop of stops) { // Их нужно создать и добавить в текущий градиент
        let el = document.createElementNS(url, 'stop');
        el.setAttribute('offset', stop.offset);
        el.setAttribute('stop-color', stop.color);

        this.current_gradient.appendChild(el);
      }

      // Правила сохранить в defs и вернуть значение текущего градиента
      this.defs.appendChild(this.current_gradient);
      return 'url(#grad_' + l() + ')';
    }

    /**
     * Генерирует исходный код самой фигуры
     * svg, defs, path или circle
     * @param the_shape какая фигура должна появиться
     * @param style CSS градиент
     * @param opacity какая должна быть прозрачность
     */
    createFigure(the_shape, style, opacity = 1) {
      // Генерируем элементы
      this.svg = document.createElementNS(url, 'svg');
      this.defs = document.createElementNS(url, 'defs');

      // У фигур есть разные свойства, поэтому вызывается отдельная функция, которая добавит их в зависимости от фигуры
      this.generateShape(the_shape, style);

      // Задаем id, class, и другие общие свойства
      this.svg.id = 'figure_' + l();
      this.svg.classList.add('figure');
      this.svg.setAttribute('width', this.data.current_size);

      let height = this.data.current_height > 0 ? this.data.current_height : this.data.current_size;
      this.svg.setAttribute('height', height);
      this.svg.setAttribute('viewBox', '0 0 300 300');
      this.svg.setAttribute('opacity', opacity);

      // Добавляем defs в svg (в defs хранятся все градиенты)
      this.svg.appendChild(this.defs);

      // Позиционируем svg в меню или странице
      $(this.svg).css({
        top: this.data.current_pos.top + '%',
        left: this.data.current_pos.left + '%'
      });

      // Добавляем его в текущий элемент
      this.$containing_el.append(this.svg);
    }

    /**
     * Добавляет в текущую фигуру свойства в зависимости от её типа
     * Градиент и прозрачность передаются дальше в this.generateSVG()
     * @param type что за фигура
     * @param style какой у нее градиент
     */
    generateShape(type, style) {
      // Подгружаем нужные настройки для фигуры
      let data = figures[type];

      this.shape = document.createElementNS(url, data.shape);
      this.toBeAdded = data.toBeAdded;

      // Берем каждое свойство из props и задаем его как атрибут
      for (let prop in data.props) {
        if (data.props.hasOwnProperty(prop)) {
          this.shape.setAttribute(prop, data.props[prop]);
        }
      }

      // Генерируем SVG и задаем свойству fill или stroke url(#gradient)
      this.shape.setAttribute(this.toBeAdded, this.generateSVG(style));

      // Добавляем фигуру в текущий svg-элемент
      this.svg.appendChild(this.shape);
    }
  }

  if (Adapt.device.browser !== "internet explorer") {
    // Для меню и страницы одинаковый класс, отличается только _target
    Adapt.on('pageView:postRender', function (view) {
      new SberFiguresView({
        _target: 'article',
        model: view.model,
        el: view.el
      });
    });

    Adapt.on('menuView:postRender', function (view) {
      new SberFiguresView({
        _target: 'menu',
        model: view.model,
        el: view.el
      });
    });
  }
});

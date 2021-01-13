define([
  'core/js/adapt'
], function (Adapt) {
  const url = 'http://www.w3.org/2000/svg';
  const l = () => document.querySelectorAll('.figure').length;

  class SberFiguresView extends Backbone.View {
    initialize(options) {
      super.initialize(options);

      this._articleModels = this.model.findDescendantModels('article').filter(function (el) {
        return el.get('_sberFigures') && el.get('_sberFigures')._isEnabled;
      });

      if (this._articleModels.length === 0 || window.innerWidth <= 900) {
        return;
      }

      this.listenTo(Adapt, 'pageView:ready', this.onPageReady);
    }

    onPageReady() {
      for (let article of this._articleModels) {
        let id = article.get('_id');
        let el = this.$('.' + id);
        el.addClass('figures-container');

        this.data = article.get('_sberFigures');

        let color = 'linear-gradient(#000000 0%, #000000 100%);';

        let course_val = Adapt.course.get('_sberFigures');
        if (course_val && course_val[this.data.gradient]) {
          color = course_val[this.data.gradient];
        }

        for (let figure of this.data._items) {
          this.svg = null;
          this.defs = null;
          this.shape = null;

          this.data.current_size = figure.size;
          this.data.current_pos = {
            top: figure.y_pos,
            left: figure.x_pos
          };

          this.createFigure(figure._type, color, this.model.get('_opacity'));
        }
      }

      window.lastScrollingPosition = 0;
      window.onscroll = this.parallax;
    }

    convertRGBAtoHEX(channels) {
      const hexChannels = channels.map(entry => (`0${entry.toString(16)}`).slice(-2));
      return (`#${hexChannels.join('')}`);
    }

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
     * @returns [{color, offset}] – цвет и точку
     */
    generateArray(style) {
      let clearedStyle = style;
      ['linear-gradient(', '180deg, ', ');', ';'].forEach(el => clearedStyle = clearedStyle.replace(el, ''));

      clearedStyle = clearedStyle.replace(/rgba\(\d*, \d*, \d*, \d*\.?\d*\)/gm, match => {
        return this.convertRGBAtoHEX(this.parseRGBA(match));
      });

      let res = [];

      for (let el of clearedStyle.split(', ')) {
        let values = el.split(' ');
        let color = values[0];

        if (color.match(/deg/gm)) {
          // this.current_gradient.setAttribute("gradientTransform", "rotate(" + parseFloat(color) * (Math.PI/180)+ ")");
          continue;
        }

        let toAdd = {
          color: color,
          offset: (parseFloat(values[1]) / 100).toFixed(4),
        };

        res.push(toAdd);
      }

      return res;
    }

    /**
     * Генерирует СВГ элемент linearGradient и его stops
     * @param style
     */
    generateSVG(style) {

      this.current_gradient = document.createElementNS(url, 'linearGradient');

      this.current_gradient.id = 'grad_' + l();
      this.current_gradient.setAttribute('x1', '0');
      this.current_gradient.setAttribute('x2', '0');
      this.current_gradient.setAttribute('y1', '0');
      this.current_gradient.setAttribute('y2', '1');

      let bg = '';
      let postBG = style.match(/%\), (#.*)/gm);
      if (postBG) {
        bg = postBG[0].split(' ')[1];
        style = style.replace(postBG[0], '%);');
      }

      if (bg) {
        let back_shape = this.shape.cloneNode(false);
        back_shape.setAttribute(this.toBeAdded, bg.slice(0, -1));
        back_shape.id = 'shape_' + l();
        this.svg.prepend(back_shape);
      }

      let stops = this.generateArray(style);

      for (let stop of stops) {
        let el = document.createElementNS(url, 'stop');
        el.setAttribute('offset', stop.offset);
        el.setAttribute('stop-color', stop.color);

        this.current_gradient.appendChild(el);
      }

      this.defs.appendChild(this.current_gradient);
      return 'url(#grad_' + l() + ')';
    }

    createFigure(the_shape, style, opacity = 1) {
      this.svg = document.createElementNS(url, 'svg');
      this.defs = document.createElementNS(url, 'defs');

      this.generateShape(the_shape, style, opacity);

      this.svg.id = 'figure_' + l();
      this.svg.classList.add('figure');
      this.svg.setAttribute('width', this.data.current_size);
      this.svg.setAttribute('height', this.data.current_size);
      this.svg.setAttribute('viewBox', '0 0 300 300');
      this.svg.setAttribute('opacity', opacity);

      this.svg.appendChild(this.defs);

      $(this.svg).css({
        top: this.data.current_pos.top + '%',
        left: this.data.current_pos.left + '%'
      });

      this.$('.figures-container').append(this.svg);
    }

    generateShape(type, style, opacity) {
      switch (type) {
        case 'donut':
          this.shape = document.createElementNS(url, 'circle');
          this.toBeAdded = 'stroke';
          this.setAttributes('donut');
          this.shape.setAttribute('stroke-width', '70');
          this.shape.setAttribute('stroke', this.generateSVG(style, opacity));
          break;
        case 'thin_donut':
          this.shape = document.createElementNS(url, 'circle');
          this.toBeAdded = 'stroke';
          this.setAttributes('donut');
          this.shape.setAttribute('stroke-width', '40');
          this.shape.setAttribute('stroke', this.generateSVG(style, opacity));
          break;
        case 'circle':
          this.shape = document.createElementNS(url, 'circle');
          this.toBeAdded = 'fill';
          this.setAttributes('circle');
          this.shape.setAttribute('fill', this.generateSVG(style, opacity));
          break;
        case 'rect':
          this.shape = document.createElementNS(url, 'path');
          this.toBeAdded = 'fill';
          this.shape.setAttribute('d', 'M43.1449 19.299C47.6773 7.52185 59.0953 -0.159897 71.7123 0.0795716L228.112 3.04801C243.555 3.34112 256.252 15.3125 257.452 30.7119L271.193 207.047C272.869 228.563 251.961 244.757 231.548 237.754L20.296 165.274C4.2141 159.756 -4.07296 141.99 2.03371 126.123L43.1449 19.299Z');
          this.shape.setAttribute('transform', 'translate(0 40)');
          this.shape.setAttribute('fill', this.generateSVG(style, opacity));
          break;
        case 'pentagon':
          this.shape = document.createElementNS(url, 'path');
          this.toBeAdded = 'fill';
          this.shape.setAttribute('d', 'M0.237303 80.4142C-0.580731 71.7342 4.31818 63.5244 12.3456 60.1227L148.359 2.48514C156.297 -0.878593 165.497 1.22265 171.187 7.69901L269.243 119.299C274.973 125.821 275.841 135.294 271.393 142.749L195.962 269.159C191.513 276.614 182.764 280.347 174.303 278.401L29.5262 245.099C21.1246 243.166 14.9068 236.068 14.0979 227.485L0.237303 80.4142Z');
          this.shape.setAttribute('transform', 'translate(20 15)');
          this.shape.setAttribute('fill', this.generateSVG(style, opacity));
          break;
      }

      this.svg.appendChild(this.shape);
    }

    setAttributes(shape) {
      switch (shape) {
        case 'circle':
          this.shape.setAttribute('cx', 150);
          this.shape.setAttribute('cy', 150);
          this.shape.setAttribute('r', 120);
          break;
        case 'donut':
          this.setAttributes('circle');
          this.shape.setAttribute('r', 100);
          this.shape.setAttribute('fill', 'transparent');
      }
    }

    parallax() {
      $('.figure').each(function () {
        if ($(this).offset().top + $(this).height() < pageYOffset || $(this).offset().top >= pageYOffset + innerHeight) {
          return;
        }

        let goingDown = pageYOffset > window.lastScrollingPosition;
        $(this).css('top', goingDown ? '-=1px' : '+=1px');
      });

      window.lastScrollingPosition = window.pageYOffset;
    }
  }

  Adapt.on('pageView:postRender', function (view) {
    var model = view.model;
    new SberFiguresView({
      model: model,
      el: view.el
    });
  });
});

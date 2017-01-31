/**
* Novacancy
* jQuery Text Blink Neon Golden effect Plugin
*
* @author Chuck Chang <eurt23@gmail.com>
* @github <https://github.com/chuckyglitch>
* @twitter <https://twitter.com/chuckyglitch>
*
* @repo https://github.com/chuckyglitch/novacancy.js
* @version 0.6
* @license MIT http://opensource.org/licenses/MIT
* @date 08-03-2016
*/

;(function(){
  "use strict";

  var Novacancy = function(el, settings) {
    var _me = this;
    var _settings;
    var _powerOn;
    var _loopTimeout;
    var _items;
    var _blinkArr;

    /* ------------------------- */

    this.repeat = function() {
      if (el.novacancy) {
        return true;
      } else {
        el.novacancy = true;
        return false;
      }
    };

    this.writeCSS = function() {
      var cssBuilder = _me.css();
      var style = '<style>'+cssBuilder+'</style>';
      document.querySelectorAll('body')[0].insertAdjacentHTML('beforeend',style);
    };

    this.selector = function() {
      var selector = el.tagName;
      if (el.id) selector += ("#" + el.id);
      if (el.className) selector += ("." + el.className);

      return selector;
    };

    this.css = function() {
      var selector = this.selector();

      var colorOn = '';
      var colorOff = '';
      var textShadow = '';

      if (_settings.color !== null) {
        colorOn += ('color: '+_settings.color+';');
        colorOff += ('color: '+_settings.color+'; opacity: 0.3;');
      };

      if (_settings.glow !== null) {
        textShadow += ('text-shadow: '+_settings.glow.toString()+';');
        colorOn += textShadow;
      };

      var css = '';
      css += (selector+' .novacancy.'+_settings.classOn+' { '+colorOn+' }'+'\n');
      css += (selector+' .novacancy.'+_settings.classOff+' { '+colorOff+' }'+'\n');

      return css;
    };

    this.rand = function(min, max) {
      return Math.floor(Math.random()*(max-min+1)+min);
    };

    this.blink = function(item) {
      /* blink 1 time */
      _me.off(item);
      item.blinking = true;
      setTimeout(function() {
        _me.on(item);
        item.blinking = false;
        _me.reblink(item);
      }, _me.rand(_settings.blinkMin, _settings.blinkMax) );
    };

    this.reblink = function (item) {
      setTimeout(function() {
        /* continue blink check */
        if (_me.rand(1,100) <= _settings.reblinkProbability) {
          _me.blink(item);
        }
      }, _me.rand(_settings.blinkMin, _settings.blinkMax) );
    };

    this.on = function(item) {
      removeClass(item,_settings.classOff);
      addClass(item,_settings.classOn);
    };

    this.off = function(item) {
      removeClass(item,_settings.classOn);
      addClass(item,_settings.classOff);
    };

    this.buildHTML = function() {
      var htmlBuilder = '';

      Array.prototype.forEach.call(el.childNodes, function(value, index){
        if (value.nodeType == 3) { /* text */
          var txts = value.nodeValue.split('');
          Array.prototype.forEach.call(txts, function(value, index){
            htmlBuilder += ( '<span class="novacancy '+_settings.classOn+'">'+value+'</span>' );
          });
        } else {
          htmlBuilder += value.outerHTML;
        }
      });

      return htmlBuilder;
    };

    this.arrayMake = function() {
      var len = _items.length;
      var randomArray = _me.randomArray(len);
      var blinkArr;
      var offArr;
      var off = _settings.off;
      var blink = _settings.blink;

      /* off make */

      off = Math.min(off, len);
      off = Math.max(0, off);

      offArr = randomArray.splice(0, off);

      Array.prototype.forEach.call(offArr, function(value, index){
        _me.off(_items[value]);
      });

      /* blink array make */

      blink = (blink===0) ? len : blink;
      blink = Math.min(blink, len - off);
      blink = Math.max(0, blink);

      blinkArr = randomArray.splice(0, blink);

      return blinkArr;
    };

    this.randomArray = function(n) {
      var ary = [];
      var i;
      var r;
      var t;

      for (i = 0 ; i < n ; ++i) {
        ary[i] = i;
      }
      for (i = 0 ; i < n ; ++i) {
        r = parseInt((Math.random() * n), 10);
        t = ary[r];
        ary[r] = ary[i];
        ary[i] = t;
      }
      return ary;
    };

    this.loop = function() {
      if (!_powerOn) return;
      if (_blinkArr.length===0) return;

      var num;
      var item;

      num = _blinkArr[_me.rand(0, _blinkArr.length-1)];  
      item = _items[num];

      if (!item.blinking) _me.blink(item);

      _loopTimeout = setTimeout(function() {
        _me.loop();
      }, _me.rand(_settings.loopMin, _settings.loopMax));
    };

    this.blinkOn = function() {
      if (!_powerOn) {
        _powerOn = true;
        _loopTimeout = setTimeout(function() {
          _me.loop();
        }, _me.rand(_settings.loopMin, _settings.loopMax));
      }
    };

    this.blinkOff = function() {
      if (_powerOn) {
        _powerOn = false;
        clearTimeout(_loopTimeout);
      }
    };

    this.bindEvent = function() {
      el.addEventListener('blinkOn', function(e) {
        _me.blinkOn();
      });
      el.addEventListener('blinkOff', function(e) {
        _me.blinkOff();
      });
    };

    /* ------------------------- */

    if (_me.repeat()) return true; /* avoid repeat */

    _settings = settings;
    _powerOn = false;
    _loopTimeout = 0;
    el.innerHTML = _me.buildHTML();
    _items = el.querySelectorAll('span.novacancy');
    _blinkArr = _me.arrayMake();
    _me.bindEvent();
    _me.writeCSS();

    if (_settings.autoOn) _me.blinkOn();

  };

  /* ------------------------- */

  var extend = function(out) {
    out = out || {};
    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i])
        continue;
      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key))
          out[key] = arguments[i][key];
      }
    }
    return out;
  };

  var removeClass = function(el, className) {
    if (el.classList)
      el.classList.remove(className);
    else
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  };

  var addClass = function(el, className) {
    if (el.classList)
      el.classList.add(className);
    else
      el.className += ' ' + className;
  };

  var settings = function(options){
    var settings = extend({
      'reblinkProbability': (1/3),
      'blinkMin': 0.01,
      'blinkMax': 0.5,
      'loopMin': 0.5,
      'loopMax': 2,
      'color': 'ORANGE',
      'glow': ['0 0 80px Orange', '0 0 30px Red', '0 0 6px Yellow'],
      'off': 0,
      'blink': 0,
      'classOn': 'on',
      'classOff': 'off',
      'autoOn': true
    }, options);

    settings.reblinkProbability *= 100;
    settings.blinkMin *= 1000;
    settings.blinkMax *= 1000;
    settings.loopMin *= 1000;
    settings.loopMax *= 1000;

    return settings;
  };

  window.novacancy = {};

  window.novacancy.init = function(el, options){
    return Array.prototype.forEach.call(el, function(index, value){
      new Novacancy(el[0], settings(options));
    });
  }

})();
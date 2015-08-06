;(function(window, undefined){
 'use strict';

  var PI2 = Math.PI * 2;
  var controls = [];
  var fullWindowStyles = [
    'width: 100%',
    'height: 100%',
    'margin: 0',
    'padding: 0',
    'border: 0',
    'overflow: hidden',
    'position: fixed',
    'top: 0',
    'left: 0'
  ].join(';');
  var outputs = [];
  var touches = [];

  function createId(){ return Date.now(); }
  function defer (fn){ setTimeout(fn, 10); }
  function extend (a, b){
    Object.keys(b).forEach(function(k){ a[k] = b[k]; });
    return a;
  }
  function unit(n){ return n > 1 ? 1 : n < -1 ? -1 : n; }

  function testCircle (circle, point){
    return point.x < circle.x + circle.radius &&
      point.x > circle.x - circle.radius &&
      point.y < circle.y + circle.radius &&
      point.y > circle.y - circle.radius;
  }

  function createCircleImage(radius, color){
    var canvas = document.createElement('canvas');
    var d = radius * 2;
    canvas.width = d;
    canvas.height = d;
    canvas.style.cssText = [
      'width:' + d + 'px',
      'height:' + d + 'px'
    ].join(';');
    var context = canvas.getContext('2d');
    context.beginPath();
    context.fillStyle = color;
    context.arc(radius, radius, radius, 0, PI2, false);
    context.fill();
    return canvas;
  }

  var positioner = {
    top: function(o, y){ o.y = y; },
    right: function(o, x){ o.x = window.innerWidth - x; },
    bottom: function(o, y){ o.y = window.innerHeight - y; },
    left: function(o, x){ o.x = x; }
  };

  function Control(){}
  Control.prototype.init = function(options){
    extend(this, options);
    this.id = createId();
    this.image = createCircleImage(this.radius, options.color);

    Object.keys(options).forEach(function(k){
      if (positioner[k]) positioner[k](this, options[k]);
    }, this);

    controls.push(this);
    outputs.push({
      nx: 0,
      ny: 0,
      isDown: false
    });
  };
  Control.prototype.draw = function(context){
    context.drawImage(this.image, this.x - this.radius, this.y - this.radius);
  };

  function clearOutput(touch){
    for (var i = 0; i < controls.length; i++){
      if (touch && testCircle(controls[i], {x: touch.startX, y: touch.startY})){
        outputs[i].nx = 0;
        outputs[i].ny = 0;
        outputs[i].isDown = false;
        return touch;
      }
    }
  }

  function updateOutputs(touch){
    var c;
    for (var i = 0; i < controls.length; i++){
      c = controls[i];
      if (touch && testCircle(c, {x: touch.startX, y: touch.startY})){
        outputs[i].nx = unit((touch.x - c.x) / c.radius);
        outputs[i].ny = unit((touch.y - c.y) / c.radius);
        outputs[i].isDown = true;
        return touch;
      }
    }
  }

  function touchstart(e){
    e.preventDefault();
    for (var t, i = 0; i < e.changedTouches.length; i++) {
      t = e.changedTouches[i];
      touches[t.identifier] = updateOutputs({
        startX: t.clientX,
        startY: t.clientY,
        x: t.clientX,
        y: t.clientY
      });
    }
  }

  function touchmove(e){
    e.preventDefault();
    for (var i = 0; i < e.changedTouches.length; i++){
      var t = e.changedTouches[i];
      touches[t.identifier].x = t.clientX;
      touches[t.identifier].y = t.clientY;
      updateOutputs(touches[t.identifier]);
    }
  }

  function touchend(e){
    e.preventDefault();
    for (var id, i = 0; i < e.changedTouches.length; i++){
      id = e.changedTouches[i].identifier;
      clearOutput(touches[id]);
      touches[id] = undefined;
    }
  }

  var GameController = {
    outputs: outputs,
    createCircleImage: createCircleImage,

    /**
     * options = {controls: [{control1}, {control2}, ... ]}
     * control = {
        left|right: pixels
        top|bottom: pixels
        radius: pixels
        color: 'rgba(0,f,0,0.7)' | '#0f0' | '#00ff00'
      }
     */
    init: function(options){
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.style.cssText = fullWindowStyles;
      document.body.appendChild(canvas);

      var joystick = new Control();
      var button = new Control();

      options.controls.forEach(function(controlOptions){
        (new Control()).init(controlOptions);
      });

      canvas.addEventListener('touchstart', touchstart);
      canvas.addEventListener('touchmove', touchmove);
      canvas.addEventListener('touchend', touchend);

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        defer(function(){
          controls.forEach(function(c){
            Object.keys(c).forEach(function(k){
              if (positioner[k]) positioner[k](c, c[k]);
            }, this);

            c.draw(context);
          });
        });
      }

      window.addEventListener('resize', resize);
      resize();
    }
  };

  window.GameController = GameController;
})(window);

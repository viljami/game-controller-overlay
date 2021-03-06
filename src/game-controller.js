;(function(window, undefined){
 'use strict';

  var PI2 = Math.PI * 2;

  var canvas;
  var context;
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
    'left: 0',
    'bottom: 0',
    'right: 0'
  ].join(';');
  var outputs = [];
  var parentElement;
  var positioner = {
    top: function(o, y){ o.y = y; },
    right: function(o, x){ o.x = window.innerWidth - x; },
    bottom: function(o, y){ o.y = window.innerHeight - y; },
    left: function(o, x){ o.x = x; }
  };
  var touches = [];

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
  function createId(){ return Date.now(); }
  function defer (fn){ setTimeout(fn, 10); }
  function extend (a, b){
    Object.keys(b).forEach(function(k){ a[k] = b[k]; });
    return a;
  }
  function testCircle (circle, point){
    return point.x < circle.x + circle.radius &&
      point.x > circle.x - circle.radius &&
      point.y < circle.y + circle.radius &&
      point.y > circle.y - circle.radius;
  }
  function unit(n){ return n > 1 ? 1 : n < -1 ? -1 : n; }


  function Control(){}

  Control.prototype.init = function(options){
    extend(this, options);
    this.id = createId();
    this.image = createCircleImage(this.radius, options.color);

    Object.keys(options).forEach(function(k){
      if (positioner[k]) positioner[k](this, options[k]);
    }, this);

    outputs.push({
      nx: 0,
      ny: 0,
      isDown: false
    });

    return this;
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
    e.stopPropagation();

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
    e.stopPropagation();

    for (var i = 0; i < e.changedTouches.length; i++){
      var t = e.changedTouches[i];
      if (! touches[t.identifier]) return;
      touches[t.identifier].x = t.clientX;
      touches[t.identifier].y = t.clientY;
      updateOutputs(touches[t.identifier]);
    }
  }

  function touchend(e){
    e.preventDefault();
    e.stopPropagation();

    for (var id, i = 0; i < e.changedTouches.length; i++){
      id = e.changedTouches[i].identifier;
      clearOutput(touches[id]);
      touches[id] = undefined;
    }
  }


  var GameController = {
    outputs: outputs,
    createCircleImage: createCircleImage, // Todo: remove

    /**
     * GameController is fullscreen singleton (for now)
     *
     * options = {
     *   parentElement: parent of canvas (optional)
     *   canvas: canvasElement (optional)
     *   controls: [{controlDefinition}, {controlDefinition}, ... ]
     *  }
     *
     * controlDefinition = {
        left|right: pixels
        top|bottom: pixels
        radius: pixels
        color: 'rgba(0,f,0,0.7)' | '#0f0' | '#00ff00'
      }
     */
    init: function(options){
      if (canvas) return;

      parentElement = options.parentElement || document.body;
      canvas = options.canvas || document.createElement('canvas');

      context = canvas.getContext('2d');
      controls = [];

      canvas.style.cssText = fullWindowStyles;
      if (! canvas.parentElement) parentElement.appendChild(canvas);

      options.controls.forEach(function(controlOptions){
        controls.push((new Control()).init(controlOptions));
      });

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
    },

    enable: function(){
      if (! canvas) return;
      canvas.style.display = 'block';
      canvas.addEventListener('touchstart', touchstart);
      canvas.addEventListener('touchmove', touchmove);
      canvas.addEventListener('touchend', touchend);
    },

    disable: function(){
      if (! canvas) return;
      canvas.style.display = 'none';
      canvas.addEventListener('touchstart', touchstart);
      canvas.addEventListener('touchmove', touchmove);
      canvas.addEventListener('touchend', touchend);
    }
  };

  window.GameController = GameController;
})(window);

;(function(window, undefined){
  'use strict';

  var el = document.createElement('div');
  el.style.cssText = [
    'position:fixed',
    'top: 0',
    'left: 0',
    'right: 0',
    'bottom:0',
    'z-index:-9999',
    'overflow:hidden',
    'margin:0',
    'padding:0'
  ].join(';');
  document.body.appendChild(el);

  window.getSize = function(){ return el.getBoundingClientRect(); };
})(window);

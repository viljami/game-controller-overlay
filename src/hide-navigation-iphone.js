;(function(window, undefined){
  'use strict';

  window.addEventListener('load',function() {
    console.log('load');
    window.scrollTo(0, 0);
    setTimeout(function(){
      window.scrollTo(0, 10);
    }, 100);
  });
})(window);

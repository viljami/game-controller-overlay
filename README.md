# Game Controller Overlay

Game controller overlay for touch capable devices.

# Sample usage

``` 
  var o = new CoolCharacter();

  GameController.init({
    controls: [{
      left: 60,
      bottom: 60,
      radius: 30,
      color: 'rgba(0,0,0,0.7)'
    }, {
      right: 60,
      bottom: 60,
      radius: 20,
      color: 'rgba(255,0,0,0.7)'
    }]
  });

  var outputs = GameController.outputs;

  function update (){
    requestAnimationFrame(update);

    o.x += outputs[0].nx < 0 ? -1 : outputs[0].nx > 0 ? 1 : 0;
    o.y += outputs[0].ny < 0 ? -1 : outputs[0].ny > 0 ? 1 : 0;

    context.clearRect(0,0,window.innerWidth, window.innerHeight);
    context.drawImage(o.image, o.x - o.r, o.y - o.r);
  }
  update();

```

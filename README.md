# Game Controller Overlay

Game controller overlay for touch capable devices. Purpose is to keep it as light weight as possible. 

Initialise with needed controls and their positions

```
GameControls.init({
  controls: [{
    left|right: pixels,
    top|bottom: pixels,
    radius: pixels,
    color: 'rgba(0,f,0,1)' | '#00ff00'  
  }]
});
```

Use conrols in the order they were given to GameControls.

```
var joystick = GameControls.outputs[0];
```

All controls have 
  * nx and ny coordinate which are relative to center and radius of the controls
  * if input is "down" is always indicated with "isDown" (useful for making buttons, modal joystics... )

```
if (joystick.isDown) ...  // => true / false
```


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

  var joystick = GameController.outputs[0];
  var buttonA = GameController.outputs[1];

  function update (){
    requestAnimationFrame(update);

    // normalised coordinate relative to circle center and radius
    o.x += joystick.nx; 
    o.y += joystick.ny;

    if (buttonA.isDown) o.jump();

    ...
  }
  update();

```


# Todo:

  * Improve nx and ny to be truly normalised by default

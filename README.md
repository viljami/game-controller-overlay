# Game Controller Overlay

Game controller overlay for touch capable devices. Purpose is to keep it as light weight as possible. 

Test Game Controller here: http://viljami.github.io/game-controller-overlay/

Inspired by: https://github.com/austinhallock/html5-virtual-game-controller

## Development

  * Build source:
```
gulp
```

  * Run test app ( starts at: http://localhost:3000 )
```
gulp serve
```

## Introduction

Initialise with needed controls and their positions

```
// Init prepares controls and shows them. 
// To start listening input call GameControls.enable()
GameControls.init({
  controls: [{
    left|right: pixels,
    top|bottom: pixels,
    radius: pixels,
    color: 'rgba(0,f,0,1)' | '#00ff00'  
  }]
});

GameControls.enable(); // start listening input
```

Use controls in the order they were given to GameControls.

```
var joystick = GameControls.outputs[0];
```

All controls have 
  * nx and ny coordinate which are relative to center and radius of the controls
  * if input is "down" is always indicated with "isDown" (useful for making buttons, modal joystics... )

nx and ny are not truly normalised. When touch is outside of the radius of the control the normalisation is greater than 1. Relative to difference between center point and radius of the component.

```
if (joystick.isDown) ...  // => true / false
```


## Sample usage

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

  GameControls.enable();

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

## Options

  * parentElement (optional) - Where to place the canvas (default: document.body) 
    * if canvas has already parent option.parentElement does not have effect
  * canvas (optional) - CanvasElement to use  
  * controls - array of control definitions (compulsory in case you want controls) 

## Improve

Please, feel free to send me feedback:
  * twitter: https://twitter.com/viljamipeltola

In case you find bugs please submit them as github issues. I am open to all improvement ideas! 

If you want to conribute I guess easiest way is to create a fork of this repository, commit you changes to the fork and create a pull request for me to review. At least for now. 


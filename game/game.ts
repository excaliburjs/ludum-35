/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="analytics.ts" />
/// <reference path="config.ts" />
/// <reference path="resources.ts" />
/// <reference path="stats.ts" />
/// <reference path="ship.ts" />

var game = new ex.Engine({
   canvasElementId: "game",
   width: Config.width,
   height: Config.height,
});

game.backgroundColor = ex.Color.Black.clone();
game.setAntialiasing(false);
game.input.keyboard.on('down', (evt: ex.Input.KeyEvent) => {
   if(evt.key === ex.Input.Keys.D){
      game.isDebug = !game.isDebug;
   }
});

// create loader
var loader = new ex.Loader();
for(var res in Resources){
   loader.addResource(Resources[res]);
}

function init(){
   // put game bootstrap in here;
   var ship = new Ship(100, 100, 100, 100);
  
   game.add(ship);
}

game.start(loader).then(init);
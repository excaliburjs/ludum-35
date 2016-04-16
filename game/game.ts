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

function init(){
   // put game bootstrap in here;
   var ship = new Ship(100, 100, 100, 100);
   ship.on('preupdate', (evt: ex.PreUpdateEvent) => {
      //console.log(`Update: ${evt.delta}`);
      evt.engine.input.pointers.primary.on('down', (click: ex.Input.PointerEvent) => {
         var dx = click.x - ship.x;
         var dy = click.y - ship.y;
         
         ship.dx = dx * Config.shipSpeedScale;
         ship.dy = dy * Config.shipSpeedScale;
      });
   });
   
   game.add(ship);
}

game.start().then(init);
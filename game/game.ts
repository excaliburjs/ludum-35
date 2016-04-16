/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="analytics.ts" />
/// <reference path="config.ts" />
/// <reference path="resources.ts" />
/// <reference path="stats.ts" />

var game = new ex.Engine({
   canvasElementId: "game",
   width: Config.width,
   height: Config.height
});
game.setAntialiasing(false);

function init(){
   // put game bootstrap in here;
}

game.start().then(init);
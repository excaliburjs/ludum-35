/// <reference path="analytics.ts" />
/// <reference path="config.ts" />
/// <reference path="resources.ts" />
/// <reference path="stats.ts" />

var game = new ex.Engine({
   canvasElementId: "game",
   width: 960,
   height: 640
});
game.setAntialiasing(false);

game.start();
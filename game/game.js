var Analytics = (function () {
    function Analytics() {
    }
    return Analytics;
}());
var Config = {};
var Resources = {};
var Stats = (function () {
    function Stats() {
    }
    return Stats;
}());
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
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
//# sourceMappingURL=game.js.map
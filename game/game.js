var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// wire into app insights to send events to our anlytics provider, trackEvent
// documentation
//https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md
var Analytics = (function () {
    function Analytics() {
    }
    return Analytics;
}());
var Config = {
    width: 960,
    height: 640,
    // Ship config
    shipSpeedScale: .2
};
var Resources = {};
// keep game stats here, score, powerup level, etc
var Stats = (function () {
    function Stats() {
    }
    return Stats;
}());
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship(x, y, width, height) {
        _super.call(this, x, y, width, height);
        this.color = ex.Color.Red.clone();
        this.onInitialize = function (engine) {
            //initialize ship 
        };
    }
    return Ship;
}(ex.Actor));
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="analytics.ts" />
/// <reference path="config.ts" />
/// <reference path="resources.ts" />
/// <reference path="stats.ts" />
/// <reference path="ship.ts" />
var game = new ex.Engine({
    canvasElementId: "game",
    width: Config.width,
    height: Config.height
});
game.backgroundColor = ex.Color.Black.clone();
game.setAntialiasing(false);
game.input.keyboard.on('down', function (evt) {
    if (evt.key === ex.Input.Keys.D) {
        game.isDebug = !game.isDebug;
    }
});
function init() {
    // put game bootstrap in here;
    var ship = new Ship(100, 100, 100, 100);
    ship.on('preupdate', function (evt) {
        //console.log(`Update: ${evt.delta}`);
        evt.engine.input.pointers.primary.on('down', function (click) {
            var dx = click.x - ship.x;
            var dy = click.y - ship.y;
            ship.dx = dx * Config.shipSpeedScale;
            ship.dy = dy * Config.shipSpeedScale;
        });
    });
    game.add(ship);
}
game.start().then(init);
//# sourceMappingURL=game.js.map
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
    // Camera
    CameraElasticity: .01,
    CameraFriction: .21,
    shipSpeedScale: .2,
    poolSizeIncrement: 100,
    // Bullet config
    bullets: {
        speed: 5,
        damage: 1
    },
    badguy: {
        speed: 1,
        size: 1 //multiplier from original?
    }
};
var Resources = {
    ShipSpriteSheet: new ex.Texture('./img/ship.png'),
    CircleShieldSheet: new ex.Texture('./img/circlesheild.png'),
    SquareShieldSheet: new ex.Texture('./img/squaresheild.png'),
    TriangleShieldSheet: new ex.Texture('./img/trianglesheild.png'),
    PlayerBullet: new ex.Texture('./img/playerbullet.png'),
    CircleBullet: new ex.Texture('./img/bullets/blueBullet.png'),
    SquareBullet: new ex.Texture('./img/bullets/greenBullet.png'),
    TriangleBullet: new ex.Texture('./img/bullets/yellowBullet.png')
};
// keep game stats here, score, powerup level, etc
var Stats = (function () {
    function Stats() {
    }
    return Stats;
}());
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="resources.ts" />
var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship(x, y, width, height) {
        var _this = this;
        _super.call(this, x, y, width, height);
        this.sheildType = "square";
        this.color = ex.Color.Red.clone();
        var shipSheet = new ex.SpriteSheet(Resources.ShipSpriteSheet, 3, 1, 32, 42);
        var squareSheild = new ex.SpriteSheet(Resources.SquareShieldSheet, 5, 1, 48, 48);
        var circleSheild = new ex.SpriteSheet(Resources.CircleShieldSheet, 5, 1, 48, 48);
        var triangleSheild = new ex.SpriteSheet(Resources.TriangleShieldSheet, 5, 1, 48, 48);
        this.scale.setTo(2, 2);
        this.anchor.setTo(.5, .5);
        this.setCenterDrawing(true);
        this.onInitialize = function (engine) {
            var ship = _this;
            var anim = shipSheet.getAnimationForAll(engine, 150);
            anim.rotation = Math.PI / 2;
            anim.loop = true;
            anim.anchor.setTo(.5, .5);
            _this.addDrawing('default', anim);
            _this._circle = circleSheild.getAnimationForAll(engine, 50);
            _this._circle.loop = true;
            _this._circle.anchor.setTo(.5, .5);
            _this._square = squareSheild.getAnimationForAll(engine, 50);
            _this._square.loop = true;
            _this._square.anchor.setTo(.5, .5);
            _this._triangle = triangleSheild.getAnimationForAll(engine, 50);
            _this._triangle.loop = true;
            _this._triangle.anchor.setTo(.5, .5);
            //initialize ship 
            ship.on('preupdate', function (evt) {
                //console.log(`Update: ${evt.delta}`);
                evt.engine.input.pointers.primary.on('down', function (click) {
                    var dx = click.x - ship.x;
                    var dy = click.y - ship.y;
                    ship.dx = dx * Config.shipSpeedScale;
                    ship.dy = dy * Config.shipSpeedScale;
                    ship.rotation = (new ex.Vector(dx, dy)).toAngle();
                });
            });
            ship.on('predraw', function (evt) {
                if (_this.sheildType === "circle") {
                    _this._circle.draw(evt.ctx, 0, 0);
                }
                if (_this.sheildType === "square") {
                    _this._square.draw(evt.ctx, 0, 0);
                }
                if (_this.sheildType === "triangle") {
                    _this._triangle.draw(evt.ctx, 0, 0);
                }
            });
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
// create loader
var loader = new ex.Loader();
for (var res in Resources) {
    loader.addResource(Resources[res]);
}
var ship;
function init() {
    // put game bootstrap in here;
    ship = new Ship(100, 100, 100, 100);
    game.add(ship);
}
var cameraVel = new ex.Vector(0, 0);
game.on('update', function (evt) {
    // Grab the current focus of the camper
    var focus = game.currentScene.camera.getFocus().toVector();
    // Grab the "destination" position, in the spring equation the displacement location
    var position = new ex.Vector(ship.x, ship.y);
    // Calculate the strech vector, using the spring equation
    // F = kX
    // https://en.wikipedia.org/wiki/Hooke's_law
    // Apply to the current camera velocity
    var stretch = position.minus(focus).scale(Config.CameraElasticity);
    cameraVel = cameraVel.plus(stretch);
    // Calculate the friction (-1 to apply a force in the opposition of motion)
    // Apply to the current camera velocity
    var friction = cameraVel.scale(-1).scale(Config.CameraFriction);
    cameraVel = cameraVel.plus(friction);
    // Update position by velocity deltas
    focus = focus.plus(cameraVel);
    // Set new position on camera
    game.currentScene.camera.setFocus(focus.x, focus.y);
});
game.start(loader).then(init);
//# sourceMappingURL=game.js.map
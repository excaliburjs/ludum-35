var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Shape;
(function (Shape) {
    Shape[Shape["Shape1"] = 0] = "Shape1";
    Shape[Shape["Shape2"] = 1] = "Shape2";
    Shape[Shape["Shape3"] = 2] = "Shape3";
})(Shape || (Shape = {}));
var WeaponBase = (function () {
    function WeaponBase(interval, source) {
        var _this = this;
        this.interval = interval;
        this.source = source;
        this._bulletTimer = new ex.Timer(function () { return _this.shoot(); }, interval, true);
    }
    WeaponBase.prototype.update = function (delta) {
        this._bulletTimer.update(delta);
    };
    WeaponBase.prototype.shoot = function () {
        // override
    };
    return WeaponBase;
}());
var StraightShooter = (function (_super) {
    __extends(StraightShooter, _super);
    function StraightShooter(source, speed, damage) {
        _super.call(this, 500, source);
        this.source = source;
        this.speed = speed;
        this.damage = damage;
    }
    StraightShooter.prototype.shoot = function () {
        // spawn bullet traveling in direction actor is facing
        GameState.state.bullets.spawn({
            d: ex.Vector.fromAngle(this.source.rotation),
            damage: this.damage,
            x: this.source.x,
            y: this.source.y,
            speed: this.speed
        });
    };
    return StraightShooter;
}(WeaponBase));
var Resources = {
    ShipSpriteSheet: new ex.Texture('./img/ship.png'),
    CircleShieldSheet: new ex.Texture('./img/circlesheild.png'),
    SquareShieldSheet: new ex.Texture('./img/squaresheild.png'),
    TriangleShieldSheet: new ex.Texture('./img/trianglesheild.png'),
    PlayerBullet: new ex.Texture('./img/playerbullet.png'),
    CircleBadguySheet: new ex.Texture('./img/circlebadguy.png'),
    TriangleBadguySheet: new ex.Texture('./img/trianglebadguy.png'),
    SquareBadguySheet: new ex.Texture('./img/squarebadguy.png'),
    CircleBullet: new ex.Texture('./img/bullets/blueBullet.png'),
    SquareBullet: new ex.Texture('./img/bullets/greenBullet.png'),
    TriangleBullet: new ex.Texture('./img/bullets/yellowBullet.png')
};
var Config = {
    width: 960,
    height: 640,
    // Camera
    CameraElasticity: .08,
    CameraFriction: .41,
    shipSpeedScale: .2,
    spaceFriction: .2,
    poolSizeIncrement: 100,
    // Starfield
    StarfieldSize: 1000,
    StarfieldMinFade: 0.2,
    StarfieldMaxFade: 0.7,
    StarfieldMinFadeRefreshAmount: 0.05,
    StarfieldMaxFadeRefreshAmount: 0.15,
    StarfieldRefreshRate: 300,
    StarfieldMeteorFreqMin: 2000,
    StarfieldMeteorFreqMax: 7000,
    StarfieldMeteorSpeed: 320,
    // Bullet config
    bullets: {
        speed: 200,
        damage: 1
    },
    badguy: {
        speed: 1,
        size: 1 //multiplier from original?
    }
};
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="shape.ts" />
/// <reference path="weapon.ts" />
/// <reference path="resources.ts" />
/// <reference path="config.ts" />
/// <reference path="stateful.ts" />
/// <reference path="gamestate.ts" />
var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship(x, y, width, height) {
        _super.call(this, x, y, width, height);
        this.color = ex.Color.Red.clone();
        this.scale.setTo(2, 2);
        this.anchor.setTo(.5, .5);
        this.setCenterDrawing(true);
        this.reset();
    }
    Ship.prototype.onInitialize = function (engine) {
        var shipSheet = new ex.SpriteSheet(Resources.ShipSpriteSheet, 3, 1, 32, 42);
        var squareSheild = new ex.SpriteSheet(Resources.SquareShieldSheet, 5, 1, 48, 48);
        var circleSheild = new ex.SpriteSheet(Resources.CircleShieldSheet, 5, 1, 48, 48);
        var triangleSheild = new ex.SpriteSheet(Resources.TriangleShieldSheet, 5, 1, 48, 48);
        var ship = this;
        var anim = shipSheet.getAnimationForAll(engine, 150);
        anim.rotation = Math.PI / 2;
        anim.loop = true;
        anim.anchor.setTo(.5, .5);
        this.addDrawing('default', anim);
        this._circle = circleSheild.getAnimationForAll(engine, 50);
        this._circle.loop = true;
        this._circle.anchor.setTo(.5, .5);
        this._square = squareSheild.getAnimationForAll(engine, 50);
        this._square.loop = true;
        this._square.anchor.setTo(.5, .5);
        this._triangle = triangleSheild.getAnimationForAll(engine, 50);
        this._triangle.loop = true;
        this._triangle.anchor.setTo(.5, .5);
        ship.on('preupdate', this.preupdate);
        ship.on('predraw', this.predraw);
    };
    Ship.prototype.reset = function (state) {
        if (!state) {
            this.state = {
                shieldType: Shape.Shape1,
                weapon: new StraightShooter(this, Config.bullets.speed, Config.bullets.damage)
            };
        }
        else {
            this.state = state;
        }
        return this;
    };
    Ship.prototype.preupdate = function (evt) {
        //console.log(`Update: ${evt.delta}`);
        evt.engine.input.pointers.primary.on('down', function (click) {
            var dx = click.x - GameState.state.ship.x;
            var dy = click.y - GameState.state.ship.y;
            GameState.state.ship.dx = dx * Config.shipSpeedScale;
            GameState.state.ship.dy = dy * Config.shipSpeedScale;
            GameState.state.ship.rotation = (new ex.Vector(dx, dy)).toAngle();
        });
        var oppVel = new ex.Vector(this.dx, this.dy).scale(-1).scale(Config.spaceFriction);
        this.dx += oppVel.x;
        this.dy += oppVel.y;
        this.state.weapon.update(evt.delta);
    };
    Ship.prototype.predraw = function (evt) {
        if (this.state.shieldType === Shape.Shape1) {
            this._square.draw(evt.ctx, 0, 0);
        }
        if (this.state.shieldType === Shape.Shape2) {
            this._circle.draw(evt.ctx, 0, 0);
        }
        if (this.state.shieldType === Shape.Shape3) {
            this._triangle.draw(evt.ctx, 0, 0);
        }
    };
    return Ship;
}(ex.Actor));
/// <reference path="stateful.ts" />
/// <reference path="shape.ts" />
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        var _this = this;
        _super.call(this, 0, 0, 3, 3, ex.Color.Red);
        this.reset();
        this.on('exitviewport', function () { return GameState.state.bullets.despawn(_this); });
    }
    Bullet.prototype.reset = function (state) {
        if (!state) {
            this.visible = false;
            // defaults
            this.state = {
                x: 0,
                y: 0,
                d: new ex.Vector(0, 0),
                damage: Config.bullets.damage,
                speed: Config.bullets.speed,
                shape: Shape.Shape1
            };
        }
        else {
            this.visible = true;
            this.state = state;
            this.x = state.x;
            this.y = state.y;
            var normalized = this.state.d.normalize();
            this.dx = normalized.x * this.state.speed;
            this.dy = normalized.y * this.state.speed;
        }
        return this;
    };
    return Bullet;
}(ex.Actor));
/// <reference path="shape.ts" />
/// <reference path="stateful.ts" />
/// <reference path="gamestate.ts" />
var Pool = (function () {
    function Pool(poolSize, factory) {
        this.factory = factory;
        this._pool = new ex.Util.Collection(poolSize);
        this._free = new ex.Util.Collection(poolSize);
    }
    Pool.prototype.fill = function (count) {
        if (count === void 0) { count = this._pool.internalSize(); }
        for (var i = 0; i < count; i++) {
            var o = this.factory();
            o.id = i;
            this._pool.push(o);
            this._free.push(i);
        }
    };
    Pool.prototype.spawn = function (state) {
        var i = this._free.pop();
        // TODO dynamically resize collections and initialize
        if (i === undefined) {
            throw "Make poolSize bigger for factory: " + this.factory.toString();
        }
        this._pool.elementAt(i).reset(state);
    };
    Pool.prototype.despawn = function (obj) {
        if (!obj)
            return;
        obj.reset();
        this._free.push(obj.id);
    };
    return Pool;
}());
/// <reference path="./ship.ts" />
/// <reference path="bullet.ts" />
/// <reference path="pool.ts" />
// one global area to track game state, makes the game easier to restart
var GameState = (function () {
    function GameState() {
    }
    // set any defaults
    GameState.init = function (game) {
        GameState.state = {
            ship: new Ship(100, 100, 100, 100),
            bullets: new Pool(500, function () {
                var b = new Bullet();
                game.add(b);
                return b;
            })
        };
        GameState.state.bullets.fill();
        game.add(GameState.state.ship);
    };
    return GameState;
}());
// wire into app insights to send events to our anlytics provider, trackEvent
// documentation
//https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md
var Analytics = (function () {
    function Analytics() {
    }
    return Analytics;
}());
// keep game stats here, score, powerup level, etc
var Stats = (function () {
    function Stats() {
    }
    return Stats;
}());
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
var BadGuyFactory = (function () {
    function BadGuyFactory(frequencySeconds, minEnemy, maxEnemy) {
        this.frequencySeconds = frequencySeconds;
        this.minEnemy = minEnemy;
        this.maxEnemy = maxEnemy;
        this._started = false;
        this._currentTime = Date.now();
    }
    BadGuyFactory.prototype.update = function (engine, delta) {
        if (this._started) {
            this._currentTime += delta;
            if (this._currentTime >= this._futureDispatchTime) {
                this.spawn(engine, ex.Util.randomIntInRange(this.minEnemy, this.maxEnemy));
                this._futureDispatchTime = this._currentTime + (this.frequencySeconds);
            }
        }
    };
    BadGuyFactory.prototype.spawn = function (engine, numberOfBaddies) {
        console.log("Dispatch " + numberOfBaddies);
        for (var i = 0; i < numberOfBaddies; i++) {
        }
    };
    BadGuyFactory.prototype.start = function () {
        this._started = true;
        this._currentTime = Date.now();
        this._futureDispatchTime = this._currentTime + (this.frequencySeconds);
    };
    BadGuyFactory.prototype.stop = function () {
        this._started = false;
    };
    return BadGuyFactory;
}());
var Starfield = (function (_super) {
    __extends(Starfield, _super);
    function Starfield() {
        _super.call(this, 0, 0, 0, 0);
        this._stars = [];
    }
    Starfield.prototype.onInitialize = function (engine) {
        var _this = this;
        _super.prototype.onInitialize.call(this, engine);
        this.setWidth(game.getWidth());
        this.setHeight(game.getHeight());
        // generate stars
        for (var i = 0; i < Config.StarfieldSize; i++) {
            this._stars.push({
                x: ex.Util.randomIntInRange(0, this.getWidth()),
                y: ex.Util.randomIntInRange(0, this.getHeight()),
                o: ex.Util.randomInRange(Config.StarfieldMinFade, Config.StarfieldMaxFade)
            });
        }
        this._fadeTimer = new ex.Timer(function () { return _this._updateFaded(); }, Config.StarfieldRefreshRate, true);
        this._meteorTimer = new ex.Timer(function () { return _this._shootMeteor(); }, ex.Util.randomIntInRange(Config.StarfieldMeteorFreqMin, Config.StarfieldMeteorFreqMax), true);
        game.add(this._fadeTimer);
        game.add(this._meteorTimer);
        this._updateFaded();
    };
    Starfield.prototype._updateFaded = function () {
        // randomly choose % stars to fade
        var totalFaded = Math.floor(this._stars.length *
            ex.Util.randomInRange(Config.StarfieldMinFadeRefreshAmount, Config.StarfieldMaxFadeRefreshAmount));
        for (var i = 0; i < totalFaded; i++) {
            // can overwrite
            this._stars[ex.Util.randomIntInRange(0, this._stars.length - 1)].o = ex.Util.randomInRange(Config.StarfieldMinFade, Config.StarfieldMaxFade);
        }
    };
    Starfield.prototype._shootMeteor = function () {
        var dest = new ex.Vector(ex.Util.randomInRange(0, this.getWidth()), ex.Util.randomIntInRange(50, this.getHeight() / 2));
        var meteor = new ex.Actor(ex.Util.randomIntInRange(0, this.getWidth()), 0, 2, 2, ex.Color.fromRGB(164, 237, 255, 1));
        meteor.moveBy(dest.x, dest.y, Config.StarfieldMeteorSpeed).asPromise().then(function () { return meteor.kill(); });
        game.add(meteor);
        // schedule next metor
        this._meteorTimer.interval = ex.Util.randomIntInRange(Config.StarfieldMeteorFreqMin, Config.StarfieldMeteorFreqMax);
    };
    Starfield.prototype.draw = function (ctx, delta) {
        for (var i = 0; i < this._stars.length; i++) {
            ctx.fillStyle = ex.Color.fromRGB(255, 255, 255, this._stars[i].o);
            ctx.fillRect(this._stars[i].x, this._stars[i].y, 1, 1);
        }
    };
    return Starfield;
}(ex.UIActor));
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="gamestate.ts" />
/// <reference path="analytics.ts" />
/// <reference path="config.ts" />
/// <reference path="resources.ts" />
/// <reference path="stats.ts" />
/// <reference path="ship.ts" />
/// <reference path="badguyfactory.ts" />
/// <reference path="starfield.ts" />
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
function updateCamera(evt) {
    // Grab the current focus of the camper
    var focus = game.currentScene.camera.getFocus().toVector();
    // Grab the "destination" position, in the spring equation the displacement location
    var position = new ex.Vector(GameState.state.ship.x, GameState.state.ship.y);
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
}
var badGuyFactory = new BadGuyFactory(500, 1, 11);
badGuyFactory.start();
function updateDispatchers(evt) {
    badGuyFactory.update(game, evt.delta);
}
var cameraVel = new ex.Vector(0, 0);
game.on('update', function (evt) {
    updateCamera(evt);
    updateDispatchers(evt);
});
game.start(loader).then(function () {
    var sf = new Starfield();
    game.add(sf);
    GameState.init(game);
});
//# sourceMappingURL=game.js.map
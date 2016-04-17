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
            owner: this.source,
            d: ex.Vector.fromAngle(this.source.rotation),
            damage: this.damage,
            x: this.source.x,
            y: this.source.y,
            speed: this.speed,
            shape: Shape.Shape1
        });
    };
    return StraightShooter;
}(WeaponBase));
var ShapeShooter = (function (_super) {
    __extends(ShapeShooter, _super);
    function ShapeShooter(source, speed, damage) {
        _super.call(this, 1500, source);
        this.source = source;
        this.speed = speed;
        this.damage = damage;
    }
    ShapeShooter.prototype.shoot = function () {
        // spawn bullet traveling in direction actor is facing
        GameState.state.bullets.spawn({
            owner: this.source,
            d: ex.Vector.fromAngle(this.source.rotation),
            damage: this.damage,
            x: this.source.x,
            y: this.source.y,
            speed: this.speed,
            shape: Shape.Shape1
        });
    };
    return ShapeShooter;
}(WeaponBase));
var Resources = {
    ShipSpriteSheet: new ex.Texture('./img/ship.png'),
    WitchSpriteSheet: new ex.Texture('./img/witch.png'),
    CircleShieldSheet: new ex.Texture('./img/circlesheild.png'),
    SquareShieldSheet: new ex.Texture('./img/squaresheild.png'),
    TriangleShieldSheet: new ex.Texture('./img/trianglesheild.png'),
    PlayerBullet: new ex.Texture('./img/playerbullet.png'),
    CircleBadguySheet: new ex.Texture('./img/circlebadguyexplodes.png'),
    TriangleBadguySheet: new ex.Texture('./img/trianglebadguyexplodes.png'),
    SquareBadguySheet: new ex.Texture('./img/squarebadguyexplodes.png'),
    CircleBullet: new ex.Texture('./img/bullets/blueBullet.png'),
    SquareBullet: new ex.Texture('./img/bullets/greenBullet.png'),
    TriangleBullet: new ex.Texture('./img/bullets/yellowBullet.png'),
    DigitalFontSheet: new ex.Texture("./fonts/DigitalFont.bmp"),
    Explode: new ex.Sound('./snd/explode1.wav'),
    PlanetBg: new ex.Texture('./img/planet-bg.png'),
    FrontBg: new ex.Texture('./img/front-bg.png')
};
var Config = {
    width: 960,
    height: 640,
    MapWidth: 5000,
    MapHeight: 960,
    // Camera
    CameraElasticity: .08,
    CameraFriction: .41,
    shipSpeedScale: 2,
    spaceFriction: .01,
    ShieldCoolDownTime: 1000,
    // Baddies
    SpawnInterval: 5500,
    MinEnemiesPerSpawn: 1,
    MaxEnemiesPerSpawn: 5,
    poolSizeIncrement: 100,
    // Starfield
    StarfieldSize: 500,
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
        speed: 500,
        damage: 1,
        rotation: Math.PI
    },
    badguy: {
        speed: 25,
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
        this._mouseDown = false;
        this.collisionType = ex.CollisionType.Passive;
        this.color = ex.Color.Red.clone();
        this.scale.setTo(2, 2);
        this.anchor.setTo(.5, .5);
        this.setCenterDrawing(true);
        this.reset();
    }
    Ship.prototype.onInitialize = function (engine) {
        var _this = this;
        var witchSheet = new ex.SpriteSheet(Resources.WitchSpriteSheet, 2, 1, 48, 48);
        var squareSheild = new ex.SpriteSheet(Resources.SquareShieldSheet, 5, 1, 48, 48);
        var circleSheild = new ex.SpriteSheet(Resources.CircleShieldSheet, 5, 1, 48, 48);
        var triangleSheild = new ex.SpriteSheet(Resources.TriangleShieldSheet, 5, 1, 48, 48);
        var ship = this;
        this._rightAnim = witchSheet.getAnimationForAll(engine, 300);
        this._rightAnim.rotation = Math.PI / 8;
        this._rightAnim.loop = true;
        this._rightAnim.anchor.setTo(.5, .5);
        this.addDrawing('right', this._rightAnim);
        this._leftAnim = witchSheet.getAnimationForAll(engine, 300);
        this._leftAnim.rotation = -Math.PI / 8;
        this._leftAnim.flipVertical = true;
        this._leftAnim.loop = true;
        this._leftAnim.anchor.setTo(.1, .1);
        this.addDrawing('left', this._leftAnim);
        this._circle = circleSheild.getAnimationForAll(engine, 50);
        this._circle.loop = true;
        this._circle.anchor.setTo(.4, .5);
        this._square = squareSheild.getAnimationForAll(engine, 50);
        this._square.loop = true;
        this._square.anchor.setTo(.3, .5);
        this._triangle = triangleSheild.getAnimationForAll(engine, 50);
        this._triangle.loop = true;
        this._triangle.anchor.setTo(.5, .7);
        this._triangle.rotation = Math.PI / 2;
        ship.on('preupdate', this.preupdate);
        ship.on('predraw', this.predraw);
        engine.input.pointers.primary.on('down', this._pointerDown);
        engine.input.pointers.primary.on('move', function (evt) {
            if (_this._mouseDown) {
                _this._pointerDown(evt);
            }
        });
        engine.input.pointers.primary.on('up', function (evt) {
            _this._mouseDown = false;
        });
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
    Ship.prototype._pointerDown = function (click) {
        //console.log(`Update: ${evt.delta}`);
        GameState.state.ship._mouseDown = true;
        var dx = click.x - GameState.state.ship.x;
        var dy = click.y - GameState.state.ship.y;
        if (!gameBounds.contains(new ex.Point(this.x, this.y))) {
            return;
        }
        GameState.state.ship.dx = dx * Config.shipSpeedScale;
        GameState.state.ship.dy = dy * Config.shipSpeedScale;
        GameState.state.ship.rotation = (new ex.Vector(dx, dy)).toAngle();
    };
    Ship.prototype.preupdate = function (evt) {
        var oppVel = new ex.Vector(this.dx, this.dy).scale(-1).scale(Config.spaceFriction);
        this.dx += oppVel.x;
        this.dy += oppVel.y;
        if (this.dx > 0) {
            this.setDrawing('right');
        }
        else {
            this.setDrawing('left');
        }
        this.state.weapon.update(evt.delta);
    };
    Ship.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        if (this.x > gameBounds.right) {
            this.x = gameBounds.right;
            this.dx = 0;
        }
        if (this.x < gameBounds.left) {
            this.x = gameBounds.left;
            this.dx = 0;
        }
        if (this.y > gameBounds.bottom) {
            this.y = gameBounds.bottom;
            this.dy = 0;
        }
        if (this.y < gameBounds.top) {
            this.y = gameBounds.top;
            this.dy = 0;
        }
        this._currentTime += delta;
        if (engine.input.keyboard.wasPressed(ex.Input.Keys.A)) {
            this.state.shieldType = Shape.Shape1;
        }
        else if (engine.input.keyboard.wasPressed(ex.Input.Keys.S)) {
            this.state.shieldType = Shape.Shape2;
        }
        else if (engine.input.keyboard.wasPressed(ex.Input.Keys.D)) {
            this.state.shieldType = Shape.Shape3;
        }
    };
    Ship.prototype._switchShield = function (shape) {
        if (this._currentTime > Config.ShieldCoolDownTime) {
            this._currentTime = 0;
            this.state.shieldType = shape;
        }
        else {
        }
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
        this.owner = null;
        this.collisionType = ex.CollisionType.Passive;
        this.reset();
        this.rx = Config.bullets.rotation;
        this.scale.setTo(.5, .5);
        this.on('exitviewport', function () { return GameState.state.bullets.despawn(_this); });
        this.on('collision', this._collision);
        this.on('postdraw', this.postdraw);
    }
    Bullet.prototype._collision = function (collision) {
        if (this.visible) {
            if (this.owner.constructor !== collision.other.constructor) {
                Resources.Explode.play();
                collision.other.kill();
                GameState.state.bullets.despawn(this);
            }
        }
    };
    Bullet.prototype.onInitialize = function (engine) {
        var triangleBulletSheet = new ex.SpriteSheet(Resources.TriangleBullet, 3, 1, 32, 32);
        var circleBulletSheet = new ex.SpriteSheet(Resources.CircleBullet, 3, 1, 32, 32);
        var squareBulletSheet = new ex.SpriteSheet(Resources.SquareBullet, 3, 1, 32, 32);
        this._triangleBulletAnim = triangleBulletSheet.getAnimationForAll(engine, 100);
        this._triangleBulletAnim.anchor.setTo(.5, .5);
        this._triangleBulletAnim.loop = true;
        this._circleBulletAnim = circleBulletSheet.getAnimationForAll(engine, 100);
        this._circleBulletAnim.anchor.setTo(.5, .5);
        this._circleBulletAnim.loop = true;
        this._squareBulletAnim = squareBulletSheet.getAnimationForAll(engine, 100);
        this._squareBulletAnim.anchor.setTo(.5, .5);
        this._squareBulletAnim.loop = true;
    };
    Bullet.prototype.reset = function (state) {
        if (!state) {
            this.visible = false;
            // defaults
            this.state = {
                owner: null,
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
            this.owner = state.owner;
            var normalized = this.state.d.normalize();
            this.dx = normalized.x * this.state.speed;
            this.dy = normalized.y * this.state.speed;
        }
        return this;
    };
    Bullet.prototype.postdraw = function (evt) {
        if (this.state.shape === Shape.Shape1) {
            this._squareBulletAnim.draw(evt.ctx, 0, 0);
        }
        if (this.state.shape === Shape.Shape2) {
            this._circleBulletAnim.draw(evt.ctx, 0, 0);
        }
        if (this.state.shape === Shape.Shape3) {
            this._triangleBulletAnim.draw(evt.ctx, 0, 0);
        }
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
            o.poolId = i;
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
        this._free.push(obj.poolId);
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
            ship: new Ship(100, 100, 48, 48),
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
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="stateful.ts" />
/// <reference path="resources.ts" />
var Stat = (function () {
    function Stat(name, defaultValue) {
        this.name = name;
        this.defaultValue = defaultValue;
        this.reset();
        this.state.value = defaultValue;
    }
    Stat.prototype.getStatName = function () {
        return this.name;
    };
    Stat.prototype.reset = function (state) {
        if (!state) {
            this.state = {
                value: this.defaultValue
            };
        }
        else {
            this.state = state;
        }
        return this;
    };
    return Stat;
}());
var HUDStat = (function (_super) {
    __extends(HUDStat, _super);
    function HUDStat(stat, x, y, width, height) {
        _super.call(this, x, y, width, height);
        this.stat = stat;
    }
    HUDStat.prototype.onInitialize = function (engine) {
        _super.prototype.onInitialize.call(this, engine);
        var hudStat = this;
        this.font = new ex.SpriteFont(Resources.DigitalFontSheet, " !\"#$%&'{}*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_", false, 8, 8, 32, 32);
        var displayText = this.stat.getStatName() + ":" + this.stat.state.value;
        var statLabel = new ex.Label(displayText, 0, 0, null, this.font);
        statLabel.fontSize = 40;
        statLabel.letterSpacing = -20;
        this.add(statLabel);
        hudStat.on('postdraw', this.postdraw);
    };
    HUDStat.prototype.postdraw = function (evt) {
    };
    return HUDStat;
}(ex.UIActor));
/// <reference path="stateful.ts" />
/// <reference path="shape.ts" />
var Badguy = (function (_super) {
    __extends(Badguy, _super);
    function Badguy(x, y, width, height, badguytype) {
        var _this = this;
        _super.call(this, x, y, width, height);
        this.collisionType = ex.CollisionType.Active;
        var BadguyTypes = [
            Resources.TriangleBadguySheet,
            Resources.SquareBadguySheet,
            Resources.CircleBadguySheet
        ];
        var ActiveType = BadguyTypes[badguytype];
        var BadGuySheet = new ex.SpriteSheet(ActiveType, 2, 1, 32, 32);
        this.scale.setTo(2, 2);
        //this.anchor.setTo(.1, .1);
        this.setCenterDrawing(true);
        this.onInitialize = function (engine) {
            var badguy = _this;
            var anim = BadGuySheet.getAnimationForAll(engine, 150);
            //var anim = BadGuySheet.getAnimationBetween(engine, 1, 2, 150);
            anim.loop = true;
            anim.anchor.setTo(.3, .3);
            _this.addDrawing('default', anim);
            //initialize badguy
            badguy.on('preupdate', _this.preupdate);
            badguy.on('collision', _this._collision);
        };
        this.weapon = new StraightShooter(this, Config.bullets.speed, Config.bullets.damage);
    }
    Badguy.prototype.preupdate = function (evt) {
        var dx = GameState.state.ship.x;
        var dy = GameState.state.ship.y;
        var oppVel = new ex.Vector(this.dx, this.dy).scale(-1).scale(Config.spaceFriction);
        this.dx += oppVel.x;
        this.dy += oppVel.y;
    };
    Badguy.prototype._collision = function (collision) {
        //var BadGuySheet = new ex.SpriteSheet(this.ActiveType, 5, 1, 32, 32);
        //var anim = BadGuySheet.getAnimationForAll(ex.Engine, 150);
    };
    Badguy.prototype.reset = function (state) {
        if (!state) {
            this.state = {
                x: 0,
                y: 0,
                d: new ex.Vector(0, 0),
                speed: Config.badguy.speed,
                size: Config.badguy.size,
                shape: Shape.Shape1,
                weapon: new StraightShooter(this, Config.bullets.speed, Config.bullets.damage)
            };
        }
        else {
            this.state = state;
        }
        return this;
    };
    return Badguy;
}(ex.Actor));
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="badguy.ts" />
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
        //console.log(`Dispatch ${numberOfBaddies}`);
        for (var i = 0; i < numberOfBaddies; i++) {
            //todo engine.add(new BadGuy());
            engine.add(new Badguy(ex.Util.randomInRange(-400, 400), ex.Util.randomInRange(-400, 400), 32, 32, ex.Util.randomIntInRange(0, 2)));
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
        this.anchor.setTo(0, 0);
    }
    Starfield.prototype.onInitialize = function (engine) {
        var _this = this;
        _super.prototype.onInitialize.call(this, engine);
        this.setWidth(gameBounds.getWidth());
        this.setHeight(gameBounds.getHeight());
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
}(ex.Actor));
var Background = (function (_super) {
    __extends(Background, _super);
    function Background() {
        _super.call(this, 0, 0, 5000, 960);
        this.anchor.setTo(0, 0);
    }
    Background.prototype.onInitialize = function () {
        this.addDrawing(Resources.PlanetBg);
    };
    return Background;
}(ex.Actor));
var Frontground = (function (_super) {
    __extends(Frontground, _super);
    function Frontground() {
        _super.call(this, 0, -100, 10000, 1920);
        this.anchor.setTo(0, 0);
    }
    Frontground.prototype.onInitialize = function () {
        this.addDrawing(Resources.FrontBg);
    };
    Frontground.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        var pdx = GameState.state.ship.dx;
        var pdy = GameState.state.ship.dy;
        this.dx = -pdx;
        this.dy = -pdy;
    };
    return Frontground;
}(ex.Actor));
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="gamestate.ts" />
/// <reference path="analytics.ts" />
/// <reference path="config.ts" />
/// <reference path="resources.ts" />
/// <reference path="stats.ts" />
/// <reference path="ship.ts" />
/// <reference path="badguyfactory.ts" />
/// <reference path="starfield.ts" />
/// <reference path="background.ts" />
var game = new ex.Engine({
    canvasElementId: "game",
    width: Config.width,
    height: Config.height
});
game.backgroundColor = ex.Color.Black.clone();
game.setAntialiasing(false);
game.input.keyboard.on('down', function (evt) {
    if (evt.key === ex.Input.Keys.Semicolon) {
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
    // clamp focus to game bounds
    focus.x = ex.Util.clamp(focus.x, game.width / 2, gameBounds.right - (game.width / 2));
    focus.y = ex.Util.clamp(focus.y, game.height / 2, gameBounds.bottom - (game.height / 2));
    // Set new position on camera
    game.currentScene.camera.setFocus(focus.x, focus.y);
}
var badGuyFactory = new BadGuyFactory(Config.SpawnInterval, Config.MinEnemiesPerSpawn, Config.MaxEnemiesPerSpawn);
badGuyFactory.start();
function updateDispatchers(evt) {
    badGuyFactory.update(game, evt.delta);
}
var cameraVel = new ex.Vector(0, 0);
game.on('update', function (evt) {
    updateCamera(evt);
    updateDispatchers(evt);
});
var gameBounds = new ex.BoundingBox(0, 0, Config.MapWidth, Config.MapHeight);
game.start(loader).then(function () {
    var sf = new Starfield();
    var statBox = new HUDStat(new Stat("KILLS", "0"), 10, 50, 150, 50);
    var bg = new Background();
    var fbg = new Frontground();
    game.add(sf);
    game.add(bg);
    game.add(statBox);
    GameState.init(game);
    game.add(fbg);
});
//# sourceMappingURL=game.js.map
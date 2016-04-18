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
    Shape[Shape["PlayerBullet"] = 3] = "PlayerBullet";
    Shape[Shape["None"] = 4] = "None";
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
        _super.call(this, Config.StraightShooterFrequency, source);
        this.source = source;
        this.speed = speed;
        this.damage = damage;
    }
    StraightShooter.prototype.shoot = function () {
        if (!Config.playerCanShoot)
            return;
        var newBullet = new Bullet();
        newBullet.reset({
            owner: this.source,
            d: ex.Vector.fromAngle(this.source.rotation),
            damage: this.damage,
            x: this.source.x,
            y: this.source.y,
            speed: this.speed + Config.playerMaxVelocity,
            shape: Shape.PlayerBullet,
            scale: 2
        });
        game.add(newBullet);
    };
    return StraightShooter;
}(WeaponBase));
var CircleShooter = (function (_super) {
    __extends(CircleShooter, _super);
    function CircleShooter(source, speed, damage, badguyType) {
        _super.call(this, 200, source);
        this.source = source;
        this.speed = speed;
        this.damage = damage;
        this.badguyType = badguyType;
        this._angle = 0;
    }
    CircleShooter.prototype.shoot = function () {
        this._angle += Math.PI / 8;
        var newBullet = new Bullet();
        // spawn bullet traveling in direction actor is facing
        newBullet.reset({
            owner: this.source,
            d: ex.Vector.fromAngle(this._angle),
            damage: this.damage,
            x: this.source.x,
            y: this.source.y,
            speed: this.speed,
            shape: this.badguyType,
            scale: .5
        });
        game.add(newBullet);
    };
    return CircleShooter;
}(WeaponBase));
var TriangleShooter = (function (_super) {
    __extends(TriangleShooter, _super);
    function TriangleShooter(source, speed, damage, badguyType) {
        _super.call(this, Config.BadguyShooterFrequency, source);
        this.source = source;
        this.speed = speed;
        this.damage = damage;
        this.badguyType = badguyType;
        this._angle = 0;
    }
    TriangleShooter.prototype.shoot = function () {
        for (var i = 0; i < 3; i++) {
            this._angle += 2 * Math.PI / 3;
            var newBullet = new Bullet();
            // spawn bullet traveling in direction actor is facing
            newBullet.reset({
                owner: this.source,
                d: ex.Vector.fromAngle(this._angle),
                damage: this.damage,
                x: this.source.x,
                y: this.source.y,
                speed: this.speed,
                shape: this.badguyType,
                scale: .5
            });
            game.add(newBullet);
        }
    };
    return TriangleShooter;
}(WeaponBase));
var ShapeShooter = (function (_super) {
    __extends(ShapeShooter, _super);
    function ShapeShooter(source, speed, damage, badguyType) {
        _super.call(this, Config.BadguyShooterFrequency, source);
        this.source = source;
        this.speed = speed;
        this.damage = damage;
        this.badguyType = badguyType;
    }
    ShapeShooter.prototype.shoot = function () {
        var player = GameState.state.ship;
        var target = new ex.Vector(player.x, player.y);
        var randomAngle = ex.Util.randomInRange(0, Math.PI * 2);
        var missFactor = new ex.Vector(Config.badguy.missRadius * Math.cos(randomAngle), Config.badguy.missRadius * Math.sin(randomAngle));
        target = target.add(missFactor);
        var direction = target.minus(new ex.Vector(this.source.x, this.source.y));
        var newBullet = new Bullet();
        // spawn bullet traveling in direction actor is facing
        newBullet.reset({
            owner: this.source,
            d: direction,
            damage: this.damage,
            x: this.source.x,
            y: this.source.y,
            speed: this.speed,
            shape: this.badguyType,
            scale: .5
        });
        game.add(newBullet);
    };
    return ShapeShooter;
}(WeaponBase));
var Resources = {
    ShipSpriteSheet: new ex.Texture('./img/ship.png'),
    WitchSpriteSheet: new ex.Texture('./img/witch.png'),
    CircleShieldSheet: new ex.Texture('./img/circlesheildbig.png'),
    SquareShieldSheet: new ex.Texture('./img/squaresheildbig.png'),
    TriangleShieldSheet: new ex.Texture('./img/trianglesheildbig.png'),
    PlayerBullet: new ex.Texture('./img/WitchSpell.png'),
    CircleBadguySheet: new ex.Texture('./img/circlebadguyexplodes.png'),
    TriangleBadguySheet: new ex.Texture('./img/trianglebadguyexplodes.png'),
    SquareBadguySheet: new ex.Texture('./img/squarebadguyexplodes.png'),
    CircleBullet: new ex.Texture('./img/bullets/blueBullet.png'),
    SquareBullet: new ex.Texture('./img/bullets/greenBullet.png'),
    TriangleBullet: new ex.Texture('./img/bullets/yellowBullet.png'),
    CirclePortal: new ex.Texture('./img/blueportal.png'),
    CirclePortalClose: new ex.Texture('./img/blueportal2.png'),
    SquarePortal: new ex.Texture('./img/greenportal.png'),
    SquarePortalClose: new ex.Texture('./img/greenportal2.png'),
    TrianglePortal: new ex.Texture('./img/yellowportal.png'),
    TrianglePortalClose: new ex.Texture('./img/yellowportal2.png'),
    DiabloFontSheet: new ex.Texture("./fonts/DiabloFont.png"),
    Explode: new ex.Sound('./snd/explode1.wav'),
    Hit: new ex.Sound('./snd/explode2.wav'),
    BkgrdTrack: new ex.Sound('./snd/backingTrack.wav'),
    On: new ex.Sound('./snd/on.wav'),
    No: new ex.Sound('./snd/no.wav'),
    Nope: new ex.Sound('./snd/nope.wav'),
    Absorb: new ex.Sound('./snd/absorb.wav'),
    PortalOpen: new ex.Sound('./snd/portalOpen.wav'),
    PortalClose: new ex.Sound('./snd/portalClose.wav'),
    PlanetBg: new ex.Texture('./img/planet-bg.png'),
    FrontBg: new ex.Texture('./img/front-bg.png'),
    Torch: new ex.Texture('./img/torch.png'),
    Heart: new ex.Texture('./img/Heart.png'),
    Vignette: new ex.Texture('./img/vignette.png')
};
var Config = {
    width: 960,
    height: 640,
    MapWidth: 5000,
    MapHeight: 960,
    HUDStatVisible: false,
    // Ship
    PlayerSpawn: new ex.Point(2500, 800),
    // Camera
    CameraElasticity: .08,
    CameraFriction: .41,
    CameraOffset: new ex.Vector(0, -100),
    shipSpeedScale: 2,
    spaceFriction: .01,
    ShieldCoolDownTime: 1000,
    // Player
    playerMinVelocity: -500,
    playerMaxVelocity: 500,
    playerHealth: 5,
    playerCanShoot: false,
    playerKillsBadguysOnCollision: true,
    // Baddies
    PortalSpawnWaitTime: 3000,
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
    StraightShooterFrequency: 500,
    BadguyShooterFrequency: 800,
    // Bullet config
    bullets: {
        speed: 500,
        damage: 1,
        rotation: Math.PI / 3
    },
    badguy: {
        speed: 170,
        bulletSpeed: 300,
        missRadius: 200,
        bulletSteer: 2,
        moveSteer: 70,
        size: 1 //multiplier from original?
    },
    colorShape1: ex.Color.fromHex('#3f8310'),
    colorShape2: ex.Color.fromHex('#1b77b7'),
    colorShape3: ex.Color.fromHex('#b79f1b')
};
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="shape.ts" />
/// <reference path="weapon.ts" />
/// <reference path="resources.ts" />
/// <reference path="config.ts" />
/// <reference path="stateful.ts" />
/// <reference path="gamestate.ts" />
/// <reference path="game.ts" />
var Ship = (function (_super) {
    __extends(Ship, _super);
    function Ship(x, y, width, height) {
        _super.call(this, x, y, width, height);
        this._mouseDown = false;
        this._currentTime = 0;
        this.paused = false;
        this.collisionType = ex.CollisionType.Passive;
        this.color = ex.Color.Red.clone();
        this.scale.setTo(2, 2);
        this.anchor.setTo(.5, .5);
        this.setCenterDrawing(true);
        this.reset();
    }
    Ship.prototype.onInitialize = function (engine) {
        var _this = this;
        this.setZIndex(2);
        var witchSheet = new ex.SpriteSheet(Resources.WitchSpriteSheet, 2, 1, 48, 48);
        var squareSheild = new ex.SpriteSheet(Resources.SquareShieldSheet, 5, 1, 96, 96);
        var circleSheild = new ex.SpriteSheet(Resources.CircleShieldSheet, 5, 1, 96, 96);
        var triangleSheild = new ex.SpriteSheet(Resources.TriangleShieldSheet, 5, 1, 96, 96);
        var ship = this;
        this._leftAnim = witchSheet.getAnimationForAll(engine, 300);
        this._leftAnim.rotation = -Math.PI / 8;
        this._leftAnim.flipVertical = true;
        this._leftAnim.loop = true;
        this._leftAnim.anchor.setTo(.1, .1);
        this.addDrawing('left', this._leftAnim);
        this._rightAnim = witchSheet.getAnimationForAll(engine, 300);
        this._rightAnim.rotation = Math.PI / 8;
        this._rightAnim.loop = true;
        this._rightAnim.anchor.setTo(.5, .5);
        this.addDrawing('right', this._rightAnim);
        this._circle = circleSheild.getAnimationForAll(engine, 50);
        this._circle.loop = true;
        this._circle.anchor.setTo(.4, .5);
        this._square = squareSheild.getAnimationForAll(engine, 50);
        this._square.loop = true;
        this._square.anchor.setTo(.5, .5);
        this._triangle = triangleSheild.getAnimationForAll(engine, 50);
        this._triangle.loop = true;
        this._triangle.anchor.setTo(.5, .7);
        this._triangle.rotation = Math.PI / 2;
        ship.on('preupdate', this.preupdate);
        ship.on('predraw', this.predraw);
        engine.input.pointers.primary.on('down', function (evt) {
            _this._pointerDown(evt);
        });
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
                shieldType: Shape.None,
                weapon: new StraightShooter(this, Config.bullets.speed, Config.bullets.damage),
                squarePool: 0,
                circlePool: 0,
                trianglePool: 0,
                health: Config.playerHealth,
                isVulnerable: true
            };
        }
        else {
            this.state = state;
        }
        return this;
    };
    Ship.prototype._pointerDown = function (click) {
        if (this.paused)
            return false;
        if (!this.isKilled()) {
            //console.log(`Update: ${evt.delta}`);
            GameState.state.ship._mouseDown = true;
            var dx = click.x - GameState.state.ship.x;
            var dy = click.y - GameState.state.ship.y;
            if (!gameBounds.contains(new ex.Point(this.x, this.y))) {
                return false;
            }
            var clampDx = ex.Util.clamp(dx * Config.shipSpeedScale, Config.playerMinVelocity, Config.playerMaxVelocity);
            var clampDy = ex.Util.clamp(dy * Config.shipSpeedScale, Config.playerMinVelocity, Config.playerMaxVelocity);
            GameState.state.ship.dx = clampDx;
            GameState.state.ship.dy = clampDy;
            GameState.state.ship.rotation = (new ex.Vector(dx, dy)).toAngle();
        }
    };
    Ship.prototype.preupdate = function (evt) {
        if (this.paused)
            return false;
        var oppVel = new ex.Vector(this.dx, this.dy).scale(-1).scale(Config.spaceFriction);
        this.dx += oppVel.x;
        this.dy += oppVel.y;
        if (this.dx >= 0) {
            this.setDrawing('right');
        }
        else {
            this.setDrawing('left');
        }
    };
    Ship.prototype.update = function (engine, delta) {
        if (this.paused)
            return;
        _super.prototype.update.call(this, engine, delta);
        this.state.weapon.update(delta);
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
            this._switchShield(Shape.Shape1);
        }
        else if (engine.input.keyboard.wasPressed(ex.Input.Keys.S)) {
            this._switchShield(Shape.Shape2);
        }
        else if (engine.input.keyboard.wasPressed(ex.Input.Keys.D)) {
            this._switchShield(Shape.Shape3);
        }
    };
    Ship.prototype._switchShield = function (shape) {
        if (this._currentTime > Config.ShieldCoolDownTime) {
            this._currentTime = 0;
            this.state.shieldType = shape;
            Resources.On.play();
        }
        else {
            // play nah-uh sound
            Resources.Nope.play();
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
/// <reference path="gamestate.ts" />
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        _super.call(this, 0, 0, 3, 3, ex.Color.Red);
        this.paused = false;
        this.owner = null;
        this.collisionType = ex.CollisionType.Passive;
        this.reset();
        this.rx = Config.bullets.rotation;
        this.on('collision', this._collision);
        this.on('postdraw', this.postdraw);
    }
    Bullet.prototype._collision = function (collision) {
        if (this.visible) {
            if (this.owner.constructor !== collision.other.constructor && this.constructor !== collision.other.constructor) {
                if (collision.other instanceof Ship) {
                    var player = collision.other;
                    // check if portal type is in current wave
                    if (player.state.shieldType === this.state.shape) {
                        if (badGuyFactory.isPortalTypeOpen(player.state.shieldType)) {
                            switch (this.state.shape) {
                                case (Shape.Shape1):
                                    player.state.squarePool += 1;
                                    break;
                                case (Shape.Shape2):
                                    player.state.circlePool += 1;
                                    break;
                                case (Shape.Shape3):
                                    player.state.trianglePool += 1;
                                    break;
                            }
                        }
                        Resources.Absorb.play();
                        this.kill();
                        return;
                    }
                    else {
                        if (player.state.isVulnerable) {
                            Resources.Hit.play();
                            var currHealth = player.state.health -= 1;
                            player.state.isVulnerable = false;
                            player.blink(50, 50, 15).callMethod(function () {
                                player.state.isVulnerable = true;
                            });
                            if (currHealth <= 0) {
                                collision.other.kill();
                                GameState.state.ship.dx = 0;
                                GameState.state.ship.dy = 0;
                                endscreen.lose();
                            }
                        }
                        else {
                            return; //player is invulnerable, takes no damage and bullets phase through them
                        }
                    }
                }
                if (!(collision.other instanceof Ship)) {
                    var currKills = parseInt(GameState.getGameStat("KILLS").toString()) + 1;
                    GameState.setGameStat("KILLS", currKills);
                }
                if (collision.other instanceof Badguy) {
                    var badguy;
                    badguy = collision.other;
                    badguy.explode();
                    badguy.delay(150).die();
                }
                this.kill();
            }
        }
    };
    Bullet.prototype.onInitialize = function (engine) {
    };
    Bullet.prototype.reset = function (state) {
        if (!state) {
            this.visible = false;
            // defaults
            this.state = {
                owner: null,
                x: 0,
                y: 0,
                scale: .5,
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
            this.scale = new ex.Vector(state.scale, state.scale);
            this.owner = state.owner;
            var normalized = this.state.d.normalize();
            this.dx = normalized.x * this.state.speed;
            this.dy = normalized.y * this.state.speed;
        }
        return this;
    };
    Bullet.prototype.update = function (engine, delta) {
        if (this.paused)
            return;
        _super.prototype.update.call(this, engine, delta);
        if (GameState.state.ship.state.shieldType === this.state.shape) {
            var target = new ex.Vector(GameState.state.ship.x, GameState.state.ship.y);
            var direction = target.minus(new ex.Vector(this.x, this.y));
            var steering = direction.normalize().scale(Config.badguy.bulletSteer);
            var currentSpeed = new ex.Vector(this.dx, this.dy);
            var newVel = steering.add(currentSpeed).normalize().scale(Config.badguy.bulletSpeed);
            this.dx = newVel.x;
            this.dy = newVel.y;
        }
        if (!gameBounds.contains(new ex.Point(this.x, this.y))) {
            this.kill();
        }
    };
    Bullet.prototype.postdraw = function (evt) {
        if (this.state.shape === Shape.Shape1) {
            GlobalAnimations.SquareBullet.draw(evt.ctx, 0, 0);
        }
        if (this.state.shape === Shape.Shape2) {
            GlobalAnimations.CircleBullet.draw(evt.ctx, 0, 0);
        }
        if (this.state.shape === Shape.Shape3) {
            GlobalAnimations.TriangleBullet.draw(evt.ctx, 0, 0);
        }
        if (this.state.shape === Shape.PlayerBullet) {
            GlobalAnimations.PlayerBullet.draw(evt.ctx, 0, 0);
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
        var actor = this._pool.elementAt(i);
        actor.reset(state);
        game.add(actor);
    };
    Pool.prototype.despawn = function (obj) {
        if (!obj)
            return;
        obj.reset();
        this._free.push(obj.poolId);
        game.remove(obj);
    };
    return Pool;
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
        this.visible = Config.HUDStatVisible;
    }
    HUDStat.prototype.onInitialize = function (engine) {
        _super.prototype.onInitialize.call(this, engine);
        var hudStat = this;
        this.font = new ex.SpriteFont(Resources.DiabloFontSheet, " !\"#$%&'{}*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_", false, 8, 8, 32, 32);
        var displayText = this.stat.getStatName() + ":" + this.stat.state.value;
        this.statLabel = new ex.Label(displayText, 0, 0, null, this.font);
        this.statLabel.fontSize = 60;
        this.statLabel.letterSpacing = -38;
        this.statLabel.color = ex.Color.Magenta.clone();
        this.add(this.statLabel);
        hudStat.on('postdraw', this.postdraw);
    };
    HUDStat.prototype.postdraw = function (evt) {
        this.statLabel.text = this.stat.getStatName() + ":" + this.stat.state.value;
    };
    return HUDStat;
}(ex.UIActor));
var PortalStat = (function (_super) {
    __extends(PortalStat, _super);
    function PortalStat(x, y, type) {
        _super.call(this, x, y, PortalStat.width, PortalStat.height);
        this.type = type;
    }
    PortalStat.prototype.onInitialize = function (engine) {
        _super.prototype.onInitialize.call(this, engine);
        switch (this.type) {
            case Shape.Shape1:
                this._color = Config.colorShape1;
                this._sprite = new ex.SpriteSheet(Resources.SquareBullet, 3, 1, 32, 32).getSprite(1);
                break;
            case Shape.Shape2:
                this._color = Config.colorShape2;
                this._sprite = new ex.SpriteSheet(Resources.CircleBullet, 3, 1, 32, 32).getSprite(1);
                break;
            case Shape.Shape3:
                this._color = Config.colorShape3;
                this._sprite = new ex.SpriteSheet(Resources.TriangleBullet, 3, 1, 32, 32).getSprite(1);
                break;
        }
        this._sprite.scale.setTo(0.75, 0.75);
    };
    PortalStat.prototype.update = function (engine, delta) {
        var _this = this;
        _super.prototype.update.call(this, engine, delta);
        // find all portals of this type     
        var wave = badGuyFactory.getWave();
        var totalCloseNeeded = _.chain(wave.portals).filter(function (p) { return p.type === _this.type; }).sum(function (p) { return p.closeAmount; });
        var currentAmount = 0;
        if (totalCloseNeeded <= 0) {
            // portal is not in wave, hide stat
            this.visible = false;
        }
        else {
            this.visible = true;
        }
        switch (this.type) {
            case Shape.Shape1:
                currentAmount = GameState.state.ship.state.squarePool;
                break;
            case Shape.Shape2:
                currentAmount = GameState.state.ship.state.circlePool;
                break;
            case Shape.Shape3:
                currentAmount = GameState.state.ship.state.trianglePool;
                break;
        }
        this._filledPerc = Math.min(1, currentAmount / totalCloseNeeded);
    };
    PortalStat.prototype.draw = function (ctx, delta) {
        _super.prototype.draw.call(this, ctx, delta);
        if (!this.visible)
            return;
        // background
        ctx.fillStyle = ex.Color.fromRGB(this._color.r, this._color.g, this._color.b, 0.3).toString();
        ctx.fillRect(this.x, this.y, PortalStat.width, PortalStat.height);
        ctx.strokeStyle = this._color.toString();
        ctx.strokeRect(this.x, this.y, PortalStat.width, PortalStat.height);
        // fill in
        ctx.fillStyle = this._color.toString();
        ctx.fillRect(this.x, this.y, Math.floor(PortalStat.width * this._filledPerc), PortalStat.height);
        this._sprite.draw(ctx, this.x - 16, this.y - (this.getHeight() / 2) + 3);
    };
    PortalStat.width = 100;
    PortalStat.height = 15;
    return PortalStat;
}(ex.UIActor));
/// <reference path="./ship.ts" />
/// <reference path="bullet.ts" />
/// <reference path="pool.ts" />
/// <reference path="stats.ts" />
// one global area to track game state, makes the game easier to restart
var GameState = (function () {
    function GameState() {
    }
    GameState.getStatIdx = function (name) {
        var idx = -1;
        GameState.state.stats.filter(function (itm, currIdx) {
            if (itm.getStatName() === name) {
                idx = currIdx;
            }
            return itm.getStatName() === name;
        });
        return idx;
    };
    GameState.getGameStat = function (name) {
        var statIdx = this.getStatIdx(name);
        if (statIdx != -1) {
            return GameState.state.stats[statIdx].state.value;
        }
        else {
            console.error(name + " isn't the name of any game stat.");
        }
    };
    GameState.setGameStat = function (name, value) {
        var statIdx = this.getStatIdx(name);
        if (statIdx != -1) {
            GameState.state.stats[statIdx].state.value = value;
        }
        else {
            console.error(name + " isn't the name of any game stat.");
        }
    };
    // set any defaults
    GameState.init = function () {
        // reset current engine state
        if (GameState.state) {
            game.remove(GameState.state.ship);
        }
        GameState.state = {
            ship: new Ship(Config.PlayerSpawn.x, Config.PlayerSpawn.y, 48, 48),
            bullets: null,
            stats: [new Stat("KILLS", 0)],
            stage: 1,
            gameStart: Date.now(),
            gameEnd: Date.now()
        };
        //GameState.state.bullets.fill();
        cameraDestActor = GameState.state.ship;
        game.add(GameState.state.ship);
        // start the waves
        badGuyFactory.nextWave();
    };
    GameState.reset = function () {
        this._resetPlayer();
        this._resetStats();
        this.state.stage = 1;
        badGuyFactory.nextWave();
        this.state.gameStart = Date.now();
    };
    GameState._resetPlayer = function () {
        GameState.state.ship.dx = 0;
        GameState.state.ship.dy = 0;
        GameState.state.ship.x = Config.PlayerSpawn.x;
        GameState.state.ship.y = Config.PlayerSpawn.y;
        GameState.state.ship.rotation = 0;
        // GameState.state.ship.reset();
        //TODO calling reset() breaks player input, something related to creating a new Weapon
        GameState.state.ship.state.shieldType = Shape.None;
        GameState.state.ship.state.squarePool = 0;
        GameState.state.ship.state.circlePool = 0;
        GameState.state.ship.state.trianglePool = 0;
        GameState.state.ship.state.health = Config.playerHealth;
        GameState.state.ship.state.isVulnerable = true;
        // add player if they were removed
        if (game.currentScene.children.indexOf(GameState.state.ship) < 0) {
            game.currentScene.add(GameState.state.ship);
        }
    };
    GameState._resetStats = function () {
        this.setGameStat('KILLS', 0);
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
/// <reference path="stateful.ts" />
/// <reference path="shape.ts" />
var Badguy = (function (_super) {
    __extends(Badguy, _super);
    function Badguy(x, y, badguytype) {
        var _this = this;
        _super.call(this, x, y, 32, 32);
        this.badguytype = badguytype;
        this.paused = false;
        this._isexploding = false;
        this.collisionType = ex.CollisionType.Passive;
        this.scale.setTo(2, 2);
        //this.anchor.setTo(.1, .1);
        this.setCenterDrawing(true);
        this.onInitialize = function (engine) {
            var badguy = _this;
            _this.setZIndex(2);
            if (_this.badguytype == Shape.Shape1) {
                _this.addDrawing('default', GlobalAnimations.SquareBaddie);
            }
            else if (_this.badguytype == Shape.Shape2) {
                _this.addDrawing('default', GlobalAnimations.CircleBaddie);
            }
            else if (_this.badguytype === Shape.Shape3) {
                _this.addDrawing('default', GlobalAnimations.TriangleBaddie);
            }
            //initialize badguy
            badguy.on('preupdate', _this._preupdate);
            badguy.on('update', _this._update);
            badguy.on('collision', _this._collision);
        };
        this.reset();
    }
    Badguy.prototype._preupdate = function (evt) {
        if (this._isexploding || this.paused) {
            return false;
        }
        /*
        if (this.dx >= 0){
          this.dx = Config.badguy.speed;
        } else {
          this.dx = Config.badguy.speed * -1;
        }
        
        if (this.dy >= 0) {
          this.dy = Config.badguy.speed;
        } else {
          this.dy = Config.badguy.speed * -1;
        }
        
        
        */
        this.state.weapon.update(evt.delta);
    };
    Badguy.prototype._update = function (evt) {
        //if (this._isexploding){
        //  return false;
        //}
        if (this.paused) {
            this.dx = 0;
            this.dy = 0;
            return;
        }
        var hitborder = false;
        if (this.x > gameBounds.right) {
            this.x = gameBounds.right;
            this.dx *= -1;
            //this.dy *= -1;
            hitborder = true;
        }
        if (this.x < gameBounds.left) {
            this.x = gameBounds.left;
            this.dx *= -1;
            //this.dy *= -1; 
            hitborder = true;
        }
        if (this.y > gameBounds.bottom) {
            this.y = gameBounds.bottom;
            this.dy *= -1;
            //this.dx *= -1;
            hitborder = true;
        }
        if (this.y < gameBounds.top) {
            this.y = gameBounds.top;
            this.dy *= -1;
            //this.dx *= -1;
            hitborder = true;
        }
        var player = GameState.state.ship;
        var target = new ex.Vector(player.x, player.y);
        var randomAngle = ex.Util.randomInRange(0, Math.PI * 2);
        var missFactor = new ex.Vector(Config.badguy.missRadius * Math.cos(randomAngle), Config.badguy.missRadius * Math.sin(randomAngle));
        target = target.add(missFactor);
        var direction = target.minus(new ex.Vector(this.x, this.y));
        var steering = direction.normalize().scale(Config.badguy.moveSteer);
        var currentSpeed = new ex.Vector(this.dx, this.dy);
        var newVel = steering.add(currentSpeed).normalize().scale(Config.badguy.speed);
        this.dx = newVel.x;
        this.dy = newVel.y;
    };
    Badguy.prototype._collision = function (collision) {
        if (collision.other instanceof Ship) {
            if (GameState.state.ship.state.shieldType === this.badguytype && Config.playerKillsBadguysOnCollision) {
                this.explode();
                this.delay(150).die();
            }
        }
    };
    Badguy.prototype.explode = function () {
        if (this._isexploding)
            return;
        this._isexploding = true;
        Resources.Explode.play();
        //this.dx = 0;
        //this.dy = 0;
        if (this.badguytype == Shape.Shape1) {
            //GlobalAnimations.SquareBaddieExplosion.play(this.x, this.y);
            this.addDrawing('explosion', GlobalAnimations.SquareBaddieExplosion);
        }
        else if (this.badguytype == Shape.Shape2) {
            this.addDrawing('explosion', GlobalAnimations.CircleBaddieExplosion);
        }
        else if (this.badguytype === Shape.Shape3) {
            this.addDrawing('explosion', GlobalAnimations.TriangleBaddieExplosion);
        }
        this.setDrawing('explosion');
    };
    Badguy.prototype.reset = function (state) {
        if (!state) {
            var weapon;
            if (this.badguytype === Shape.Shape2) {
                weapon = new CircleShooter(this, Config.badguy.bulletSpeed, Config.bullets.damage, this.badguytype);
            }
            else if (this.badguytype === Shape.Shape3) {
                weapon = new TriangleShooter(this, Config.badguy.bulletSpeed, Config.bullets.damage, this.badguytype);
            }
            else {
                weapon = new ShapeShooter(this, Config.badguy.bulletSpeed, Config.bullets.damage, this.badguytype);
            }
            this.state = {
                x: 0,
                y: 0,
                d: new ex.Vector(0, 0),
                speed: Config.badguy.speed,
                size: Config.badguy.size,
                shape: this.badguytype,
                weapon: weapon
            };
        }
        else {
            this.state = state;
        }
        return this;
    };
    return Badguy;
}(ex.Actor));
var Portal = (function (_super) {
    __extends(Portal, _super);
    function Portal(state) {
        _super.call(this, state.location.x, state.location.y, 48, 48);
        this.state = state;
    }
    Portal.prototype.onInitialize = function () {
        var _this = this;
        this.setZIndex(1);
        this.scale.setTo(3, 3);
        var tx;
        switch (this.state.type) {
            case Shape.Shape1:
                tx = Resources.SquarePortal;
                this._closetexture = Resources.SquarePortalClose;
                break;
            case Shape.Shape2:
                tx = Resources.CirclePortal;
                this._closetexture = Resources.CirclePortalClose;
                break;
            case Shape.Shape3:
                tx = Resources.TrianglePortal;
                this._closetexture = Resources.TrianglePortalClose;
                break;
        }
        //define drawing for a portal that stays open
        var ss = new ex.SpriteSheet(tx, 5, 1, 48, 48);
        var isopenanim = ss.getAnimationForAll(game, 125);
        isopenanim.loop = true;
        this.addDrawing('default', isopenanim);
        //define close portal drawing
        var spritesheet = new ex.SpriteSheet(this._closetexture, 13, 1, 48, 48);
        var closeanim = spritesheet.getAnimationForAll(game, 125);
        this.addDrawing('close', closeanim);
        //define opening portal drawing
        var spritesheet = new ex.SpriteSheet(this._closetexture, 13, 1, 48, 48);
        spritesheet.sprites = spritesheet.sprites.reverse();
        var openanim = spritesheet.getAnimationForAll(game, 125);
        this.addDrawing('open', openanim);
        this.portalopen();
        this.delay(1400).callMethod(function () { _this.setDrawing('default'); });
    };
    Portal.prototype.portalclose = function () {
        var _this = this;
        this.setDrawing('close');
        game.currentScene.children.forEach(function (a) {
            if (a instanceof Badguy || a instanceof Bullet) {
                if (a.state.shape === _this.state.type || a.state.shape === _this.state.type) {
                }
            }
        });
        Resources.PortalClose.play();
    };
    Portal.prototype.portalopen = function () {
        this.setDrawing('open');
        Resources.PortalOpen.play();
    };
    return Portal;
}(ex.Actor));
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="badguy.ts" />
/// <reference path="portal.ts" />
var BadGuyFactory = (function () {
    function BadGuyFactory() {
        this._waveStarted = false;
        this._portalSpawnWaitTimer = 0;
        this._openPortals = [];
        this.paused = false;
        // this.orc = new ex.Actor(0, 0, 1, 1, ex.Color.Transparent);
        // game.add(this.orc);
        this.helperOrc = new ex.Actor(0, 0, 1, 1, ex.Color.Transparent);
        game.add(this.helperOrc);
    }
    BadGuyFactory.prototype.update = function (engine, delta) {
        if (this._waveStarted) {
            this._portalSpawnWaitTimer = Config.PortalSpawnWaitTime;
            this._waveStarted = false;
        }
        // check if portals can be closed
        var portalsToClose = [];
        for (var _i = 0, _a = this._openPortals; _i < _a.length; _i++) {
            var p = _a[_i];
            var poolAmount = 0;
            switch (p.state.type) {
                case Shape.Shape1:
                    poolAmount = GameState.state.ship.state.squarePool;
                    break;
                case Shape.Shape2:
                    poolAmount = GameState.state.ship.state.circlePool;
                    break;
                case Shape.Shape3:
                    poolAmount = GameState.state.ship.state.trianglePool;
                    break;
            }
            if (poolAmount >= p.state.closeAmount) {
                // close portal
                //poolAmount = 0;
                portalsToClose.push(p);
            }
        }
        var promise;
        if (portalsToClose.length > 0) {
            // this.orc.callMethod(() => {this.closePortals(portalsToClose)});
            promise = this.closePortals(portalsToClose);
        }
        // after portal spawns, spawn enemies
        if (!this.paused) {
            if (this._openPortals.length === 0) {
                this.nextWave(promise);
                return;
            }
            if (this._portalSpawnWaitTimer <= 0) {
                // for open portals, spawn baddies
                for (var _b = 0, _c = this._openPortals; _b < _c.length; _b++) {
                    var p = _c[_b];
                    // remove killed baddies
                    var baddiesToRemove = [];
                    for (var _d = 0, _e = p.state.baddies; _d < _e.length; _d++) {
                        var b = _e[_d];
                        if (b.isKilled()) {
                            baddiesToRemove.push(b);
                        }
                    }
                    for (var _f = 0, baddiesToRemove_1 = baddiesToRemove; _f < baddiesToRemove_1.length; _f++) {
                        var b = baddiesToRemove_1[_f];
                        p.state.baddies.splice(p.state.baddies.indexOf(b), 1);
                    }
                    if (p.state.rateTimer <= 0 && p.state.baddies.length < p.state.maxSimultaneous) {
                        this.spawnBaddie(p.state);
                        p.state.rateTimer = p.state.rate;
                    }
                    else {
                        p.state.rateTimer -= delta;
                    }
                }
            }
            else {
                this._portalSpawnWaitTimer -= delta;
            }
        }
    };
    BadGuyFactory.prototype.isPortalTypeOpen = function (type) {
        return _.any(this._openPortals, function (p) { return p.state.type === type; });
    };
    BadGuyFactory.prototype.spawnBaddie = function (portal) {
        var baddie = new Badguy(portal.location.x, portal.location.y, portal.type);
        game.add(baddie);
        portal.baddies.push(baddie);
    };
    BadGuyFactory.prototype.nextWave = function (promise) {
        var _this = this;
        var portalsClosed = promise || ex.Promise.wrap();
        this._waveStarted = true;
        if (this._waveInfo) {
            for (var _i = 0, _a = this._waveInfo.portals; _i < _a.length; _i++) {
                var p = _a[_i];
                for (var _b = 0, _c = p.baddies; _b < _c.length; _b++) {
                    var b = _c[_b];
                    game.remove(b);
                }
                p.baddies.length = 0;
            }
        }
        // despawn portals
        for (var _d = 0, _e = this._openPortals; _d < _e.length; _d++) {
            var p = _e[_d];
            game.remove(p);
        }
        this._openPortals.length = 0;
        var stage = GameState.state.stage;
        // set spawn locations
        if (stage === 1) {
            // place portal in center
            this._waveInfo = {
                portals: [{
                        location: new ex.Point(2525, 400),
                        rate: 2000,
                        rateTimer: 0,
                        baddies: [],
                        maxSimultaneous: 3,
                        type: Shape.Shape1,
                        closeAmount: 5
                    }]
            };
            portalsClosed.then(function () { _this.spawnPortals(); });
        }
        else if (stage === 2) {
            this._waveInfo = {
                portals: [{
                        location: new ex.Point(1900, 420),
                        rate: 2000,
                        rateTimer: 0,
                        baddies: [],
                        maxSimultaneous: 3,
                        type: Shape.Shape2,
                        closeAmount: 5
                    },
                    {
                        location: new ex.Point(3150, 420),
                        rate: 2000,
                        rateTimer: 0,
                        baddies: [],
                        maxSimultaneous: 3,
                        type: Shape.Shape1,
                        closeAmount: 5
                    }]
            };
            portalsClosed.then(function () { _this.spawnPortals(); });
        }
        else if (stage === 3) {
            this._waveInfo = {
                portals: [{
                        location: new ex.Point(1900, 420),
                        rate: 2000,
                        rateTimer: 0,
                        baddies: [],
                        maxSimultaneous: 3,
                        type: Shape.Shape1,
                        closeAmount: 5
                    },
                    {
                        location: new ex.Point(3150, 420),
                        rate: 2000,
                        rateTimer: 0,
                        baddies: [],
                        maxSimultaneous: 3,
                        type: Shape.Shape2,
                        closeAmount: 5
                    },
                    {
                        location: new ex.Point(2525, 400),
                        rate: 2000,
                        rateTimer: 0,
                        baddies: [],
                        maxSimultaneous: 3,
                        type: Shape.Shape3,
                        closeAmount: 5
                    }]
            };
            portalsClosed.then(function () { _this.spawnPortals(); });
        }
        else {
            // win!
            console.log('stage: ' + stage);
            endscreen.win();
        }
    };
    BadGuyFactory.prototype.spawnPortals = function () {
        var _this = this;
        this.paused = true;
        this.helperOrc.x = GameState.state.ship.x;
        this.helperOrc.y = GameState.state.ship.y;
        cameraDestActor = this.helperOrc;
        this.helperOrc.delay(100).callMethod(function () { pause(); }); // calling pause by itself interrupts the updates before the witch sprite loads
        var _loop_1 = function() {
            // console.log('adding portal')
            var p = new Portal(portal);
            //    game.add(p);
            this_1.helperOrc.callMethod(function () { game.add(p); }); //TODO use delay? param
            this_1._openPortals.push(p);
            //p.portalopen();
            //p.delay(2000);
            this_1.helperOrc.easeTo(p.x, p.y, 400, ex.EasingFunctions.EaseInCubic).delay(2000);
        };
        var this_1 = this;
        for (var _i = 0, _a = this._waveInfo.portals; _i < _a.length; _i++) {
            var portal = _a[_i];
            _loop_1();
        }
        this.helperOrc.easeTo(GameState.state.ship.x, GameState.state.ship.y, 400, ex.EasingFunctions.EaseOutCubic).callMethod(function () {
            cameraDestActor = GameState.state.ship;
            resume();
            _this.paused = false;
            GameState.state.stage += 1;
        });
    };
    BadGuyFactory.prototype.closePortals = function (portals) {
        this.helperOrc.x = GameState.state.ship.x;
        this.helperOrc.y = GameState.state.ship.y;
        cameraDestActor = this.helperOrc;
        pause();
        for (var _i = 0, portals_1 = portals; _i < portals_1.length; _i++) {
            var p = portals_1[_i];
            var idx = this._openPortals.indexOf(p);
            this._openPortals.splice(idx, 1);
            p.portalclose();
            p.delay(2000).die();
            this.helperOrc.easeTo(p.x, p.y, 400, ex.EasingFunctions.EaseInCubic).delay(2000);
            switch (p.state.type) {
                case Shape.Shape1:
                    GameState.state.ship.state.squarePool = 0;
                    break;
                case Shape.Shape2:
                    GameState.state.ship.state.circlePool = 0;
                    break;
                case Shape.Shape3:
                    GameState.state.ship.state.trianglePool = 0;
                    break;
            }
        }
        return this.helperOrc.easeTo(GameState.state.ship.x, GameState.state.ship.y, 400, ex.EasingFunctions.EaseOutCubic).callMethod(function () {
            cameraDestActor = GameState.state.ship;
            resume();
        }).asPromise();
    };
    BadGuyFactory.prototype.getWave = function () {
        return this._waveInfo;
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
        this._yPos = -100;
        this._maxHeight = 1920;
        this.anchor.setTo(0, 0);
    }
    Frontground.prototype.onInitialize = function () {
        this.setZIndex(3);
        this.addDrawing(Resources.FrontBg);
    };
    Frontground.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        this.x = -GameState.state.ship.x * 1;
        this.y = -GameState.state.ship.y * 1;
        //console.log(`Ship y:${GameState.state.ship.y} Foreground y:${this.y} `)
        //var pdx = GameState.state.ship.dx;
        //var pdy = GameState.state.ship.dy;
        //this.dx = -pdx;
        //this.dy = -pdy;
    };
    return Frontground;
}(ex.Actor));
var Torch = (function (_super) {
    __extends(Torch, _super);
    function Torch(x, y) {
        _super.call(this, x, y, 53, 72);
    }
    Torch.prototype.onInitialize = function () {
        var anim = Torch.getAnimation();
        this.addDrawing('default', anim);
        this.setDrawing('default');
    };
    Torch.getAnimation = function () {
        if (!Torch._anim) {
            var ss = new ex.SpriteSheet(Resources.Torch, 4, 1, 53, 72);
            var anim = ss.getAnimationForAll(game, 100);
            anim.loop = true;
            Torch._anim = anim;
        }
        return Torch._anim;
    };
    Torch.place = function (game) {
        var windows = [575, 1128, 1688, 2250, 2802, 3365, 3923, 4478];
        var o = 135;
        var y = 580;
        for (var i = 0; i < windows.length; i++) {
            var l = windows[i] - o;
            var r = windows[i] + o;
            var tl = new Torch(l, y);
            var tr = new Torch(r, y);
            game.add(tl);
            game.add(tr);
        }
    };
    return Torch;
}(ex.Actor));
var Options = {
    music: true,
    sound: true
};
var Settings = (function () {
    function Settings() {
    }
    return Settings;
}());
var SoundManager = (function () {
    function SoundManager() {
    }
    SoundManager.start = function () {
        // set all sound effect volumes
        if (Options.sound) {
            SoundManager.setSoundEffectLevels(1);
        }
        else {
            SoundManager.setSoundEffectLevels(0);
        }
        // set music volume
        if (Options.music) {
        }
        else {
        }
    };
    SoundManager.setSoundEffectLevels = function (volume) {
        _.forIn(Resources, function (resource) {
            if (resource instanceof ex.Sound) {
                resource.setVolume(volume);
                if (resource === Resources.BkgrdTrack) {
                    resource.play();
                }
            }
        });
    };
    SoundManager.stop = function () {
        _.forIn(Resources, function (resource) {
            if (resource instanceof ex.Sound) {
                resource.setVolume(0);
                resource.stop();
            }
        });
    };
    return SoundManager;
}());
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
var EndScreen = (function () {
    function EndScreen(endScreenId, restartId, scoreId) {
        if (endScreenId === void 0) { endScreenId = "gameover"; }
        if (restartId === void 0) { restartId = "restart"; }
        if (scoreId === void 0) { scoreId = "score"; }
        this.endScreenId = endScreenId;
        this.restartId = restartId;
        this.scoreId = scoreId;
        this._el = document.getElementById(this.endScreenId);
        this._score = document.getElementById(this.scoreId);
        this._restart = document.getElementById(this.restartId);
        this._restart.onclick = this.restart.bind(this);
    }
    EndScreen.prototype.win = function () {
        this._gameOver();
        this._score.innerText = "Time: " + this._minutes.toFixed(0) + "m " + this._seconds.toFixed(0) + "s";
        this._show();
        removeClass(this._el, "lose");
        addClass(this._el, "win");
    };
    EndScreen.prototype.lose = function () {
        this._gameOver();
        this._score.innerText = "Time: " + this._minutes.toFixed(0) + "m " + this._seconds.toFixed(0) + "s";
        this._show();
        removeClass(this._el, "win");
        addClass(this._el, "lose");
    };
    EndScreen.prototype.restart = function () {
        GameState.reset();
        this._hide();
        resume();
    };
    EndScreen.prototype._gameOver = function () {
        pause();
        GameState.state.gameEnd = Date.now();
        this._time = (GameState.state.gameEnd - GameState.state.gameStart);
        this._minutes = Math.floor(this._time / 1000 / 60);
        this._seconds = Math.floor((this._time / 1000) - (60 * this._minutes));
        // remove all bullets
        var bulletsToRemove = _.filter(game.currentScene.children, function (c) { return c instanceof Bullet; });
        _.each(bulletsToRemove, function (b) { return game.remove(b); });
    };
    EndScreen.prototype._hide = function () {
        addClass(this._el, "hidden");
    };
    EndScreen.prototype._show = function () {
        removeClass(this._el, "hidden");
    };
    return EndScreen;
}());
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="stateful.ts" />
/// <reference path="resources.ts" />
/// <reference path="gamestate.ts" />
var HealthStat = (function (_super) {
    __extends(HealthStat, _super);
    function HealthStat(x, y) {
        _super.call(this, x, y, HealthStat.width, HealthStat.height);
        this._activeHeart = new ex.SpriteSheet(Resources.Heart, 2, 1, 32, 32).getSprite(0);
        this._emptyHeart = new ex.SpriteSheet(Resources.Heart, 2, 1, 32, 32).getSprite(1);
        this.anchor.setTo(0, 0);
    }
    HealthStat.prototype.draw = function (ctx) {
        var heartsleft = GameState.state.ship.state.health;
        var totalhearts = Config.playerHealth;
        for (var i = 0; i < heartsleft; i++) {
            this._activeHeart.draw(ctx, this.x - (i * 24), this.y - (this.getHeight() / 2) + 3);
        }
        for (var ii = i; ii < totalhearts; ii++) {
            this._emptyHeart.draw(ctx, this.x - (ii * 24), this.y - (this.getHeight() / 2) + 3);
        }
    };
    HealthStat.width = 100;
    HealthStat.height = 15;
    return HealthStat;
}(ex.UIActor));
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="../lodash.d.ts" />
/// <reference path="pausable.ts" />
/// <reference path="gamestate.ts" />
/// <reference path="analytics.ts" />
/// <reference path="config.ts" />
/// <reference path="resources.ts" />
/// <reference path="stats.ts" />
/// <reference path="ship.ts" />
/// <reference path="badguyfactory.ts" />
/// <reference path="starfield.ts" />
/// <reference path="background.ts" />
/// <reference path="torch.ts" />
/// <reference path="settings.ts" />
/// <reference path="soundmanager.ts" />
/// <reference path="endscreen.ts" />
/// <reference path="health.ts" />
var game = new ex.Engine({
    canvasElementId: "game",
    width: Config.width,
    height: Config.height,
    pointerScope: ex.Input.PointerScope.Canvas
});
game.backgroundColor = ex.Color.Black.clone();
game.setAntialiasing(false);
game.input.keyboard.on('down', function (evt) {
    if (evt.key === ex.Input.Keys.Semicolon) {
        game.isDebug = !game.isDebug;
    }
});
game.currentScene.camera.x = Config.PlayerSpawn.x + Config.CameraOffset.x;
game.currentScene.camera.y = Config.PlayerSpawn.y + Config.CameraOffset.y;
// global sprites 
var GlobalSprites = {
    triangleBulletSheet: new ex.SpriteSheet(Resources.TriangleBullet, 3, 1, 32, 32),
    circleBulletSheet: new ex.SpriteSheet(Resources.CircleBullet, 3, 1, 32, 32),
    squareBulletSheet: new ex.SpriteSheet(Resources.SquareBullet, 3, 1, 32, 32),
    playerBulletSheet: new ex.SpriteSheet(Resources.PlayerBullet, 6, 1, 32, 32),
    TriangleBadGuySheet: new ex.SpriteSheet(Resources.TriangleBadguySheet, 2, 1, 32, 32),
    CircleBadGuySheet: new ex.SpriteSheet(Resources.CircleBadguySheet, 2, 1, 32, 32),
    SquareBadGuySheet: new ex.SpriteSheet(Resources.SquareBadguySheet, 2, 1, 32, 32),
    TriangleBadGuyExplosionSheet: new ex.SpriteSheet(Resources.TriangleBadguySheet, 5, 1, 32, 32),
    CircleBadGuyExplosionSheet: new ex.SpriteSheet(Resources.CircleBadguySheet, 5, 1, 32, 32),
    SquareBadGuyExplosionSheet: new ex.SpriteSheet(Resources.SquareBadguySheet, 5, 1, 32, 32)
};
var _triangleBulletAnim = GlobalSprites.triangleBulletSheet.getAnimationForAll(game, 100);
_triangleBulletAnim.anchor.setTo(.5, .5);
_triangleBulletAnim.loop = true;
var _circleBulletAnim = GlobalSprites.circleBulletSheet.getAnimationForAll(game, 100);
_circleBulletAnim.anchor.setTo(.5, .5);
_circleBulletAnim.loop = true;
var _squareBulletAnim = GlobalSprites.squareBulletSheet.getAnimationForAll(game, 100);
_squareBulletAnim.anchor.setTo(.5, .5);
_squareBulletAnim.loop = true;
var _playerBulletAnim = GlobalSprites.playerBulletSheet.getAnimationForAll(game, 100);
_playerBulletAnim.anchor.setTo(.5, .5);
_playerBulletAnim.loop = true;
var _triangleBaddie = GlobalSprites.TriangleBadGuySheet.getAnimationForAll(game, 150);
_triangleBaddie.loop = true;
_triangleBaddie.anchor.setTo(.3, .3);
var _squareBaddie = GlobalSprites.SquareBadGuySheet.getAnimationForAll(game, 150);
_squareBaddie.loop = true;
_squareBaddie.anchor.setTo(.3, .3);
var _circleBaddie = GlobalSprites.CircleBadGuySheet.getAnimationForAll(game, 150);
_circleBaddie.loop = true;
_circleBaddie.anchor.setTo(.3, .3);
var _triangleBaddieExplosion = GlobalSprites.TriangleBadGuyExplosionSheet.getAnimationBetween(game, 2, 4, 150);
//var _triangleBaddieExplosion = GlobalSprites.TriangleBadGuyExplosionSheet.getAnimationForAll(game, 150);
_triangleBaddieExplosion.loop = false;
_triangleBaddieExplosion.anchor.setTo(.3, .3);
var _squareBaddieExplosion = GlobalSprites.SquareBadGuyExplosionSheet.getAnimationBetween(game, 2, 4, 150);
//var _squareBaddieExplosion = GlobalSprites.SquareBadGuyExplosionSheet.getAnimationForAll(game, 150);
_squareBaddieExplosion.loop = false;
_squareBaddieExplosion.anchor.setTo(.3, .3);
var _circleBaddieExplosion = GlobalSprites.CircleBadGuyExplosionSheet.getAnimationBetween(game, 2, 4, 150);
//var _circleBaddieExplosion = GlobalSprites.CircleBadGuyExplosionSheet.getAnimationForAll(game, 150);
_circleBaddieExplosion.loop = false;
_circleBaddieExplosion.anchor.setTo(.3, .3);
var GlobalAnimations = {
    TriangleBullet: _triangleBulletAnim,
    CircleBullet: _circleBulletAnim,
    SquareBullet: _squareBulletAnim,
    PlayerBullet: _playerBulletAnim,
    TriangleBaddie: _triangleBaddie,
    SquareBaddie: _squareBaddie,
    CircleBaddie: _circleBaddie,
    TriangleBaddieExplosion: _triangleBaddieExplosion,
    SquareBaddieExplosion: _squareBaddieExplosion,
    CircleBaddieExplosion: _circleBaddieExplosion
};
// create loader
var loader = new ex.Loader();
for (var res in Resources) {
    loader.addResource(Resources[res]);
}
// mute/unmute button
document.getElementById("sound").addEventListener('click', function () {
    if (hasClass(this, 'fa-volume-up')) {
        replaceClass(this, 'fa-volume-up', 'fa-volume-off');
        SoundManager.stop();
    }
    else {
        replaceClass(this, 'fa-volume-off', 'fa-volume-up');
        SoundManager.start();
    }
});
// class manipulation
function hasClass(element, cls) {
    return element.classList.contains(cls);
}
function replaceClass(element, search, replace) {
    if (hasClass(element, search)) {
        this.removeClass(element, search);
        this.addClass(element, replace);
    }
}
function addClass(element, cls) {
    element.classList.add(cls);
}
function removeClass(element, cls) {
    element.classList.remove(cls);
}
var cameraDestActor;
function updateCamera(evt) {
    // Grab the current focus of the camper
    var focus = game.currentScene.camera.getFocus().toVector();
    // Grab the "destination" position, in the spring equation the displacement location
    var position = new ex.Vector(cameraDestActor.x, cameraDestActor.y);
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
var badGuyFactory = new BadGuyFactory();
function updateDispatchers(evt) {
    badGuyFactory.update(game, evt.delta);
}
var cameraVel = new ex.Vector(0, 0);
game.on('update', function (evt) {
    updateCamera(evt);
    updateDispatchers(evt);
});
function pause() {
    // pause entities
    for (var _i = 0, _a = game.currentScene.children; _i < _a.length; _i++) {
        var a = _a[_i];
        if ('paused' in a) {
            a.paused = true;
        }
    }
    badGuyFactory.paused = true;
}
function resume() {
    // pause entities
    for (var _i = 0, _a = game.currentScene.children; _i < _a.length; _i++) {
        var a = _a[_i];
        if ('paused' in a) {
            a.paused = false;
        }
    }
    badGuyFactory.paused = false;
}
var endscreen = new EndScreen();
var gameBounds = new ex.BoundingBox(0, 0, Config.MapWidth, Config.MapHeight);
var fbg = new Frontground();
game.start(loader).then(function () {
    var sf = new Starfield();
    var bg = new Background();
    //var fbg = new Frontground();	
    game.add(sf);
    game.add(bg);
    Torch.place(game);
    GameState.init();
    game.add(fbg);
    var vignette = new ex.UIActor(0, 0, game.width, game.height);
    vignette.addDrawing(Resources.Vignette);
    game.add(vignette);
    var killIdx = GameState.getStatIdx("KILLS");
    var killHUDUI = new HUDStat(GameState.state.stats[killIdx], 10, 60, 150, 50);
    game.add(killHUDUI);
    // portal stats
    var statPadding = 30;
    var statSpacing = 30;
    var healthStat = new HealthStat(statPadding + 75, statSpacing);
    var squareStat = new PortalStat(statPadding, statSpacing * 2 + PortalStat.height, Shape.Shape1);
    var circleStat = new PortalStat(statPadding, statSpacing * 3 + PortalStat.height, Shape.Shape2);
    var triangleStat = new PortalStat(statPadding, statSpacing * 4 + PortalStat.height, Shape.Shape3);
    game.add(healthStat);
    game.add(squareStat);
    game.add(circleStat);
    game.add(triangleStat);
    Resources.BkgrdTrack.setLoop(true);
    Resources.BkgrdTrack.play();
});
//# sourceMappingURL=game.js.map
/// <reference path="../Excalibur/dist/Excalibur.d.ts" />
/// <reference path="../lodash.d.ts" />
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


var game = new ex.Engine({
   canvasElementId: "game",
   width: Config.width,
   height: Config.height,
	pointerScope: ex.Input.PointerScope.Canvas,
});

game.backgroundColor = ex.Color.Black.clone();
game.setAntialiasing(false);
game.input.keyboard.on('down', (evt: ex.Input.KeyEvent) => {
   if(evt.key === ex.Input.Keys.Semicolon){
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
}

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
}

// create loader
var loader = new ex.Loader();
for(var res in Resources){
   loader.addResource(Resources[res]);
}

// mute/unmute button
document.getElementById("sound").addEventListener('click', function () {
   if (hasClass(this, 'fa-volume-up')) {
      replaceClass(this, 'fa-volume-up', 'fa-volume-off');
      SoundManager.stop();
	} else {
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
  

function updateCamera(evt: ex.UpdateEvent){
		
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

var badGuyFactory = new BadGuyFactory();

function updateDispatchers(evt: ex.UpdateEvent) {
	badGuyFactory.update(game, evt.delta);
}

var cameraVel = new ex.Vector(0, 0);
game.on('update', (evt: ex.UpdateEvent) => {
	updateCamera(evt);
	updateDispatchers(evt);
	
});
var endscreen = new EndScreen();
var gameBounds = new ex.BoundingBox(0, 0, Config.MapWidth, Config.MapHeight);
game.start(loader).then(() => {
	var sf = new Starfield();
	var bg = new Background();
	var fbg = new Frontground();	
	
	game.add(sf);
	game.add(bg);	
	Torch.place(game);
	GameState.init();
	game.add(fbg);
	
	var killIdx = GameState.getStatIdx("KILLS");
	
	var killHUDUI = new HUDStat(GameState.state.stats[killIdx], 10, 60, 150, 50);
	game.add(killHUDUI);
	game.add(endscreen);
	
	// portal stats
	const statPadding = 30;
	const statSpacing = 50;
	var squareStat = new PortalStat(statPadding, Config.height - 30, Shape.Shape1);
	var circleStat = new PortalStat(statPadding + (PortalStat.width + statSpacing), Config.height - 30, Shape.Shape2);
	var triangleStat = new PortalStat(statPadding + (PortalStat.width * 2 + statSpacing * 2), Config.height - 30, Shape.Shape3);
	game.add(squareStat);
	game.add(circleStat);
	game.add(triangleStat);
});
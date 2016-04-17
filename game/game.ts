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
   height: Config.height,
});

game.backgroundColor = ex.Color.Black.clone();
game.setAntialiasing(false);
game.input.keyboard.on('down', (evt: ex.Input.KeyEvent) => {
   if(evt.key === ex.Input.Keys.D){
      game.isDebug = !game.isDebug;
   }
});

// create loader
var loader = new ex.Loader();
for(var res in Resources){
   loader.addResource(Resources[res]);
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

var badGuyFactory = new BadGuyFactory(Config.SpawnInterval, Config.MinEnemiesPerSpawn, Config.MaxEnemiesPerSpawn);
badGuyFactory.start();
function updateDispatchers(evt: ex.UpdateEvent) {
	badGuyFactory.update(game, evt.delta);
}

var cameraVel = new ex.Vector(0, 0);
game.on('update', (evt: ex.UpdateEvent) => {
	updateCamera(evt);
	updateDispatchers(evt);
	
});

var gameBounds = new ex.BoundingBox(0, 0, Config.MapWidth, Config.MapHeight);
game.start(loader).then(() => {
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
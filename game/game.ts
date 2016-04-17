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

game.start(loader).then(() => {
	var sf = new Starfield();
	var statBox = new HUDStat(new Stat("test", "derp"), 100, 100, 150, 50);
	var spriteFont = new ex.SpriteFont(Resources.DigitalFontSheet, " !\"#$%&'{}*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_", false, 8, 8, 32, 32);
	
	var statLabel = new ex.Label("TEST PLOX", 100, 100, null, spriteFont);
	statLabel.fontSize = 40;
	statLabel.letterSpacing = -20;
	//statLabel.color = ex.Color.Red.clone();
	statBox.add(statLabel);
	game.add(sf);
	game.add(statBox);
	GameState.init(game);
});
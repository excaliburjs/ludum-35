var Config = {
   width: 960,
   height: 640,
   
   MapWidth: 5000,
   MapHeight: 960,
   
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
   
   // Baddies
   PortalSpawnWaitTime: 3000, //ms
   
   poolSizeIncrement: 100,
      
   // Starfield
   StarfieldSize: 500,
   StarfieldMinFade: 0.2,
   StarfieldMaxFade: 0.7,
   StarfieldMinFadeRefreshAmount: 0.05,
   StarfieldMaxFadeRefreshAmount: 0.15,
   StarfieldRefreshRate: 300, // ms
   StarfieldMeteorFreqMin: 2000,
   StarfieldMeteorFreqMax: 7000,
   StarfieldMeteorSpeed: 320,
      
   StraightShooterFrequency: 500,
   BadguyShooterFrequency: 800,
   // Bullet config
   bullets: {
      speed: 500, // px/s
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
}
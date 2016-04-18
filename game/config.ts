var Config = {
   width: 960,
   height: 640,
   
   MapWidth: 5000,
   MapHeight: 960,
   
   // Ship
   PlayerSpawn: new ex.Point(2500, 700),
      
   // Camera
   CameraElasticity: .08,
	CameraFriction: .41,
   shipSpeedScale: 2,
   spaceFriction: .01,
   ShieldCoolDownTime: 1000,
   
   // Player
   playerMinVelocity: -500,
   playerMaxVelocity: 500,
   
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
   // Bullet config
   bullets: {
      speed: 500, // px/s
      damage: 1,
      rotation: Math.PI 
   },
   
   badguy: {
      speed: 200,
      missRadius: 200,
      size: 1 //multiplier from original?
   }
   
   
}
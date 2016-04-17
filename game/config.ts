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
   
   // Baddies
   SpawnInterval: 5500, //ms
   MinEnemiesPerSpawn: 1,  
   MaxEnemiesPerSpawn: 5,
   
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
      
   // Bullet config
   bullets: {
      speed: 200, // px/s
      damage: 1
   },
   
   badguy: {
      speed: 1,
      size: 1 //multiplier from original?
   }
   
   
}
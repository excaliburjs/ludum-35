var Config = {
   width: 960,
   height: 640,
      
   // Camera
   CameraElasticity: .01,
	CameraFriction: .21,
   shipSpeedScale: .2,
   
   poolSizeIncrement: 100,
      
   // Starfield
   StarfieldSize: 1000,
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
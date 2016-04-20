class SoundManager {
   
   public static start() {
      // set all sound effect volumes
      if (Options.sound) {
         SoundManager.setSoundEffectLevels(0.1);
      } else {
         SoundManager.setSoundEffectLevels(0);
      }
      // set music volume
      if (Options.music) {
         //TODO
      } else {
         //TODO
      }
   }
   
   public static setSoundEffectLevels(volume: number) {
      _.forIn(Resources, (resource) => {
         if (resource instanceof ex.Sound) {
            (<ex.Sound>resource).setVolume(volume);
            if((<ex.Sound>resource) === Resources.BkgrdTrack){
               (<ex.Sound>resource).setVolume(1);
               (<ex.Sound>resource).play();
            }
         }
      });
   }
   
   public static stop() {
      _.forIn(Resources, (resource) => {
         if (resource instanceof ex.Sound) {
            (<ex.Sound>resource).setVolume(0);
            (<ex.Sound>resource).stop();
         }
      });
   }
   
}
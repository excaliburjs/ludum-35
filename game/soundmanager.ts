class SoundManager {
   
   public static start() {
      // set all sound effect volumes
      if (Options.sound) {
         SoundManager.setSoundEffectLevels(1);
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
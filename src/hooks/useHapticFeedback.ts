
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export function useHapticFeedback() {
  const triggerHapticFeedback = async (style: ImpactStyle = ImpactStyle.Medium) => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style });
      }
    } catch (error) {
      console.log("Haptic feedback not available:", error);
    }
  };

  const triggerNotificationHaptic = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Haptics.notification();
      }
    } catch (error) {
      console.log("Haptic notification not available:", error);
    }
  };

  return {
    triggerHapticFeedback,
    triggerNotificationHaptic
  };
}

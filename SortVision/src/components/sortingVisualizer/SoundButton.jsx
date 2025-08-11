import { useState, useEffect, useCallback } from "react";
import audioEngine from "../../lib/audioEngine";

const SoundButton = () => {
  // initialize from localStorage
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem("soundEnabled");
    return saved ? JSON.parse(saved) : false;
  });

  // apply initial state
  useEffect(() => {
    const setupSound = async () => {
      await audioEngine.init();
      if (isEnabled) {
        await audioEngine.enableSound();
      } else {
        await audioEngine.disableSound();
      }
    };
    setupSound();
  }, [isEnabled]);

  // toggle sound
  const handleToggle = useCallback(async () => {
    try {
      if (!audioEngine.isInitialized) {
        await audioEngine.init();
      }

      if (isEnabled) {
        await audioEngine.disableSound();
      } else {
        await audioEngine.enableSound();
      }

      const nextState = !isEnabled;
      setIsEnabled(nextState);
      localStorage.setItem("soundEnabled", JSON.stringify(nextState));
    } catch (e) {
      console.error("Sound toggle failed:", e);
    }
  }, [isEnabled]);

  return (
    <button
      onClick={handleToggle}
      aria-pressed={isEnabled}
      className={`sound-button ${isEnabled ? "enabled" : "disabled"}`}
    >
      {isEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
    </button>
  );
};

export default SoundButton;

import { createContext, useContext, useState } from "react";

export const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  return (
    <AudioContext.Provider value={{ isAudioEnabled, setIsAudioEnabled }}>
      {children}
    </AudioContext.Provider>
  );
};

// A simple hook
export const useAudioContext = () => useContext(AudioContext);

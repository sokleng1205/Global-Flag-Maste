
import React, { createContext, useContext, useCallback, useRef } from 'react';

const SoundContext = createContext({
  playCorrect: () => {},
  playWrong: () => {},
  playLevelUp: () => {},
  playClick: () => {},
});

export const useSound = () => useContext(SoundContext);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playOsc = (freq: number, type: OscillatorType, duration: number, volume: number = 0.2) => {
    initAudio();
    const ctx = audioCtxRef.current!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  const playCorrect = useCallback(() => {
    playOsc(880, 'sine', 0.2); // A5
    setTimeout(() => playOsc(1108.73, 'sine', 0.3), 100); // C#6
  }, []);

  const playWrong = useCallback(() => {
    playOsc(220, 'sawtooth', 0.4, 0.1); // A3
  }, []);

  const playLevelUp = useCallback(() => {
    playOsc(523.25, 'triangle', 0.2); // C5
    setTimeout(() => playOsc(659.25, 'triangle', 0.2), 150); // E5
    setTimeout(() => playOsc(783.99, 'triangle', 0.4), 300); // G5
  }, []);

  const playClick = useCallback(() => {
    playOsc(440, 'sine', 0.05, 0.05); // A4
  }, []);

  return (
    <SoundContext.Provider value={{ playCorrect, playWrong, playLevelUp, playClick }}>
      {children}
    </SoundContext.Provider>
  );
};

import React, { useEffect, useRef, useState } from 'react';

const BAR_COUNT = 12;
const FFT_SIZE = 256;
const SMOOTHING = 0.8;
const MIN_HEIGHT_PERCENT = 10;
const IDLE_HEIGHT_PERCENT = 14;
const LOADING_WAVE_SPEED = 0.008;
const LOADING_MIN = 18;
const LOADING_MAX = 92;

export type AudioBarsVisualizerState = 'idle' | 'loading' | 'playing';

export interface AudioBarsVisualizerProps {
  state: AudioBarsVisualizerState;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  className?: string;
}

function waveHeight(phase: number, barIndex: number): number {
  const offset = (barIndex / BAR_COUNT) * Math.PI * 2;
  const t = phase + offset;
  const normalized = (Math.sin(t) + 1) / 2;
  return Math.round(LOADING_MIN + normalized * (LOADING_MAX - LOADING_MIN));
}

export function AudioBarsVisualizer({
  state,
  audioRef,
  className = '',
}: AudioBarsVisualizerProps) {
  const [levels, setLevels] = useState<number[]>(() =>
    Array.from({ length: BAR_COUNT }, () => IDLE_HEIGHT_PERCENT),
  );
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const frameRef = useRef<number>(0);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const loadingPhaseRef = useRef(0);

  useEffect(() => {
    if (state !== 'playing' || !audioRef?.current) {
      setLevels(Array.from({ length: BAR_COUNT }, () => IDLE_HEIGHT_PERCENT));
      return;
    }

    const el = audioRef.current;
    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(el);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = SMOOTHING;
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    audioContextRef.current = audioContext;
    sourceRef.current = source;
    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

    const binsPerBar = Math.floor(analyser.frequencyBinCount / BAR_COUNT);

    const loop = () => {
      const analyserNode = analyserRef.current;
      const dataArray = dataArrayRef.current;
      if (!analyserNode || !dataArray) return;

      analyserNode.getByteFrequencyData(dataArray);
      const next: number[] = [];
      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0;
        const start = i * binsPerBar;
        const end = Math.min(start + binsPerBar, dataArray.length);
        for (let j = start; j < end; j++) sum += dataArray[j];
        const avg = end > start ? sum / (end - start) : 0;
        const normalized =
          MIN_HEIGHT_PERCENT + (avg / 255) * (100 - MIN_HEIGHT_PERCENT);
        next.push(Math.round(normalized));
      }
      setLevels(next);
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameRef.current);
      source.disconnect();
      analyser.disconnect();
      analyserRef.current = null;
      sourceRef.current = null;
      audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, [state, audioRef]);

  useEffect(() => {
    if (state !== 'loading') return;

    const loop = () => {
      loadingPhaseRef.current += LOADING_WAVE_SPEED;
      setLevels(
        Array.from({ length: BAR_COUNT }, (_, i) =>
          waveHeight(loadingPhaseRef.current, i),
        ),
      );
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [state]);

  useEffect(() => {
    if (state === 'idle') {
      setLevels(Array.from({ length: BAR_COUNT }, () => IDLE_HEIGHT_PERCENT));
    }
  }, [state]);

  return (
    <div
      className={`flex items-end justify-center gap-1 h-14 ${className}`}
      role="img"
      aria-label={
        state === 'loading'
          ? 'Generating audio'
          : state === 'playing'
            ? 'Audio level'
            : 'Audio visualizer'
      }
    >
      {levels.map((height, i) => (
        <div
          key={i}
          className="w-1.5 min-h-[10%] rounded-full bg-primary transition-[height] duration-75 ease-out"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

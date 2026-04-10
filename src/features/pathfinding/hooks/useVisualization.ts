import { useState, useRef, useCallback } from 'react';

import type { AlgorithmStep, AlgorithmResult, PlaybackStatus, SpeedPreset } from '../types/grid';
import { SPEED_MS } from '../constants';

interface UseVisualizationReturn {
  status: PlaybackStatus;
  currentStepIndex: number;
  currentStep: AlgorithmStep | null;
  totalSteps: number;
  speed: SpeedPreset;
  isPathFound: boolean | null;
  totalVisited: number;

  load: (result: AlgorithmResult) => void;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
  setSpeed: (speed: SpeedPreset) => void;
}

/**
 * Core playback controller for algorithm visualization.
 * Manages step history and timed advancement.
 * Uses setTimeout (not setInterval) for precise per-step timing.
 */
export function useVisualization(): UseVisualizationReturn {
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speed, setSpeedState] = useState<SpeedPreset>('medium');
  const [isPathFound, setIsPathFound] = useState<boolean | null>(null);
  const [totalVisited, setTotalVisited] = useState(0);

  const stepsRef = useRef<AlgorithmStep[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusRef = useRef<PlaybackStatus>('idle');
  const stepIndexRef = useRef(0);
  const speedRef = useRef<SpeedPreset>('medium');

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(() => {
    clearTimer();
    const ms = SPEED_MS[speedRef.current];

    if (ms === 0) {
      // Instant: jump to last step
      const lastIndex = stepsRef.current.length - 1;
      stepIndexRef.current = lastIndex;
      setCurrentStepIndex(lastIndex);
      statusRef.current = 'finished';
      setStatus('finished');
      return;
    }

    timerRef.current = setTimeout(() => {
      if (statusRef.current !== 'playing') return;

      const nextIndex = stepIndexRef.current + 1;
      if (nextIndex >= stepsRef.current.length) {
        statusRef.current = 'finished';
        setStatus('finished');
        return;
      }

      stepIndexRef.current = nextIndex;
      setCurrentStepIndex(nextIndex);
      scheduleNext();
    }, ms);
  }, [clearTimer]);

  const load = useCallback(
    (result: AlgorithmResult) => {
      clearTimer();
      stepsRef.current = result.steps;
      stepIndexRef.current = 0;
      setCurrentStepIndex(0);
      statusRef.current = 'idle';
      setStatus('idle');
      setIsPathFound(result.isPathFound);
      setTotalVisited(result.totalVisited);
    },
    [clearTimer],
  );

  const play = useCallback(() => {
    if (stepsRef.current.length === 0) return;

    // If finished, restart from beginning
    if (statusRef.current === 'finished') {
      stepIndexRef.current = 0;
      setCurrentStepIndex(0);
    }

    statusRef.current = 'playing';
    setStatus('playing');
    scheduleNext();
  }, [scheduleNext]);

  const pause = useCallback(() => {
    clearTimer();
    statusRef.current = 'paused';
    setStatus('paused');
  }, [clearTimer]);

  const stepForward = useCallback(() => {
    if (stepsRef.current.length === 0) return;
    clearTimer();

    const nextIndex = Math.min(stepIndexRef.current + 1, stepsRef.current.length - 1);
    stepIndexRef.current = nextIndex;
    setCurrentStepIndex(nextIndex);

    if (nextIndex >= stepsRef.current.length - 1) {
      statusRef.current = 'finished';
      setStatus('finished');
    } else {
      statusRef.current = 'paused';
      setStatus('paused');
    }
  }, [clearTimer]);

  const stepBackward = useCallback(() => {
    if (stepsRef.current.length === 0) return;
    clearTimer();

    const prevIndex = Math.max(stepIndexRef.current - 1, 0);
    stepIndexRef.current = prevIndex;
    setCurrentStepIndex(prevIndex);
    statusRef.current = 'paused';
    setStatus('paused');
  }, [clearTimer]);

  const jumpTo = useCallback(
    (index: number) => {
      if (stepsRef.current.length === 0) return;
      clearTimer();

      const clamped = Math.max(0, Math.min(index, stepsRef.current.length - 1));
      stepIndexRef.current = clamped;
      setCurrentStepIndex(clamped);

      if (clamped >= stepsRef.current.length - 1) {
        statusRef.current = 'finished';
        setStatus('finished');
      } else {
        statusRef.current = 'paused';
        setStatus('paused');
      }
    },
    [clearTimer],
  );

  const reset = useCallback(() => {
    clearTimer();
    stepsRef.current = [];
    stepIndexRef.current = 0;
    setCurrentStepIndex(0);
    statusRef.current = 'idle';
    setStatus('idle');
    setIsPathFound(null);
    setTotalVisited(0);
  }, [clearTimer]);

  const setSpeed = useCallback((s: SpeedPreset) => {
    speedRef.current = s;
    setSpeedState(s);
  }, []);

  const currentStep = stepsRef.current[currentStepIndex] ?? null;

  return {
    status,
    currentStepIndex,
    currentStep,
    totalSteps: stepsRef.current.length,
    speed,
    isPathFound,
    totalVisited,
    load,
    play,
    pause,
    stepForward,
    stepBackward,
    jumpTo,
    reset,
    setSpeed,
  };
}

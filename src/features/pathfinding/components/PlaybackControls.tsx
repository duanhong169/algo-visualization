import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

import type { PlaybackStatus, SpeedPreset } from '../types/grid';

interface PlaybackControlsProps {
  status: PlaybackStatus;
  currentStep: number;
  totalSteps: number;
  speed: SpeedPreset;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onJumpTo: (index: number) => void;
  onReset: () => void;
  onSpeedChange: (speed: SpeedPreset) => void;
}

const SPEED_OPTIONS: { value: SpeedPreset; label: string }[] = [
  { value: 'slow', label: 'Slow' },
  { value: 'medium', label: 'Medium' },
  { value: 'fast', label: 'Fast' },
  { value: 'instant', label: 'Instant' },
];

export function PlaybackControls({
  status,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onJumpTo,
  onReset,
  onSpeedChange,
}: PlaybackControlsProps) {
  const isIdle = status === 'idle';
  const isPlaying = status === 'playing';
  const hasSteps = totalSteps > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Playback buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onStepBackward}
          disabled={isIdle || currentStep === 0}
          title="Step backward"
        >
          ◄
        </Button>

        {isPlaying ? (
          <Button variant="primary" size="sm" onClick={onPause} title="Pause">
            ❚❚
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={onPlay}
            title={isIdle ? 'Run' : 'Resume'}
          >
            ▶
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onStepForward}
          disabled={isIdle || currentStep >= totalSteps - 1}
          title="Step forward"
        >
          ►
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={isIdle}
          title="Reset"
        >
          ↺
        </Button>
      </div>

      {/* Progress scrubber */}
      {hasSteps && (
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentStep}
            onChange={(e) => onJumpTo(Number(e.target.value))}
            className="h-1.5 w-32 cursor-pointer accent-primary"
          />
          <span className="text-xs tabular-nums text-text-muted">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
      )}

      {/* Speed selector */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-text-muted">Speed:</span>
        {SPEED_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSpeedChange(opt.value)}
            className={cn(
              'rounded px-1.5 py-0.5 text-xs transition-colors',
              speed === opt.value
                ? 'bg-primary text-white'
                : 'text-text-muted hover:bg-bg hover:text-text',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

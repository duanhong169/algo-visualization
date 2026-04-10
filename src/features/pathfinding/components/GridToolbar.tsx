import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

import type { EditorTool } from '../types/grid';
import { GRID_LEVELS } from '../constants';

interface GridToolbarProps {
  activeTool: EditorTool;
  onToolChange: (tool: EditorTool) => void;
  onClear: () => void;
  onReset: () => void;
  isRunning: boolean;
  gridLevel: number;
  onGridLevelChange: (level: number) => void;
}

const TOOLS: { id: EditorTool; label: string; icon: string }[] = [
  { id: 'wall', label: 'Wall', icon: '▪' },
  { id: 'eraser', label: 'Eraser', icon: '▫' },
  { id: 'start', label: 'Start', icon: 'S' },
  { id: 'end', label: 'End', icon: 'E' },
];

export function GridToolbar({
  activeTool,
  onToolChange,
  onClear,
  onReset,
  isRunning,
  gridLevel,
  onGridLevelChange,
}: GridToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface px-3 py-2">
      {/* Tool buttons */}
      <div className="flex gap-1">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            disabled={isRunning}
            className={cn(
              'rounded-md px-2 py-1 text-xs font-medium transition-colors',
              activeTool === tool.id
                ? 'bg-primary text-white'
                : 'bg-bg text-text-muted hover:bg-border hover:text-text',
              isRunning && 'cursor-not-allowed opacity-50',
            )}
            title={tool.label}
          >
            <span className="mr-1">{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-border" />

      {/* Grid level selector */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-text-muted">Grid:</span>
        {GRID_LEVELS.map((preset) => (
          <button
            key={preset.level}
            onClick={() => onGridLevelChange(preset.level)}
            disabled={isRunning}
            className={cn(
              'rounded px-1.5 py-0.5 text-xs transition-colors',
              gridLevel === preset.level
                ? 'bg-primary text-white'
                : 'text-text-muted hover:bg-bg hover:text-text',
              isRunning && 'cursor-not-allowed opacity-50',
            )}
            title={`${preset.rows}×${preset.cols}`}
          >
            {preset.level}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-border" />

      {/* Actions */}
      <Button variant="outline" size="sm" onClick={onClear} disabled={isRunning}>
        Clear Walls
      </Button>
      <Button variant="outline" size="sm" onClick={onReset} disabled={isRunning}>
        Reset
      </Button>
    </div>
  );
}

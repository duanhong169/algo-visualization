/** Color legend for the grid visualization. */
export function GridLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
      <LegendItem color="#1A7F37" label="起点 (Start)" />
      <LegendItem color="#CF222E" label="终点 (End)" />
      <LegendItem color="#1F2328" label="墙 (Wall)" />
      <LegendItem color="#DAFBE1" label="Open Set" />
      <LegendItem color="#DDF4FF" label="Closed Set" />
      <LegendItem color="#FBEFB6" label="当前节点" />
      <LegendItem color="#FD8C73" label="路径 (Path)" />
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-3 w-3 rounded-sm border border-border"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

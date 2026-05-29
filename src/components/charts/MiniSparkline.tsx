"use client";

import { useMemo } from "react";

export function MiniSparkline({
  data,
  width = 120,
  height = 36,
  color = "#00e5ff",
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  const { path, area, last } = useMemo(() => {
    if (data.length < 2) return { path: "", area: "", last: 0 };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const stepX = width / (data.length - 1);
    const pts = data.map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / span) * (height - 4) - 2;
      return [x, y] as const;
    });
    const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const area = `${path} L${width},${height} L0,${height} Z`;
    return { path, area, last: pts[pts.length - 1][1] };
  }, [data, width, height]);

  const id = useMemo(() => `spark-${Math.random().toString(36).slice(2, 8)}`, []);

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={width} cy={last} r="2" fill={color} />
    </svg>
  );
}

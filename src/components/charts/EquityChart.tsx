"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, type IChartApi } from "lightweight-charts";
import type { CurvePoint } from "@/lib/derive";

export function EquityChart({
  data,
  height = 260,
}: {
  data: CurvePoint[];
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#6b7a99",
        fontFamily: "var(--font-jetbrains), monospace",
      },
      grid: {
        vertLines: { color: "rgba(0,229,255,0.05)" },
        horzLines: { color: "rgba(0,229,255,0.05)" },
      },
      rightPriceScale: { borderColor: "rgba(0,229,255,0.12)" },
      timeScale: { borderColor: "rgba(0,229,255,0.12)", timeVisible: true },
      crosshair: {
        vertLine: { color: "rgba(0,229,255,0.4)", labelBackgroundColor: "#00e5ff" },
        horzLine: { color: "rgba(0,229,255,0.4)", labelBackgroundColor: "#00e5ff" },
      },
    });
    chartRef.current = chart;

    const series = chart.addAreaSeries({
      lineColor: "#00e5ff",
      topColor: "rgba(0,229,255,0.35)",
      bottomColor: "rgba(0,229,255,0.02)",
      lineWidth: 2,
    });

    series.setData(
      data.map((p) => ({ time: p.time as never, value: p.value }))
    );
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current)
        chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, height]);

  return <div ref={containerRef} className="w-full" style={{ height }} />;
}

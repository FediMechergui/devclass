"use client";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { METRIC_CODES } from "@/lib/types";
import { METRICS } from "@/lib/metrics";
import type { ScoreVector } from "@/lib/types";

interface Props {
  vector: ScoreVector;
  color?: string;
  size?: number;
}

export function MetricRadar({ vector, color = "#C9A86A", size = 360 }: Props) {
  const data = METRIC_CODES.map((m) => ({
    metric: METRICS[m].short,
    value: vector[m],
    full: 100,
  }));

  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="#4A4538" strokeOpacity={0.5} />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#B5AB97", fontSize: 11, fontFamily: "var(--font-body)" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#7A7464", fontSize: 9 }}
            stroke="#4A4538"
            tickCount={5}
          />
          <Radar
            name="You"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.35}
            strokeWidth={2}
            isAnimationActive
            animationDuration={1200}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

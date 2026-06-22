import React, { useEffect, useState } from 'react';

/**
 * CircularProgress renders a donut chart showing current calories vs goal.
 * Props:
 *   - calories: number (current calories consumed)
 *   - goal: number (daily calorie goal)
 *   - size: number (diameter in px, responsive via prop)
 */
export default function CircularProgress({ calories = 0, goal = 2000, size = 120 }) {
  const [progress, setProgress] = useState(0);

  // calculate percentage, clamp between 0-100
  const percent = Math.min(100, Math.max(0, (calories / goal) * 100));
  const radius = size / 2 - 8; // 8px padding for stroke width
  const circumference = 2 * Math.PI * radius;

  // Determine color based on thresholds
  const getColor = () => {
    if (percent < 90) return 'stroke-cyan';
    if (percent < 100) return 'stroke-amber';
    return 'stroke-red';
  };

  // Animate the dash offset on mount / when percent changes
  useEffect(() => {
    let start = null;
    const duration = 400; // ms
    const startOffset = circumference * (1 - progress / 100);
    const targetOffset = circumference * (1 - percent / 100);
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progressPct = Math.min(elapsed / duration, 1);
      const currentOffset = startOffset + (targetOffset - startOffset) * progressPct;
      setProgress(prev => {
        // we only need percent for dashoffset; store percent directly
        return percent * progressPct;
      });
      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percent]);

  const dashOffset = circumference * (1 - percent / 100);

  return (
    <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={getColor()}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.4s ease-out' }}
        />
      </svg>
      <div className="mt-2 text-sm font-medium text-darktext">
        {calories} / {goal} kcal
      </div>
    </div>
  );
}

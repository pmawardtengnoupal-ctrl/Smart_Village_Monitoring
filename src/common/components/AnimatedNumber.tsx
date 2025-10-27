'use client';
import React, { useEffect, useState } from 'react';

export default function AnimatedNumber({ value, duration=500 }:{ value: number; duration?: number }) {
  const [n, setN] = useState(0);
  useEffect(()=>{
    const start = performance.now();
    const from = n;
    const delta = value - from;
    let raf = 0;
    const tick = (t:number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(from + delta * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[value]);
  return <span>{n.toLocaleString()}</span>;
}

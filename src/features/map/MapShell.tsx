// src/features/map/MapShell.tsx
'use client';
import React from 'react';

export default function MapShell() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const { Map } = await import('maplibre-gl'); // throws if not installed
        const map = new Map({
          container: ref.current as HTMLDivElement,
          style: 'https://demotiles.maplibre.org/style.json',
          center: [77.0, 23.0],
          zoom: 3
        });
        return () => map.remove();
      } catch {
        // silently fallback to placeholder
      }
    })();
  }, []);

  return (
    <div ref={ref} className="h-80 w-full rounded border bg-slate-100 flex items-center justify-center text-slate-500">
      Map placeholder (install maplibre-gl for live map)
    </div>
  );
}

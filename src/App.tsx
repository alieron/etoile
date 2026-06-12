import { useCallback, useState } from 'react';
import { StarControls } from './components/StarControls';
import { StarScene } from './components/StarScene';
import type { StarFilters } from './components/StarField';

export function App() {
  const [gridVisible, setGridVisible] = useState(true);
  const [filters, setFilters] = useState<StarFilters>({ categories: new Set(), ranks: new Set() });
  const updateFilters = useCallback((nextFilters: StarFilters) => setFilters(nextFilters), []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <StarScene gridVisible={gridVisible} filters={filters} />

      <div className="pointer-events-none absolute inset-0 z-10">
        <StarControls
          filters={filters}
          onChange={updateFilters}
          gridVisible={gridVisible}
          onToggleGrid={() => setGridVisible((value) => !value)}
        />
      </div>
    </div>
  );
}

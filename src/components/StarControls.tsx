import { useEffect, useMemo, useState } from 'react';
import type { StarCategory, StarRecord } from '../types';
import type { StarFilters } from './StarField';

type Tab = 'category' | 'rank';
type StarPayload = Record<string, StarRecord>;
type CategoryPayload = Record<string, StarCategory>;

type StarControlsProps = {
  filters: StarFilters;
  onChange: (filters: StarFilters) => void;
  gridVisible: boolean;
  onToggleGrid: () => void;
};

function toggleSet<T>(source: Set<T>, value: T) {
  const next = new Set(source);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function label(value: string) {
  return value.replaceAll('_', ' ');
}

export function StarControls({ filters, onChange, gridVisible, onToggleGrid }: StarControlsProps) {
  const [tab, setTab] = useState<Tab>('category');
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<StarCategory[]>([]);
  const [stars, setStars] = useState<StarRecord[]>([]);

  useEffect(() => {
    let active = true;

    Promise.all([
      fetch('/data/stars.json').then((response) => response.json() as Promise<StarPayload>),
      fetch('/data/star-categories.json').then((response) => response.json() as Promise<CategoryPayload>),
    ]).then(([starsPayload, categoriesPayload]) => {
      if (!active) return;
      const nextStars = Object.values(starsPayload);
      const nextCategories = Object.values(categoriesPayload).sort((a, b) => a.id - b.id);
      setStars(nextStars);
      setCategories(nextCategories);

      onChange({
        categories: new Set(nextCategories.map((category) => category.id)),
        ranks: new Set([...new Set(nextStars.map((star) => star.rank))].sort((a, b) => a - b)),
      });
    });

    return () => {
      active = false;
    };
  }, [onChange]);

  const ranks = useMemo(() => [...new Set(stars.map((star) => star.rank))].sort((a, b) => a - b), [stars]);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return stars
      .filter((star) => star.name.toLowerCase().includes(normalized) || star.id.includes(normalized))
      .slice(0, 6);
  }, [query, stars]);

  return (
    <div className="pointer-events-auto absolute right-4 top-4 w-[22rem] max-w-[calc(100vw-2rem)] border border-zinc-500/40 bg-black/75 p-3 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-200 shadow-[0_0_40px_rgba(255,255,255,0.08)] backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between border-b border-zinc-600/40 pb-2">
        <div className="text-zinc-100">star index</div>
        <button type="button" onClick={onToggleGrid} className="border border-zinc-600 px-2 py-1 text-zinc-300 hover:border-zinc-200 hover:text-white">
          grid {gridVisible ? 'on' : 'off'}
        </button>
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="search stars"
        className="mb-2 w-full border border-zinc-600/70 bg-zinc-950/80 px-3 py-2 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-200"
      />

      {matches.length > 0 && (
        <div className="mb-3 border border-zinc-700/70 bg-black/80">
          {matches.map((star) => (
            <button key={star.id} type="button" className="block w-full border-b border-zinc-800 px-3 py-2 text-left text-zinc-300 last:border-b-0 hover:bg-zinc-900 hover:text-white">
              {star.name} <span className="text-zinc-600">r{star.rank}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mb-3 grid grid-cols-2 border border-zinc-700">
        <button type="button" onClick={() => setTab('category')} className={`px-3 py-2 ${tab === 'category' ? 'bg-zinc-200 text-black' : 'text-zinc-400 hover:text-white'}`}>
          category
        </button>
        <button type="button" onClick={() => setTab('rank')} className={`border-l border-zinc-700 px-3 py-2 ${tab === 'rank' ? 'bg-zinc-200 text-black' : 'text-zinc-400 hover:text-white'}`}>
          rank
        </button>
      </div>

      <div className="max-h-[55vh] overflow-auto pr-1">
        {tab === 'category' &&
          categories.map((category) => (
            <label key={category.id} className="mb-1 flex cursor-pointer items-center gap-2 border border-zinc-800/80 px-2 py-2 text-zinc-300 hover:border-zinc-500 hover:text-white">
              <input
                type="checkbox"
                checked={filters.categories.has(category.id)}
                onChange={() => onChange({ ...filters, categories: toggleSet(filters.categories, category.id) })}
                className="accent-zinc-200"
              />
              <span className="h-2 w-2" style={{ backgroundColor: `rgb(${category.rgb.join(',')})` }} />
              <span className="flex-1">{label(category.name)}</span>
              <span className="text-zinc-600">{category.id}</span>
            </label>
          ))}

        {tab === 'rank' &&
          ranks.map((rank) => (
            <label key={rank} className="mb-1 flex cursor-pointer items-center gap-2 border border-zinc-800/80 px-2 py-2 text-zinc-300 hover:border-zinc-500 hover:text-white">
              <input
                type="checkbox"
                checked={filters.ranks.has(rank)}
                onChange={() => onChange({ ...filters, ranks: toggleSet(filters.ranks, rank) })}
                className="accent-zinc-200"
              />
              <span className="flex-1">rank {rank}</span>
            </label>
          ))}
      </div>
    </div>
  );
}

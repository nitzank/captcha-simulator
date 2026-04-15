'use client';

import { useState } from 'react';
import { useSimulatorStore, GridTile } from '@/lib/store';

async function fetchImages(query: string, count: number): Promise<string[]> {
  const res = await fetch(`/api/images?query=${encodeURIComponent(query)}&count=${count}`);
  const data = await res.json() as { urls?: string[]; error?: string };
  if (!res.ok) throw new Error(data.error ?? `Failed to fetch images for "${query}"`);
  if (!data.urls?.length) throw new Error(`No images found for "${query}" — try a different term`);
  return data.urls;
}

export function CreatePanel() {
  const { object1, object2, setObject1, setObject2, setGridFromObjects } = useSimulatorStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const canGenerate = object1.trim().length > 0 && object2.trim().length > 0;

  const handleGenerate = async () => {
    if (!canGenerate || loading) return;
    setLoading(true);
    setError(null);
    setGenerated(false);

    try {
      const [urls1, urls2] = await Promise.all([
        fetchImages(object1.trim(), 5),
        fetchImages(object2.trim(), 4),
      ]);

      const obj1Tiles: GridTile[] = urls1.map((url, i) => ({
        id: `gen-obj1-${i}`,
        imageUrl: url,
        label: object1.trim(),
        isTarget: true,
      }));

      const obj2Tiles: GridTile[] = urls2.map((url, i) => ({
        id: `gen-obj2-${i}`,
        imageUrl: url,
        label: object2.trim(),
        isTarget: false,
      }));

      setGridFromObjects(obj1Tiles, obj2Tiles, object1.trim(), urls1[0]);
      setGenerated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex-1 min-w-0 bg-white border-2 border-[#111] shadow-[4px_4px_0_#111] flex flex-col overflow-hidden"
      style={{ height: '510px' }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-[#111] bg-[#111] flex-shrink-0">
        <h2 className="text-xs font-bold text-[#F2C94C] uppercase tracking-wider">Create Challenge</h2>
        <p className="text-xs text-white/60 mt-0.5">
          Type two objects · AI fetches matching images
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col gap-5 p-5 overflow-y-auto">

        {/* Object 1 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#111]">
            Object 1 — Challenge target
          </label>
          <input
            type="text"
            value={object1}
            onChange={(e) => { setObject1(e.target.value); setGenerated(false); }}
            onKeyDown={(e) => e.key === 'Enter' && canGenerate && handleGenerate()}
            placeholder="e.g. Batman"
            className="w-full px-3 py-2.5 text-sm border-2 border-[#111] bg-[#FAFAF8] placeholder:text-[#bbb] focus:outline-none focus:border-[#F2C94C] focus:bg-white transition-colors"
          />
          <p className="text-[10px] text-[#999]">Shown in the challenge text and reference image · 5 tiles</p>
        </div>

        {/* Object 2 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#111]">
            Object 2 — Distractor
          </label>
          <input
            type="text"
            value={object2}
            onChange={(e) => { setObject2(e.target.value); setGenerated(false); }}
            onKeyDown={(e) => e.key === 'Enter' && canGenerate && handleGenerate()}
            placeholder="e.g. Bridges"
            className="w-full px-3 py-2.5 text-sm border-2 border-[#111] bg-[#FAFAF8] placeholder:text-[#bbb] focus:outline-none focus:border-[#F2C94C] focus:bg-white transition-colors"
          />
          <p className="text-[10px] text-[#999]">Images that should NOT be selected · 4 tiles</p>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#F2C94C] text-[#111] text-xs font-bold uppercase tracking-widest border-2 border-[#111] shadow-[3px_3px_0_#111] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-75 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-[#111]/30 border-t-[#111] rounded-full animate-spin" />
              Fetching images…
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Generate Grid
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <p role="alert" className="text-xs text-red-700 border-2 border-red-200 bg-red-50 px-3 py-2">
            {error}
          </p>
        )}

        {/* Success */}
        {generated && !loading && (
          <div className="text-xs text-[#111] border-2 border-[#111] bg-[#F2C94C]/20 px-3 py-2.5 flex items-start gap-2">
            <svg className="w-3.5 h-3.5 text-[#111] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>
              Grid populated with <span className="font-bold">{object1}</span> vs <span className="font-bold">{object2}</span>.
              Switch to <span className="font-bold">PREVIEW</span> to play.
            </span>
          </div>
        )}

        {/* Footer hint */}
        <div className="mt-auto pt-4 border-t border-[#e5e5e5]">
          <p className="text-[10px] text-[#bbb] leading-relaxed">
            Images from Unsplash. Requires{' '}
            <code className="bg-[#f0f0f0] text-[#888] px-1">UNSPLASH_ACCESS_KEY</code>{' '}
            environment variable.
          </p>
        </div>
      </div>
    </div>
  );
}

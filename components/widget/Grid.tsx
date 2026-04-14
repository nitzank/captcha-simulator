'use client';

import { useEffect } from 'react';
import { Tile } from './Tile';
import { useSimulatorStore } from '@/lib/store';

export function Grid() {
  const { verifyState, shuffleGrid } = useSimulatorStore();

  useEffect(() => {
    shuffleGrid();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-[2px] bg-[#e0e0e0]">
        {Array.from({ length: 9 }).map((_, i) => (
          <Tile key={i} index={i} />
        ))}
      </div>

      {/* Verify success overlay */}
      {verifyState === 'success' && (
        <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2 z-10">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-700 font-semibold text-sm">Verification Successful</p>
        </div>
      )}

      {verifyState === 'loading' && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-[3px] border-[#4A90D9] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {verifyState === 'error' && (
        <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2 z-10">
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold text-sm">Please try again</p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useSimulatorStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';

export function Footer() {
  const { selectedTiles, gridTiles, setVerifyState, verifyState, clearSelections } = useSimulatorStore();

  const handleVerify = () => {
    if (verifyState === 'success' || verifyState === 'error') {
      setVerifyState('idle');
      clearSelections();
      return;
    }

    setVerifyState('loading');
    setTimeout(() => {
      // Mock: check if selected tiles match target tiles
      const targetIndices = gridTiles
        .map((t, i) => (t.isTarget ? i : -1))
        .filter((i) => i !== -1);

      const correctSelections =
        selectedTiles.length === targetIndices.length &&
        selectedTiles.every((i) => targetIndices.includes(i));

      setVerifyState(correctSelections ? 'success' : 'error');

      if (!correctSelections) {
        setTimeout(() => {
          setVerifyState('idle');
          clearSelections();
        }, 1800);
      }
    }, 900);
  };

  const isVerifying = verifyState === 'loading';
  const isDone = verifyState === 'success' || verifyState === 'error';

  return (
    <div className="bg-[#f9f9f9] border-t border-[#e0e0e0] px-4 py-3 flex items-center justify-between rounded-b-sm">
      <div className="flex items-center gap-1">
        {/* Reload */}
        <button
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-black/5 text-[#777] transition-colors"
          title="Get a new challenge"
          onClick={() => { clearSelections(); setVerifyState('idle'); }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Audio */}
        <button
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-black/5 text-[#777] transition-colors"
          title="Get an audio challenge"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0-12l-3 3H6v6h3l3 3m6-7.5a7.5 7.5 0 00-6-7.35" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.07 4.93a10 10 0 010 14.14" />
          </svg>
        </button>

        {/* Info */}
        <button
          className="w-10 h-10 flex items-center justify-center rounded hover:bg-black/5 text-[#777] transition-colors"
          title="Help"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {selectedTiles.length === 0 && !isDone && (
          <span className="text-[11px] text-[#999] hidden sm:block">Select all matching images</span>
        )}
        {selectedTiles.length > 0 && !isDone && (
          <span className="text-[11px] text-[#4A90D9] font-medium hidden sm:block">
            {selectedTiles.length} selected
          </span>
        )}

        <Button
          onClick={handleVerify}
          disabled={isVerifying || (selectedTiles.length === 0 && !isDone)}
          className="text-sm px-6 py-2 uppercase tracking-wide font-semibold"
        >
          {isVerifying ? (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying
            </span>
          ) : isDone ? (
            'Try Again'
          ) : (
            'Verify'
          )}
        </Button>
      </div>
    </div>
  );
}

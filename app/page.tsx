'use client';

import { useRef, useState } from 'react';
import { useSimulatorStore } from '@/lib/store';
import { Toggle } from '@/components/ui/Toggle';
import { Header } from '@/components/widget/Header';
import { Grid } from '@/components/widget/Grid';
import { Footer } from '@/components/widget/Footer';
import { Uploader } from '@/components/edit-panel/Uploader';
import { ImagePool } from '@/components/edit-panel/ImagePool';
import { CreatePanel } from '@/components/create-panel/CreatePanel';
import type { AppMode } from '@/lib/store';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

export default function Home() {
  const { mode, setMode, imagePool, replaceGridTile, swapGridTiles, isEditOpen, setIsEditOpen } = useSimulatorStore();
  const widgetRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [showDragHint, setShowDragHint] = useState(false);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 8 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const dropId = String(over.id);
    const activeId = String(active.id);
    if (!dropId.startsWith('tile-drop-')) return;
    const toIndex = parseInt(dropId.replace('tile-drop-', ''), 10);
    if (activeId.startsWith('tile-drag-')) {
      const fromIndex = parseInt(activeId.replace('tile-drag-', ''), 10);
      if (fromIndex !== toIndex) swapGridTiles(fromIndex, toIndex);
    } else {
      const poolImage = imagePool.find((img) => img.id === activeId);
      if (poolImage) replaceGridTile(toIndex, poolImage);
    }
  };

  const handleDownload = async () => {
    if (!widgetRef.current) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      const { toJpeg } = await import('html-to-image');
      const dataUrl = await toJpeg(widgetRef.current, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'batman-captcha.jpg';
      link.href = dataUrl;
      link.click();
    } catch {
      setDownloadError('Export failed. Try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="min-h-screen flex flex-col">

        {/* ── TOP NAV ── */}
        <header className="bg-[#111] border-b-2 border-[#111] px-6 py-4 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-[28px] text-[#F2C94C] leading-none">
                CAPTCHA Frontier
              </h1>
              <p className="text-xs text-white/60 mt-1">
                {mode === 'default' ? 'Objects are solved. Concepts are the frontier.' : 'Build a custom challenge.'}
              </p>
            </div>
            <Toggle
              options={[
                { value: 'create',  label: 'CREATE' },
                { value: 'default', label: 'PREVIEW' },
              ]}
              value={mode}
              onChange={(v) => setMode(v as AppMode)}
            />
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 bg-[#EDE8DC] px-6 py-8">
          <div className="max-w-5xl mx-auto">

            <p className="text-sm text-[#555] mb-6 border-l-2 border-[#F2C94C] pl-3">
              {mode === 'default'
                ? 'AI identifies a fire hydrant in milliseconds. Can it identify vibe? Select the matching images and click Verify.'
                : 'Enter two concepts. Images are fetched for each. Try something abstract.'}
            </p>

            <div className="flex gap-6 items-start">

              {/* ── WIDGET ── */}
              <div className="flex-shrink-0 w-[450px] relative">
                {showDragHint && (
                  <div
                    className="absolute -top-14 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
                    aria-live="polite"
                  >
                    <div className="relative bg-[#111] text-white px-4 py-2.5 border-2 border-[#F2C94C] shadow-[3px_3px_0_#F2C94C] flex items-center gap-2 whitespace-nowrap">
                      <svg className="w-3.5 h-3.5 text-[#F2C94C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wider">Drag &amp; drop images to reposition</span>
                      {/* downward arrow */}
                      <span className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[#F2C94C]" />
                      <span className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#111]" />
                    </div>
                  </div>
                )}
                <div
                  ref={widgetRef}
                  className="border-2 border-[#111] shadow-[6px_6px_0_#111] overflow-hidden"
                >
                  <Header />
                  <Grid />
                  {mode === 'default' && <Footer />}
                </div>

                {/* reCAPTCHA branding */}
                <div className="mt-2 flex items-center justify-end gap-1.5 pr-1">
                  <span className="text-[10px] text-[#999]">Protected by</span>
                  <div className="flex items-center gap-0.5">
                    <svg className="w-3 h-3 text-[#4A90D9]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L4 6v6c0 5.25 3.4 10.16 8 11.38C16.6 22.16 20 17.25 20 12V6l-8-4z" />
                    </svg>
                    <span className="text-[10px] font-bold text-[#999]">reCAPTCHA</span>
                  </div>
                  <span className="text-[10px] text-[#ccc]">·</span>
                  <span className="text-[10px] text-[#999]">Privacy · Terms</span>
                </div>
              </div>

              {/* ── CREATE PANEL ── */}
              {mode === 'create' && <CreatePanel />}

              {/* ── ACTIONS + EDIT PANEL (preview mode only) ── */}
              {mode === 'default' && (
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#111] text-white text-xs font-bold uppercase tracking-widest border-2 border-[#111] shadow-[3px_3px_0_#F2C94C] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-75 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
                    >
                      {downloading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download JPG
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const opening = !isEditOpen;
                        setIsEditOpen(opening);
                        if (opening) {
                          setShowDragHint(true);
                          setTimeout(() => setShowDragHint(false), 3000);
                        }
                      }}
                      className={`flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest border-2 border-[#111] transition-all duration-75 ${
                        isEditOpen
                          ? 'bg-[#F2C94C] text-[#111] shadow-none'
                          : 'bg-white text-[#111] shadow-[3px_3px_0_#111] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]'
                      }`}
                      title={isEditOpen ? 'Close edit panel' : 'Edit images'}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                  </div>
                  {downloadError && (
                    <p role="alert" className="text-xs text-red-600">{downloadError}</p>
                  )}
                  {isEditOpen && (
                    <div className="bg-white border-2 border-[#111] shadow-[4px_4px_0_#111] flex flex-col overflow-hidden" style={{ height: '500px' }}>
                      <div className="px-4 py-3 border-b-2 border-[#111] bg-[#111] flex-shrink-0">
                        <h2 className="text-xs font-bold text-[#F2C94C] uppercase tracking-wider">Image Pool</h2>
                        <p className="text-xs text-white/60 mt-0.5">Upload images, select one, then click or drag to place it.</p>
                      </div>
                      <Uploader />
                      <ImagePool />
                    </div>
                  )}
                </div>
              )}


            </div>
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer className="bg-[#111] border-t-2 border-[#111] px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <span className="font-display text-[#F2C94C] text-xl tracking-wide">CAPTCHA Frontier</span>
            <a href="https://nitzanklamer.com" target="_blank" rel="noopener noreferrer" className="text-xs text-white/30 hover:text-white/60 transition-colors">© 2026 Nitzan Klamer</a>
          </div>
        </footer>

      </div>
    </DndContext>
  );
}

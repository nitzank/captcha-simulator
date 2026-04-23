'use client';

import { useSimulatorStore } from '@/lib/store';
import { parseBoldText } from '@/lib/utils';
import { useRef, useState } from 'react';

export function Header() {
  const { challengeText, referenceImageUrl, mode, setChallengeText, setReferenceImage } =
    useSimulatorStore();
  const [editingText, setEditingText] = useState(false);
  const [draft, setDraft] = useState(challengeText);
  const fileRef = useRef<HTMLInputElement>(null);

  const commitText = () => {
    setChallengeText(draft);
    setEditingText(false);
  };

  const handleRefImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReferenceImage(URL.createObjectURL(file));
    e.target.value = '';
  };

  return (
    <div className="bg-[#4A90D9] px-4 py-3.5 flex items-start justify-between gap-4 rounded-t-sm">
      <div className="flex-1 min-w-0">
        {editingText ? (
          <div className="flex flex-col gap-1.5">
            <input
              autoFocus
              className="w-full bg-white/20 text-white placeholder-white/50 rounded px-2.5 py-1 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-white/60"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitText}
              onKeyDown={(e) => e.key === 'Enter' && commitText()}
              placeholder="Challenge text, use **bold** for emphasis"
            />
            <p className="text-[10px] text-blue-200">
              Press Enter or click away to save. Wrap words in <strong>**double stars**</strong> for bold.
            </p>
          </div>
        ) : (
          <div className="group flex items-center gap-2 cursor-text" onClick={() => { setDraft(challengeText); setEditingText(true); }}>
            <p className="text-white text-xl font-semibold leading-snug">
              {parseBoldText(challengeText)}
            </p>
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-6 h-6 rounded bg-white/20 hover:bg-white/30 flex items-center justify-center"
              title="Edit challenge text"
              onClick={(e) => { e.stopPropagation(); setDraft(challengeText); setEditingText(true); }}
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 relative group">
        <div className="w-[78px] h-[78px] rounded-sm overflow-hidden border-2 border-white/40 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={referenceImageUrl}
            alt="Challenge reference"
            className="w-full h-full object-cover"
          />
        </div>
        {mode === 'create' && (
          <>
            <button
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm"
              onClick={() => fileRef.current?.click()}
              title="Replace reference image"
            >
              <span className="text-white text-[10px] font-medium text-center leading-tight">
                Change
              </span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleRefImageUpload} />
          </>
        )}
      </div>
    </div>
  );
}

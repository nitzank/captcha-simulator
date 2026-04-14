'use client';

import { useSimulatorStore } from '@/lib/store';
import { fileToBase64, generateId, validateImageFile } from '@/lib/utils';
import { useRef, useState } from 'react';

export function Uploader() {
  const { addToPool } = useSimulatorStore();
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newErrors: string[] = [];
    const validFiles = fileArray.filter((file) => {
      const { valid, error } = validateImageFile(file);
      if (!valid && error) newErrors.push(error);
      return valid;
    });

    if (newErrors.length) {
      setErrors(newErrors);
      setTimeout(() => setErrors([]), 4000);
    }

    if (!validFiles.length) return;

    setLoading(true);
    try {
      const images = await Promise.all(
        validFiles.map(async (file) => ({
          id: generateId(),
          imageUrl: await fileToBase64(file),
          name: file.name.replace(/\.[^.]+$/, ''),
        }))
      );
      addToPool(images);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  return (
    <div className="p-3 border-b-2 border-[#111]">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !loading && inputRef.current?.click()}
        className={`border-2 border-dashed p-5 text-center transition-colors duration-100 ${
          loading
            ? 'cursor-wait opacity-60 border-[#999] bg-white'
            : isDragging
            ? 'cursor-copy border-[#F2C94C] bg-[#F2C94C]/10'
            : 'cursor-pointer border-[#999] bg-white hover:border-[#111] hover:bg-[#F2C94C]/5'
        }`}
      >
        <div className="flex flex-col items-center gap-1.5">
          {loading ? (
            <span className="w-5 h-5 border-2 border-[#111]/30 border-t-[#111] rounded-full animate-spin" />
          ) : (
            <svg
              className={`w-6 h-6 ${isDragging ? 'text-[#111]' : 'text-[#999]'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          )}
          <p className="text-xs font-bold uppercase tracking-wider text-[#555]">
            {loading ? 'Processing…' : isDragging ? 'Drop to upload' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-[#999]">PNG · JPG · WEBP · Max 2MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => { if (e.target.files) processFiles(e.target.files); e.target.value = ''; }}
        />
      </div>

      {errors.length > 0 && (
        <div className="mt-2 border border-[#D63030] bg-[#D63030]/5 px-3 py-2">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-[#D63030] font-bold">{err}</p>
          ))}
        </div>
      )}
    </div>
  );
}

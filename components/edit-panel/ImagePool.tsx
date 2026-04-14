'use client';

import { useSimulatorStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

function PoolItem({ id, imageUrl, name }: { id: string; imageUrl: string; name: string }) {
  const { selectedPoolImageId, setSelectedPoolImage, removeFromPool } = useSimulatorStore();
  const isSelected = selectedPoolImageId === id;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style = transform
    ? { transform: CSS.Translate.toString(transform), zIndex: 50, opacity: isDragging ? 0.6 : 1 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group cursor-grab active:cursor-grabbing overflow-hidden border-2 transition-all duration-100 aspect-square',
        isSelected
          ? 'border-[#F2C94C] shadow-[3px_3px_0_#111]'
          : 'border-[#ccc] hover:border-[#111]'
      )}
      onClick={() => setSelectedPoolImage(isSelected ? null : id)}
      {...listeners}
      {...attributes}
      title={`${name} — click to select, drag to place`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt={name} className="w-full h-full object-cover" draggable={false} />

      {isSelected && (
        <div className="absolute inset-0 bg-[#F2C94C]/20 pointer-events-none">
          <div className="absolute top-1 right-1 w-4 h-4 bg-[#F2C94C] border border-[#111] flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      {/* Delete */}
      <button
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-[#111] text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-[#D63030]"
        onClick={(e) => { e.stopPropagation(); removeFromPool(id); }}
        title="Remove"
      >
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Name on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#111]/80 px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-[8px] font-bold uppercase tracking-wider truncate">{name}</p>
      </div>
    </div>
  );
}

export function ImagePool() {
  const { imagePool, selectedPoolImageId } = useSimulatorStore();

  return (
    <div className="flex-1 overflow-y-auto p-3">
      {imagePool.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full py-8 text-center">
          <div className="w-10 h-10 border-2 border-dashed border-[#ccc] flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-[#ccc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25v13.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V5.25z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-[#999]">No images yet</p>
          <p className="text-xs text-[#bbb] mt-1">Upload above to get started</p>
        </div>
      ) : (
        <>
          {selectedPoolImageId && (
            <div className="mb-2 bg-[#F2C94C]/20 border border-[#F2C94C] px-2 py-1.5">
              <p className="text-xs font-bold text-[#111]">
                Click a grid tile to place the selected image
              </p>
            </div>
          )}
          <div className="grid grid-cols-3 gap-1.5">
            {imagePool.map((img) => (
              <PoolItem key={img.id} {...img} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

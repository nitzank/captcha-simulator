'use client';

import { useSimulatorStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface TileProps {
  index: number;
}

export function Tile({ index }: TileProps) {
  const { mode, gridTiles, selectedTiles, selectedPoolImageId, toggleTileSelection, replaceGridTile, imagePool, isEditOpen } =
    useSimulatorStore();

  const tile = gridTiles[index];
  const isSelected = selectedTiles.includes(index);

  const { isOver, setNodeRef: setDropRef } = useDroppable({ id: `tile-drop-${index}` });

  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({
    id: `tile-drag-${index}`,
    disabled: !isEditOpen,
  });

  const setNodeRef = (el: HTMLElement | null) => {
    setDropRef(el);
    setDragRef(el);
  };

  const dragStyle = transform ? { transform: CSS.Translate.toString(transform), zIndex: 50, opacity: isDragging ? 0.5 : 1 } : undefined;

  const handleClick = () => {
    if (selectedPoolImageId) {
      const poolImage = imagePool.find((img) => img.id === selectedPoolImageId);
      if (poolImage) replaceGridTile(index, poolImage);
    } else if (mode === 'default') {
      toggleTileSelection(index);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-pressed={!selectedPoolImageId && mode === 'default' ? isSelected : undefined}
      aria-label={selectedPoolImageId ? `Place image at position ${index + 1}` : tile.label}
      title={selectedPoolImageId ? 'Click to place image here' : tile.label}
      className={cn(
        'relative aspect-square overflow-hidden select-none transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#4A90D9] focus-visible:outline-offset-[-2px]',
        isEditOpen ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
        mode === 'default' && isSelected && !isEditOpen && 'ring-[3px] ring-[#4A90D9] ring-inset',
        selectedPoolImageId && 'cursor-copy ring-2 ring-dashed ring-blue-400 ring-inset',
        isOver && !isDragging && 'ring-[3px] ring-[#F2C94C] ring-inset brightness-90'
      )}
      {...(isEditOpen ? listeners : {})}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.imageUrl}
        alt={tile.label}
        className={cn(
          'w-full h-full object-cover transition-transform duration-150',
          mode === 'default' && isSelected && 'scale-[0.94]'
        )}
        draggable={false}
      />

      {/* Selection overlay */}
      {mode === 'default' && isSelected && (
        <>
          <div className="absolute inset-0 bg-[#4A90D9]/10 pointer-events-none" />
          <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#4A90D9] flex items-center justify-center shadow-md pointer-events-none">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </>
      )}

      {/* Drop hint */}
      {isOver && !isDragging && (
        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center pointer-events-none">
          <span className="text-blue-700 font-bold text-2xl drop-shadow">+</span>
        </div>
      )}
    </div>
  );
}

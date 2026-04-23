'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getDefaultImage } from './defaults';

export type AppMode = 'default' | 'create';

export interface GridTile {
  id: string;
  imageUrl: string;
  label: string;
  isTarget: boolean;
}

export interface PoolImage {
  id: string;
  imageUrl: string;
  name: string;
}

interface SimulatorState {
  mode: AppMode;
  challengeText: string;
  referenceImageUrl: string;
  gridTiles: GridTile[];
  selectedTiles: number[];
  imagePool: PoolImage[];
  selectedPoolImageId: string | null;
  verifyState: 'idle' | 'loading' | 'success' | 'error';
  object1: string;
  object2: string;
  isGenerating: boolean;

  setMode: (mode: AppMode) => void;
  setChallengeText: (text: string) => void;
  setReferenceImage: (url: string) => void;
  toggleTileSelection: (index: number) => void;
  clearSelections: () => void;
  replaceGridTile: (index: number, image: PoolImage) => void;
  addToPool: (images: PoolImage[]) => void;
  removeFromPool: (id: string) => void;
  setSelectedPoolImage: (id: string | null) => void;
  setVerifyState: (state: 'idle' | 'loading' | 'success' | 'error') => void;
  resetGrid: () => void;
  shuffleGrid: () => void;
  isEditOpen: boolean;
  setIsEditOpen: (v: boolean) => void;
  swapGridTiles: (a: number, b: number) => void;
  setObject1: (v: string) => void;
  setObject2: (v: string) => void;
  setIsGenerating: (v: boolean) => void;
  setGridFromObjects: (obj1Tiles: GridTile[], obj2Tiles: GridTile[], obj1: string, refImageUrl: string) => void;
}

function shuffled(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TILE_META = [
  { id: 'tile-0', label: 'Batman on rooftop', isTarget: true },
  { id: 'tile-1', label: 'Forest path', isTarget: false },
  { id: 'tile-2', label: 'Batman in Gotham', isTarget: true },
  { id: 'tile-3', label: 'City skyline', isTarget: false },
  { id: 'tile-4', label: 'Batman symbol', isTarget: true },
  { id: 'tile-5', label: 'Mountain view', isTarget: false },
  { id: 'tile-6', label: 'Road at sunset', isTarget: false },
  { id: 'tile-7', label: 'Batman silhouette', isTarget: true },
  { id: 'tile-8', label: 'Coastal view', isTarget: false },
];

// Deterministic initial state — no Math.random() at module init, safe for SSR.
const DEFAULT_TILES: GridTile[] = TILE_META.map((meta, i) => ({
  ...meta,
  imageUrl: getDefaultImage(i),
}));

// Called client-side (in useEffect) to randomise image assignment after hydration.
function makeShuffledTiles(): GridTile[] {
  const indices = shuffled([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  return TILE_META.map((meta, i) => ({ ...meta, imageUrl: getDefaultImage(indices[i]) }));
}

const DEFAULT_REFERENCE = getDefaultImage(5);

export const useSimulatorStore = create<SimulatorState>()(
  persist(
    (set) => ({
      mode: 'default',
      challengeText: 'Select all images with **Batman**',
      referenceImageUrl: DEFAULT_REFERENCE,
      gridTiles: DEFAULT_TILES,
      selectedTiles: [],
      imagePool: [],
      selectedPoolImageId: null,
      verifyState: 'idle',
      object1: '',
      object2: '',
      isGenerating: false,
      isEditOpen: false,

      setMode: (mode) => set({ mode, selectedTiles: [], selectedPoolImageId: null }),

      setChallengeText: (challengeText) => set({ challengeText }),

      setReferenceImage: (url) => set({ referenceImageUrl: url }),

      toggleTileSelection: (index) =>
        set((state) => {
          const isSelected = state.selectedTiles.includes(index);
          return {
            selectedTiles: isSelected
              ? state.selectedTiles.filter((i) => i !== index)
              : [...state.selectedTiles, index],
          };
        }),

      clearSelections: () => set({ selectedTiles: [] }),

      replaceGridTile: (index, image) =>
        set((state) => {
          const tiles = [...state.gridTiles];
          tiles[index] = { ...tiles[index], imageUrl: image.imageUrl, label: image.name };
          return { gridTiles: tiles, selectedPoolImageId: null };
        }),

      addToPool: (images) =>
        set((state) => ({ imagePool: [...state.imagePool, ...images] })),

      removeFromPool: (id) =>
        set((state) => ({
          imagePool: state.imagePool.filter((img) => img.id !== id),
          selectedPoolImageId: state.selectedPoolImageId === id ? null : state.selectedPoolImageId,
        })),

      setSelectedPoolImage: (id) => set({ selectedPoolImageId: id }),

      setVerifyState: (verifyState) => set({ verifyState }),

      resetGrid: () => set({
        gridTiles: makeShuffledTiles(),
        selectedTiles: [],
        verifyState: 'idle',
      }),

      shuffleGrid: () => set({ gridTiles: makeShuffledTiles() }),

      setIsEditOpen: (isEditOpen) => set({ isEditOpen }),

      swapGridTiles: (a, b) =>
        set((state) => {
          const tiles = [...state.gridTiles];
          [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
          return { gridTiles: tiles };
        }),

      setObject1: (object1) => set({ object1 }),
      setObject2: (object2) => set({ object2 }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),

      setGridFromObjects: (obj1Tiles, obj2Tiles, obj1, refImageUrl) => {
        const combined = [...obj1Tiles, ...obj2Tiles];
        const order = shuffled(combined.map((_, i) => i));
        const gridTiles = order.map((src, dest) => ({ ...combined[src], id: `tile-${dest}` }));
        set({
          gridTiles,
          challengeText: `Select all images with **${obj1}**`,
          referenceImageUrl: refImageUrl,
          selectedTiles: [],
          verifyState: 'idle',
        });
      },
    }),
    {
      name: 'bot-detector-state',
      version: 5,
      migrate: () => undefined,
      partialize: (state) => ({
        challengeText: state.challengeText,
        referenceImageUrl: state.referenceImageUrl,
        imagePool: state.imagePool,
        object1: state.object1,
        object2: state.object2,
      }),
    }
  )
);

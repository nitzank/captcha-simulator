'use client';

import { cn } from '@/lib/utils';

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Toggle({ options, value, onChange, className }: ToggleProps) {
  return (
    <div
      role="radiogroup"
      className={cn('inline-flex border-2 border-[#F2C94C] overflow-hidden flex-shrink-0', className)}
    >
      {options.map((opt, i) => (
        <button
          key={opt.value}
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C94C] focus-visible:ring-inset',
            i > 0 && 'border-l-2 border-[#F2C94C]',
            value === opt.value
              ? 'bg-[#F2C94C] text-[#111]'
              : 'bg-transparent text-[#F2C94C] hover:bg-[#F2C94C]/20'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

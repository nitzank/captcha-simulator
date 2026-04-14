'use client';

import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelOff?: string;
  labelOn?: string;
  /** @deprecated use labelOff/labelOn */
  label?: string;
  className?: string;
}

export function Toggle({ checked, onChange, labelOff = 'OFF', labelOn = 'ON', className }: ToggleProps) {
  return (
    <div
      role="radiogroup"
      className={cn('inline-flex border-2 border-[#F2C94C] overflow-hidden flex-shrink-0', className)}
    >
      <button
        role="radio"
        aria-checked={!checked}
        onClick={() => onChange(false)}
        className={cn(
          'px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C94C] focus-visible:ring-inset',
          !checked ? 'bg-[#F2C94C] text-[#111]' : 'bg-transparent text-[#F2C94C] hover:bg-[#F2C94C]/20'
        )}
      >
        {labelOff}
      </button>
      <button
        role="radio"
        aria-checked={checked}
        onClick={() => onChange(true)}
        className={cn(
          'px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-100 border-l-2 border-[#F2C94C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C94C] focus-visible:ring-inset',
          checked ? 'bg-[#F2C94C] text-[#111]' : 'bg-transparent text-[#F2C94C] hover:bg-[#F2C94C]/20'
        )}
      >
        {labelOn}
      </button>
    </div>
  );
}

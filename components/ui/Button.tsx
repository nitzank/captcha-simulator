'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-75',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C94C] focus-visible:ring-offset-2',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0',
        variant === 'primary' && 'bg-[#111] text-white border-2 border-[#111] shadow-[3px_3px_0_#F2C94C] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]',
        variant === 'secondary' && 'bg-white text-[#111] border-2 border-[#111] shadow-[3px_3px_0_#111] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]',
        variant === 'ghost' && 'bg-transparent text-[#666] border border-[#ccc] hover:border-[#111] hover:text-[#111]',
        variant === 'danger' && 'bg-[#D63030] text-white border-2 border-[#111] shadow-[3px_3px_0_#111] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]',
        size === 'sm' && 'text-[10px] px-3 py-1.5 gap-1',
        size === 'md' && 'text-[11px] px-5 py-2.5 gap-2',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

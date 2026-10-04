/**
 * SearchInput Component
 * Debounced text input for table filtering with search icon and clear button.
 */

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

export function SearchInput({
  value: initialValue = '',
  onChange,
  placeholder = 'Search...',
  delay = 400,
  className
}) {
  const [text, setText] = useState(initialValue);
  const debouncedText = useDebounce(text, delay);

  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  useEffect(() => {
    onChange?.(debouncedText);
  }, [debouncedText, onChange]);

  const handleClear = () => {
    setText('');
    onChange?.('');
  };

  return (
    <div className={cn('relative w-full max-w-sm', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      <Input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="pl-9 pr-8 h-9 text-xs sm:text-sm bg-white border-slate-200"
      />
      {text && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Clear search</span>
        </button>
      )}
    </div>
  );
}

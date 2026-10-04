/**
 * PaginationBar Component
 * Renders page numbers, prev/next buttons, and results counter summary.
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function PaginationBar({
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
  className
}) {
  if (totalPages <= 1 && total === 0) return null;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 4;
    let startPage = Math.max(1, page - 1);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-3 py-3 px-4 border-t border-slate-100 text-xs text-slate-500 bg-white/50 rounded-b-xl', className)}>
      <div className="text-center sm:text-left">
        Showing <span className="font-semibold text-slate-800">{start}</span> to{' '}
        <span className="font-semibold text-slate-800">{end}</span> of{' '}
        <span className="font-semibold text-slate-800">{total}</span> results
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-8 px-2 text-xs border-slate-200"
        >
          <ChevronLeft className="h-3.5 w-3.5 mr-1" />
          Previous
        </Button>

        {getPageNumbers().map((p) => (
          <Button
            key={p}
            variant={p === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(p)}
            className={cn(
              'h-8 w-8 p-0 text-xs',
              p === page
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-700 border-slate-200'
            )}
          >
            {p}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-8 px-2 text-xs border-slate-200"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}

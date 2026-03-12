'use client';

// Libraries
import { cn } from '@/lib/utils';

// Icons
import { Icons } from '@/components/Icons';

// Components
import { Button } from '@/components/ui/button';

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export const Pagination = ({ page, pageCount, onPageChange, className }: PaginationProps) => {
  const totalPages = pageCount;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onPageChange?.(newPage);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  const handlePreviousPage = () => {
    handlePageChange(page - 1);
  };

  const handleNextPage = () => {
    handlePageChange(page + 1);
  };

  return (
    <div
      aria-label="Pagination"
      role="navigation"
      className={cn('flex items-center justify-center sm:justify-end gap-3 mt-8', className)}
    >
      <Button
        variant="ghost"
        onClick={handlePreviousPage}
        disabled={page === 1}
        aria-label="Go to previous page"
        className="group flex items-center gap-2 text-[15px] font-medium text-tx-primary hover:bg-transparent hover:text-tx-primary/80"
      >
        <Icons.ChevronBackward className="fill-tx-primary group-hover:fill-tx-primary/80" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((pageNum) => (
          <Button
            key={pageNum}
            variant={page === pageNum ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handlePageChange(pageNum)}
            aria-label={`Page ${pageNum}`}
            aria-current={page === pageNum ? 'page' : undefined}
            className={cn(
              'w-10 h-10 rounded-[10px] text-[15px] font-medium',
              page === pageNum ? 'bg-blue-50 text-white hover:bg-blue-60' : 'text-tx-primary',
            )}
          >
            {pageNum}
          </Button>
        ))}
      </div>

      <Button
        variant="ghost"
        onClick={handleNextPage}
        disabled={page === totalPages}
        aria-label="Go to next page"
        className="flex items-center gap-2 text-[15px] font-medium text-tx-primary hover:bg-transparent hover:text-tx-primary/80"
      >
        Next
        <Icons.ChevronForwardIcon className="fill-tx-primary group-hover:fill-tx-primary/80" />
      </Button>
    </div>
  );
};

export default Pagination;

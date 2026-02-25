'use client';

// Libraries
import { cn } from '@/lib/utils';

// Icons
import { ChevronBackwardIcon, ChevronForwardIcon } from '@/components/Icons';

// Components
import { Button } from '@/components/ui/button';

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
}

export const Pagination = ({ page, pageCount, onPageChange }: PaginationProps) => {
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
    <div className="flex items-center justify-end gap-3 mt-8">
      <Button
        variant="ghost"
        onClick={handlePreviousPage}
        disabled={page === 1}
        className="group flex items-center gap-2 text-[15px] font-medium text-tx-primary hover:bg-transparent hover:text-tx-primary/80"
      >
        <ChevronBackwardIcon className="fill-tx-primary group-hover:fill-tx-primary/80" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((pageNum) => (
          <Button
            key={pageNum}
            variant={page === pageNum ? 'default' : 'ghost'}
            size="icon"
            onClick={() => handlePageChange(pageNum)}
            className={cn(
              'w-10 h-10 rounded-[10px] text-[15px] font-medium',
              page === pageNum ? 'bg-primary text-white hover:bg-primary/90' : 'text-tx-primary',
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
        className="flex items-center gap-2 text-[15px] font-medium text-tx-primary hover:bg-transparent hover:text-tx-primary/80"
      >
        Next
        <ChevronForwardIcon className="fill-tx-primary group-hover:fill-tx-primary/80" />
      </Button>
    </div>
  );
};

export default Pagination;

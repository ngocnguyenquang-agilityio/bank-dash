// Libraries
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Component
import { Pagination } from './Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page numbers correctly', () => {
    render(<Pagination page={1} pageCount={5} onPageChange={mockOnPageChange} />);

    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
  });

  it('highlights the current page', () => {
    render(<Pagination page={3} pageCount={5} onPageChange={mockOnPageChange} />);

    const page3Button = screen.getByRole('button', { name: 'Page 3' });
    expect(page3Button).toHaveClass('bg-blue-50');
    expect(page3Button).toHaveAttribute('aria-current', 'page');
  });

  it('renders Previous and Next buttons', () => {
    render(<Pagination page={2} pageCount={5} onPageChange={mockOnPageChange} />);

    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('disables Previous button on first page', () => {
    render(<Pagination page={1} pageCount={5} onPageChange={mockOnPageChange} />);

    const previousButton = screen.getByRole('button', { name: /previous/i });
    expect(previousButton).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(<Pagination page={5} pageCount={5} onPageChange={mockOnPageChange} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange when clicking a page number', async () => {
    const user = userEvent.setup();
    render(<Pagination page={1} pageCount={5} onPageChange={mockOnPageChange} />);

    const page3Button = screen.getByRole('button', { name: 'Page 3' });
    await user.click(page3Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when clicking Next button', async () => {
    const user = userEvent.setup();
    render(<Pagination page={2} pageCount={5} onPageChange={mockOnPageChange} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when clicking Previous button', async () => {
    const user = userEvent.setup();
    render(<Pagination page={3} pageCount={5} onPageChange={mockOnPageChange} />);

    const previousButton = screen.getByRole('button', { name: /previous/i });
    await user.click(previousButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('does not call onPageChange when clicking current page', async () => {
    const user = userEvent.setup();
    render(<Pagination page={3} pageCount={5} onPageChange={mockOnPageChange} />);

    const page3Button = screen.getByRole('button', { name: 'Page 3' });
    await user.click(page3Button);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('does not render when pageCount is 1', () => {
    const { container } = render(
      <Pagination page={1} pageCount={1} onPageChange={mockOnPageChange} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders correctly with 2 pages', () => {
    render(<Pagination page={1} pageCount={2} onPageChange={mockOnPageChange} />);

    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
  });

  it('renders all page numbers for 10 pages', () => {
    render(<Pagination page={1} pageCount={10} onPageChange={mockOnPageChange} />);

    for (let i = 1; i <= 10; i++) {
      expect(screen.getByRole('button', { name: `Page ${i}` })).toBeInTheDocument();
    }
  });

  it('Previous button is enabled on middle pages', () => {
    render(<Pagination page={3} pageCount={5} onPageChange={mockOnPageChange} />);

    const previousButton = screen.getByRole('button', { name: /previous/i });
    expect(previousButton).not.toBeDisabled();
  });

  it('Next button is enabled on middle pages', () => {
    render(<Pagination page={3} pageCount={5} onPageChange={mockOnPageChange} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).not.toBeDisabled();
  });

  it('does not call onPageChange when Previous is disabled and clicked', async () => {
    const user = userEvent.setup();
    render(<Pagination page={1} pageCount={5} onPageChange={mockOnPageChange} />);

    const previousButton = screen.getByRole('button', { name: /previous/i });
    await user.click(previousButton);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('does not call onPageChange when Next is disabled and clicked', async () => {
    const user = userEvent.setup();
    render(<Pagination page={5} pageCount={5} onPageChange={mockOnPageChange} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('wraps pagination in a nav landmark', () => {
    render(<Pagination page={1} pageCount={5} onPageChange={mockOnPageChange} />);

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });
});

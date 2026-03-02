// Libraries
import { render, screen } from '@testing-library/react';

// Components
import { CardListItem } from './CardListItem';

const mockGet = jest.fn();
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

describe('CardListItem', () => {
  const props = {
    id: '1',
    isPhysical: true,
    cardNumber: '1234567890125600',
    nameOnCard: 'William',
    address: '123 Main St, New York',
  };

  beforeEach(() => {
    mockGet.mockReturnValue(null);
  });

  it('renders all card information', () => {
    render(<CardListItem {...props} />);

    expect(screen.getByText('Card Type')).toBeInTheDocument();
    expect(screen.getByText('Physical')).toBeInTheDocument();

    expect(screen.getByText('Card Address')).toBeInTheDocument();
    expect(screen.getByText('123 Main St, New York')).toBeInTheDocument();

    expect(screen.getByText('Card Number')).toBeInTheDocument();
    // Default masking is last4: "**** **** **** 5600"
    expect(screen.getByText('**** **** **** 5600')).toBeInTheDocument();

    expect(screen.getByText('Name on Card')).toBeInTheDocument();
    // Name appears in both mobile and desktop layouts
    expect(screen.getAllByText(props.nameOnCard).length).toBeGreaterThanOrEqual(1);
  });

  it('renders correct styling based on isPhysical', () => {
    const { container, rerender } = render(<CardListItem {...props} isPhysical={true} />);

    // The icon container is inside the wrapper div
    const iconDiv = container.querySelector('[class*="bg-blue-10"]');
    expect(iconDiv).toBeInTheDocument();

    rerender(<CardListItem {...props} isPhysical={false} />);

    const redIconDiv = container.querySelector('[class*="bg-red-30"]');
    expect(redIconDiv).toBeInTheDocument();
  });

  it('renders View Details link', () => {
    render(<CardListItem {...props} />);

    const viewDetailsLinks = screen.getAllByRole('link', { name: /view details/i });
    expect(viewDetailsLinks.length).toBeGreaterThanOrEqual(1);
    expect(viewDetailsLinks[0]).toHaveAttribute('href', '/cards/1');
  });

  it('View Details link has correct href', () => {
    render(<CardListItem {...props} />);

    const viewDetailsLinks = screen.getAllByRole('link', { name: /view details/i });
    expect(viewDetailsLinks[0]).toHaveAttribute('href', '/cards/1');
  });

  it('View Details link includes page param when page > 1', () => {
    mockGet.mockReturnValue('2');
    render(<CardListItem {...props} />);

    const viewDetailsLinks = screen.getAllByRole('link', { name: /view details/i });
    expect(viewDetailsLinks[0]).toHaveAttribute('href', '/cards/1?page=2');
  });

  it('View Details link has no page param when page is 1', () => {
    mockGet.mockReturnValue('1');
    render(<CardListItem {...props} />);

    const viewDetailsLinks = screen.getAllByRole('link', { name: /view details/i });
    expect(viewDetailsLinks[0]).toHaveAttribute('href', '/cards/1');
  });

  it('renders credit card icon', () => {
    const { container } = render(<CardListItem {...props} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

// Libraries
import { render, screen } from '@testing-library/react';

// Components
import { CardListItem } from './CardListItem';

describe('CardListItem', () => {
  const props = {
    id: '1',
    isPhysical: true,
    cardNumber: '1234567890125600',
    nameOnCard: 'William',
  };

  it('renders all card information', () => {
    render(<CardListItem {...props} />);

    expect(screen.getByText('Card Type')).toBeInTheDocument();
    expect(screen.getByText('Physical')).toBeInTheDocument();

    expect(screen.getByText('Card Number')).toBeInTheDocument();
    // Default masking is last4: "**** **** **** 5600"
    expect(screen.getByText('**** **** **** 5600')).toBeInTheDocument();

    expect(screen.getByText('Name on Card')).toBeInTheDocument();
    expect(screen.getByText(props.nameOnCard)).toBeInTheDocument();
  });

  it('renders correct styling based on isPhysical', () => {
    const { container, rerender } = render(<CardListItem {...props} isPhysical={true} />);

    // isPhysical=true -> Blue
    expect(container.firstChild?.firstChild).toHaveClass('bg-blue-10');

    rerender(<CardListItem {...props} isPhysical={false} />);

    // isPhysical=false -> Red
    expect(container.firstChild?.firstChild).toHaveClass('bg-red-30');
  });

  it('renders View Details link', () => {
    render(<CardListItem {...props} />);

    const viewDetailsLink = screen.getByRole('link', { name: /view details/i });
    expect(viewDetailsLink).toBeInTheDocument();
    expect(viewDetailsLink).toHaveAttribute('href', '/cards/1');
  });

  it('View Details link has correct href', () => {
    render(<CardListItem {...props} />);

    const viewDetailsLink = screen.getByRole('link', { name: /view details/i });
    expect(viewDetailsLink).toHaveAttribute('href', '/cards/1');
  });

  it('renders credit card icon', () => {
    const { container } = render(<CardListItem {...props} />);

    // lucide-react CreditCard component renders an svg
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

// Libraries
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Components
import { CardListItem } from './CardListItem';

describe('CardListItem', () => {
  const props = {
    isPhysical: true,
    bank: 'DBL Bank',
    cardNumber: '1234567890125600',
    nameOnCard: 'William',
    gradientColor: 'blue' as const,
  };

  it('renders all card information', () => {
    render(<CardListItem {...props} />);

    expect(screen.getByText('Card Type')).toBeInTheDocument();
    expect(screen.getByText('Physical')).toBeInTheDocument();

    expect(screen.getByText('Bank')).toBeInTheDocument();
    expect(screen.getByText(props.bank)).toBeInTheDocument();

    expect(screen.getByText('Card Number')).toBeInTheDocument();
    // Default masking is last4: "**** **** **** 5600"
    expect(screen.getByText('**** **** **** 5600')).toBeInTheDocument();

    expect(screen.getByText('Name on Card')).toBeInTheDocument();
    expect(screen.getByText(props.nameOnCard)).toBeInTheDocument();
  });

  it('renders View Details button', () => {
    render(<CardListItem {...props} />);

    const viewDetailsButton = screen.getByRole('button', { name: /view details/i });
    expect(viewDetailsButton).toBeInTheDocument();
  });

  it('renders with blue gradient color by default', () => {
    const { container } = render(<CardListItem {...props} />);

    const iconContainer = container.querySelector('.bg-\\[\\#E7EDFF\\]');
    expect(iconContainer).toBeInTheDocument();
  });

  it('renders with pink gradient color', () => {
    const { container } = render(<CardListItem {...props} gradientColor="pink" />);

    const iconContainer = container.querySelector('.bg-\\[\\#FFE0EB\\]');
    expect(iconContainer).toBeInTheDocument();
  });

  it('renders with yellow gradient color', () => {
    const { container } = render(<CardListItem {...props} gradientColor="yellow" />);

    const iconContainer = container.querySelector('.bg-\\[\\#FFF5D9\\]');
    expect(iconContainer).toBeInTheDocument();
  });

  it('View Details button is interactive', async () => {
    const user = userEvent.setup();
    render(<CardListItem {...props} />);

    const viewDetailsButton = screen.getByRole('button', { name: /view details/i });
    await user.click(viewDetailsButton);

    // Button should still be in document after click (no default behavior)
    expect(viewDetailsButton).toBeInTheDocument();
  });

  it('renders credit card icon', () => {
    const { container } = render(<CardListItem {...props} />);

    // lucide-react CreditCard component renders an svg
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

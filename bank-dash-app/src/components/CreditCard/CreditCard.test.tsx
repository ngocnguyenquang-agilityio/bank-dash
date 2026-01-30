// Libraries
import { render, screen } from '@testing-library/react';

// Components
import { CreditCard } from './CreditCard';

describe('CreditCard', () => {
  const props = {
    balance: '$5,756',
    cardHolder: 'Eddy Cusuma',
    cardNumber: '3778123456781234',
    expiration: '2022-12-01',
  };

  it('renders balance, holder, number and expiration', () => {
    render(<CreditCard {...props} />);

    expect(screen.getByText('Balance')).toBeInTheDocument();
    expect(screen.getByText(props.balance)).toBeInTheDocument();
    expect(screen.getByText('Card Holder')).toBeInTheDocument();
    expect(screen.getByText(props.cardHolder)).toBeInTheDocument();
    expect(screen.getByText('Expiration')).toBeInTheDocument();
    expect(screen.getByText('12/22')).toBeInTheDocument();

    expect(screen.getByText('3778 **** **** 1234')).toBeInTheDocument();
  });

  it('supports custom className for container adjustments', () => {
    render(<CreditCard {...props} className="ring-1" />);
    const balanceEl = screen.getByText(props.balance);
    expect(balanceEl).toBeInTheDocument();
  });
});

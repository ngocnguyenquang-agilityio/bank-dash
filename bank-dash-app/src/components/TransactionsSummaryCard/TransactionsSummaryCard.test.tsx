// Libraries
import { render, screen } from '@testing-library/react';

// Components
import { TransactionsSummaryCard } from './TransactionsSummaryCard';

describe('TransactionsSummaryCard', () => {
  it('renders the label and value', () => {
    render(
      <TransactionsSummaryCard
        icon={<span>icon</span>}
        iconBg="#FFF5D9"
        label="My Balance"
        value="$12,750"
      />,
    );

    expect(screen.getByText('My Balance')).toBeInTheDocument();
    expect(screen.getByText('$12,750')).toBeInTheDocument();
  });

  it('renders the icon', () => {
    render(
      <TransactionsSummaryCard
        icon={<span data-testid="card-icon">icon</span>}
        iconBg="#E7EDFF"
        label="Income"
        value="$5,600"
      />,
    );

    expect(screen.getByTestId('card-icon')).toBeInTheDocument();
  });

  it('applies the iconBg color as background style', () => {
    const { container } = render(
      <TransactionsSummaryCard
        icon={<span>icon</span>}
        iconBg="#FFE0EB"
        label="Expense"
        value="$3,460"
      />,
    );

    const iconWrapper = container.querySelector('[style*="background-color"]');
    expect(iconWrapper).toHaveStyle({ backgroundColor: '#FFE0EB' });
  });

  it('renders different label and value combinations', () => {
    const { rerender } = render(
      <TransactionsSummaryCard
        icon={<span>icon</span>}
        iconBg="#DCFAF8"
        label="Total Saving"
        value="$7,920"
      />,
    );

    expect(screen.getByText('Total Saving')).toBeInTheDocument();
    expect(screen.getByText('$7,920')).toBeInTheDocument();

    rerender(
      <TransactionsSummaryCard
        icon={<span>icon</span>}
        iconBg="#FFF5D9"
        label="My Balance"
        value="$0"
      />,
    );

    expect(screen.getByText('My Balance')).toBeInTheDocument();
    expect(screen.getByText('$0')).toBeInTheDocument();
  });
});

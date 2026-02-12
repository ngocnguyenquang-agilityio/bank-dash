import { render, screen } from '@testing-library/react';
import { Icons } from '../Icons/Icons';
import { FeatureCard } from './FeatureCard';

describe('FeatureCard', () => {
  it('renders correctly with given props', () => {
    render(
      <FeatureCard
        icon={<Icons.CreditCard data-testid="icon" />}
        title="Test Title"
        description="Test Description"
      />,
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getAllByTestId('icon').length).toBeGreaterThan(0);
  });
});

import { render } from '@testing-library/react';
import DashboardLoading from './loading';

describe('DashboardLoading', () => {
  it('renders skeleton loading state', () => {
    const { container } = render(<DashboardLoading />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});

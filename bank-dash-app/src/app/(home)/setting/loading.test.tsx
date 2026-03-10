import { render } from '@testing-library/react';
import SettingLoading from './loading';

describe('SettingLoading', () => {
  it('renders skeleton loading state', () => {
    const { container } = render(<SettingLoading />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});

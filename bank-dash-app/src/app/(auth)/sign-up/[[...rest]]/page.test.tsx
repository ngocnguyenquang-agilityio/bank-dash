import { render } from '@testing-library/react';
import SignUpPage from './page';

jest.mock('@/components/auth/SignUpPage/SignUpPageWrapper', () => ({
  SignUpPageWrapper: () => <div data-testid="sign-up-wrapper">SignUpPageWrapper</div>,
}));

describe('SignUpPage', () => {
  it('renders SignUpPageWrapper', () => {
    const { getByTestId } = render(<SignUpPage />);
    expect(getByTestId('sign-up-wrapper')).toBeInTheDocument();
  });
});

import { render } from '@testing-library/react';
import SignInPage from './page';

jest.mock('@/components/auth/SignInPage/SignInPageWrapper', () => ({
  SignInPageWrapper: () => <div data-testid="sign-in-wrapper">SignInPageWrapper</div>,
}));

describe('SignInPage', () => {
  it('renders SignInPageWrapper', () => {
    const { getByTestId } = render(<SignInPage />);
    expect(getByTestId('sign-in-wrapper')).toBeInTheDocument();
  });
});

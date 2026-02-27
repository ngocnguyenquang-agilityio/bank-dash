import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AvatarProfile } from '.';

const mockPush = jest.fn();
const mockSignOut = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@clerk/nextjs', () => ({
  useClerk: () => ({
    signOut: mockSignOut,
  }),
}));

const defaultProps = {
  imageUrl: 'https://example.com/avatar.jpg',
  fallback: 'EC',
  alt: 'Eddy Cusuma',
};

describe('AvatarProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the avatar button', () => {
    render(<AvatarProfile {...defaultProps} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders the avatar image when imageUrl is provided', () => {
    render(<AvatarProfile {...defaultProps} />);

    expect(screen.getByAltText('Eddy Cusuma')).toBeInTheDocument();
  });

  it('renders the fallback text when no imageUrl is provided', () => {
    render(<AvatarProfile {...defaultProps} imageUrl="" />);

    expect(screen.getByText('EC')).toBeInTheDocument();
  });

  it('opens dropdown menu on click', async () => {
    const user = userEvent.setup();
    render(<AvatarProfile {...defaultProps} />);

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Setting')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('navigates to settings when Setting is clicked', async () => {
    const user = userEvent.setup();
    render(<AvatarProfile {...defaultProps} />);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Setting'));

    expect(mockPush).toHaveBeenCalledWith('/setting');
  });

  it('calls signOut when Logout is clicked', async () => {
    const user = userEvent.setup();
    render(<AvatarProfile {...defaultProps} />);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Logout'));

    expect(mockSignOut).toHaveBeenCalledWith({ redirectUrl: '/' });
  });
});

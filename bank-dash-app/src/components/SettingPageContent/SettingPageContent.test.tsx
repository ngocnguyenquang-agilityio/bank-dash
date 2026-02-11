// Libraries
import { render, screen } from '@testing-library/react';

// Components
import { SettingPageContent } from './SettingPageContent';

// Types
import { Member } from '@/types/member';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock(
  'next/image',
  () =>
    function MockImage(props: { src: string; alt: string; width?: number; height?: number }) {
      return <div data-testid="next-image-mock" aria-label={props.alt} />;
    },
);

jest.mock('@/components/Icons/Icons', () => ({
  Icons: {
    Pencil: () => <svg data-testid="pencil-icon" />,
  },
}));

jest.mock('@/services/members', () => ({
  updateMember: jest.fn(),
}));

// Mock ResizeObserver for Radix UI
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('SettingPageContent', () => {
  it('renders Edit Profile tab and form fields', () => {
    render(<SettingPageContent />);

    // Tabs
    expect(screen.getByRole('tab', { name: /edit profile/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /preferences/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /security/i })).toBeInTheDocument();

    // Form labels
    expect(screen.getByText('Your Name')).toBeInTheDocument();
    expect(screen.getByText('User Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByText('Present Address')).toBeInTheDocument();
    expect(screen.getByText('Permanent Address')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('Postal Code')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();

    // Save button
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('renders profile picture edit button', () => {
    render(<SettingPageContent />);

    expect(screen.getByLabelText(/edit profile picture/i)).toBeInTheDocument();
    expect(screen.getByTestId('pencil-icon')).toBeInTheDocument();
  });

  it('populates form with initial data', () => {
    const mockMember: Member = {
      id: 1,
      documentId: 'doc123',
      clerkId: 'clerk123',
      name: 'John Doe',
      userName: 'johndoe',
      email: 'john@example.com',
      dob: '1990-01-01',
      presentAddress: '123 Main St',
      permanentAddress: '456 Oak St',
      city: 'New York',
      postalCode: '10001',
      country: 'USA',
    };

    render(<SettingPageContent initialData={mockMember} />);

    expect(screen.getByRole('textbox', { name: /your name/i })).toHaveValue('John Doe');
    expect(screen.getByRole('textbox', { name: /user name/i })).toHaveValue('johndoe');
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('john@example.com');
  });
});

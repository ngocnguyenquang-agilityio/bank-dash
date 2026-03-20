// Libraries
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Components
import { SettingPageContent } from './SettingPageContent';
import { useMemberStore } from '@/stores/member';

// Services
import { updateMember } from '@/services/members';

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
  uploadAvatar: jest.fn(),
}));

// Mock ResizeObserver for Radix UI
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

beforeEach(() => {
  useMemberStore.setState({
    member: null,
    memberName: 'User',
    memberInitials: 'U',
    memberImageUrl: '',
    updateMemberData: jest.fn(),
    hydrate: jest.fn(),
  });

  URL.createObjectURL = jest.fn(() => 'blob:http://localhost/fake-preview');
  URL.revokeObjectURL = jest.fn();
});

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

  it('shows preview image after selecting a file', () => {
    render(<SettingPageContent />);

    const fileInput = screen.getByLabelText(/upload profile picture/i);
    const file = new File(['(binary)'], 'avatar.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(screen.getByLabelText('Profile preview')).toBeInTheDocument();
  });

  it('renders avatar preview inside a circular container', () => {
    render(<SettingPageContent />);

    const fileInput = screen.getByLabelText(/upload profile picture/i);
    const file = new File(['(binary)'], 'avatar.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    const previewImage = screen.getByLabelText('Profile preview');
    const circleContainer = previewImage.parentElement;
    expect(circleContainer).toHaveClass('rounded-full', 'overflow-hidden', 'relative');
  });

  it('file input accepts correct image types', () => {
    render(<SettingPageContent />);

    const fileInput = screen.getByLabelText(/upload profile picture/i);
    expect(fileInput).toHaveAttribute('accept', 'image/jpeg,image/png,image/webp');
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

    useMemberStore.setState({
      member: mockMember,
      memberName: 'John Doe',
      memberInitials: 'JD',
      memberImageUrl: '',
      updateMemberData: jest.fn(),
      hydrate: jest.fn(),
    });

    render(<SettingPageContent initialData={mockMember} />);

    expect(screen.getByRole('textbox', { name: /your name/i })).toHaveValue('John Doe');
    expect(screen.getByRole('textbox', { name: /user name/i })).toHaveValue('johndoe');
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('john@example.com');
  });

  it('calls updateMemberData with populated photo after successful save', async () => {
    const mockUpdateMemberData = jest.fn();

    const mockMember: Member = {
      id: 1,
      documentId: 'doc123',
      clerkId: 'clerk123',
      name: 'John Doe',
      userName: 'johndoe',
      email: 'john@example.com',
      photo: {
        id: 10,
        documentId: 'photo-old',
        url: '/uploads/old-avatar.jpg',
      },
    };

    useMemberStore.setState({
      member: mockMember,
      memberName: 'John Doe',
      memberInitials: 'JD',
      memberImageUrl: 'http://localhost:1337/uploads/old-avatar.jpg',
      updateMemberData: mockUpdateMemberData,
      hydrate: jest.fn(),
    });

    const updatedMemberFromApi = {
      ...mockMember,
      name: 'Jane Doe',
      photo: {
        id: 20,
        documentId: 'photo-new',
        url: '/uploads/new-avatar.jpg',
      },
    };

    jest.mocked(updateMember).mockResolvedValue({
      success: true,
      member: updatedMemberFromApi,
      error: null,
    });

    render(<SettingPageContent initialData={mockMember} />);

    // Change the name field to make the form dirty
    const nameInput = screen.getByRole('textbox', { name: /your name/i });
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

    // Submit the form
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await screen.findByRole('button', { name: /save/i });

    // Verify updateMemberData was called with the full member including populated photo
    await waitFor(() => {
      expect(mockUpdateMemberData).toHaveBeenCalledWith(
        expect.objectContaining({
          photo: expect.objectContaining({
            id: 20,
            url: '/uploads/new-avatar.jpg',
          }),
        }),
      );
    });
  });
});

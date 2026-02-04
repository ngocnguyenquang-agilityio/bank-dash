import { render, screen } from '@testing-library/react';
import { UnsavedChangesModal } from './UnsavedChangesModal';
import userEvent from '@testing-library/user-event';

describe('UnsavedChangesModal', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<UnsavedChangesModal {...defaultProps} />);
    expect(screen.getByText('Unsaved Changes')).toBeInTheDocument();
    expect(screen.getByText(/You have unsaved changes/i)).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    render(<UnsavedChangesModal {...defaultProps} />);
    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('calls onConfirm when Confirm button is clicked', async () => {
    render(<UnsavedChangesModal {...defaultProps} />);
    const confirmButton = screen.getByText('Confirm');
    await userEvent.click(confirmButton);
    expect(mockOnConfirm).toHaveBeenCalled();
  });
});

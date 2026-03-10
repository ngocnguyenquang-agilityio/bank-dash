import { renderHook, act } from '@testing-library/react';
import { useUnsavedChanges } from './useUnsavedChanges';

describe('useUnsavedChanges', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with showUnsavedChanges as false', () => {
    const { result } = renderHook(() =>
      useUnsavedChanges({
        isDirty: false,
        onOpenChange: mockOnOpenChange,
        onReset: mockOnReset,
      }),
    );

    expect(result.current.showUnsavedChanges).toBe(false);
  });

  describe('handleOpenChange', () => {
    it('shows unsaved changes dialog when closing with dirty form', () => {
      const { result } = renderHook(() =>
        useUnsavedChanges({
          isDirty: true,
          onOpenChange: mockOnOpenChange,
          onReset: mockOnReset,
        }),
      );

      act(() => {
        result.current.handleOpenChange(false);
      });

      expect(result.current.showUnsavedChanges).toBe(true);
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('resets and closes when closing with clean form', () => {
      const { result } = renderHook(() =>
        useUnsavedChanges({
          isDirty: false,
          onOpenChange: mockOnOpenChange,
          onReset: mockOnReset,
        }),
      );

      act(() => {
        result.current.handleOpenChange(false);
      });

      expect(result.current.showUnsavedChanges).toBe(false);
      expect(mockOnReset).toHaveBeenCalled();
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('opens normally when isOpen is true', () => {
      const { result } = renderHook(() =>
        useUnsavedChanges({
          isDirty: true,
          onOpenChange: mockOnOpenChange,
          onReset: mockOnReset,
        }),
      );

      act(() => {
        result.current.handleOpenChange(true);
      });

      expect(mockOnOpenChange).toHaveBeenCalledWith(true);
      expect(mockOnReset).not.toHaveBeenCalled();
    });
  });

  describe('handleConfirmClose', () => {
    it('resets form and hides dialog', () => {
      const { result } = renderHook(() =>
        useUnsavedChanges({
          isDirty: true,
          onOpenChange: mockOnOpenChange,
          onReset: mockOnReset,
        }),
      );

      // First trigger the dialog
      act(() => {
        result.current.handleOpenChange(false);
      });
      expect(result.current.showUnsavedChanges).toBe(true);

      // Confirm close
      act(() => {
        result.current.handleConfirmClose();
      });

      expect(result.current.showUnsavedChanges).toBe(false);
      expect(mockOnReset).toHaveBeenCalled();
    });
  });

  describe('handleCancelClose', () => {
    it('hides dialog and reopens the form', () => {
      const { result } = renderHook(() =>
        useUnsavedChanges({
          isDirty: true,
          onOpenChange: mockOnOpenChange,
          onReset: mockOnReset,
        }),
      );

      // First trigger the dialog
      act(() => {
        result.current.handleOpenChange(false);
      });

      mockOnOpenChange.mockClear();

      // Cancel close
      act(() => {
        result.current.handleCancelClose();
      });

      expect(result.current.showUnsavedChanges).toBe(false);
      expect(mockOnOpenChange).toHaveBeenCalledWith(true);
    });
  });
});

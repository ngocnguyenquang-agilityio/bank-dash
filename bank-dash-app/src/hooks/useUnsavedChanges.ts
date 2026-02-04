import { useState } from 'react';

interface UseUnsavedChangesProps {
  isDirty: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
}

export const useUnsavedChanges = ({ isDirty, onOpenChange, onReset }: UseUnsavedChangesProps) => {
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && isDirty) {
      onOpenChange(false);
      setShowUnsavedChanges(true);
      return;
    }

    if (!isOpen) {
      onReset();
    }
    onOpenChange(isOpen);
  };

  const handleConfirmClose = () => {
    onReset();
    setShowUnsavedChanges(false);
  };

  const handleCancelClose = () => {
    setShowUnsavedChanges(false);
    onOpenChange(true);
  };

  return {
    showUnsavedChanges,
    setShowUnsavedChanges,
    handleOpenChange,
    handleConfirmClose,
    handleCancelClose,
  };
};

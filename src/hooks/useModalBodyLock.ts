import { useEffect } from 'react';

export const useModalBodyLock = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      // Add overflow-hidden to body when modal opens
      document.body.style.overflow = 'hidden';
    } else {
      // Remove overflow-hidden from body when modal closes
      document.body.style.overflow = '';
    }

    // Cleanup function to ensure overflow is restored when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
};

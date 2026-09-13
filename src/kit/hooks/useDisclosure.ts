/**
 * Boolean open/closed state for dialogs, menus and drawers.
 *
 * Saves the three-line `useState` + two handlers that otherwise appears at the
 * top of every component that owns a dialog.
 */
import { useCallback, useState } from 'react';

export function useDisclosure(initial = false) {
  const [open, setOpen] = useState(initial);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen((value) => !value), []);

  return { open, onOpen, onClose, onToggle, setOpen };
}

/**
 * Toasts: short, self-dismissing confirmations and errors.
 *
 * Mount `ToastProvider` once, inside `AppTheme`, and call `useToast()` from
 * anywhere below it:
 *
 *   const toast = useToast();
 *   toast.success('Settings saved');
 *   toast.error('Save failed — check the connection', { action: { label: 'Retry', onClick: save } });
 *
 * A toast is for news the user does not have to act on. Anything that needs
 * an answer is a `ConfirmDialog`; anything that stays true (offline, demo
 * mode) belongs in the status bar, not a toast that disappears.
 *
 * On phones the toast sits above the bottom navigation bar instead of over it.
 */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  EMPTY_TOAST_QUEUE,
  advanceToast,
  enqueueToast,
  makeToast,
  type ToastOptions,
} from './toastQueue';

type ShortcutOptions = Omit<ToastOptions, 'severity'>;

export interface ToastApi {
  /** Show a toast. Severity defaults to `info`. */
  show: (message: ReactNode, options?: ToastOptions) => void;
  success: (message: ReactNode, options?: ShortcutOptions) => void;
  info: (message: ReactNode, options?: ShortcutOptions) => void;
  warning: (message: ReactNode, options?: ShortcutOptions) => void;
  error: (message: ReactNode, options?: ShortcutOptions) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  /**
   * Distance from the bottom on phones, in px, so the toast clears the
   * bottom navigation bar. 0 for an app without one.
   */
  mobileBottomOffset?: number;
}

export function ToastProvider({ children, mobileBottomOffset = 64 }: ToastProviderProps) {
  const [queue, setQueue] = useState(EMPTY_TOAST_QUEUE);
  // The id of a toast that has been told to close and is animating out. The
  // next one waits for the exit to finish, so two never overlap.
  const [closingId, setClosingId] = useState<number | null>(null);

  const api = useMemo<ToastApi>(() => {
    const show = (message: ReactNode, options?: ToastOptions) =>
      setQueue((state) => enqueueToast(state, makeToast(message, options)));
    return {
      show,
      success: (message, options) => show(message, { ...options, severity: 'success' }),
      info: (message, options) => show(message, { ...options, severity: 'info' }),
      warning: (message, options) => show(message, { ...options, severity: 'warning' }),
      error: (message, options) => show(message, { ...options, severity: 'error' }),
    };
  }, []);

  const current = queue.current;
  const close = useCallback(() => {
    if (current) setClosingId(current.id);
  }, [current]);

  const action = current?.action;

  return (
    <ToastContext.Provider value={api}>
      {children}
      {current && (
        <Snackbar
          key={current.id}
          open={closingId !== current.id}
          autoHideDuration={current.duration}
          // A click elsewhere on the page is not a dismissal.
          onClose={(_, reason) => reason !== 'clickaway' && close()}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          slotProps={{ transition: { onExited: () => setQueue(advanceToast) } }}
          sx={{
            bottom: {
              xs: `calc(${mobileBottomOffset}px + env(safe-area-inset-bottom))`,
              md: 24,
            },
          }}
        >
          <Alert
            severity={current.severity}
            variant="filled"
            onClose={action ? undefined : close}
            action={
              action ? (
                <>
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      action.onClick();
                      close();
                    }}
                  >
                    {action.label}
                  </Button>
                  <IconButton color="inherit" size="small" aria-label="Close" onClick={close}>
                    <CloseRoundedIcon />
                  </IconButton>
                </>
              ) : undefined
            }
            sx={{ width: '100%', maxWidth: 560, alignItems: 'center' }}
          >
            {current.message}
          </Alert>
        </Snackbar>
      )}
    </ToastContext.Provider>
  );
}

/** The toast API. Must be called below a `ToastProvider`. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast() needs a <ToastProvider> above it');
  return api;
}

/**
 * Lightweight toast notification system.
 * Provides a context provider + `useToast()` hook; no external dependency.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  variant: ToastVariant;
  message: string;
}

interface ToastContextValue {
  toast: (variant: ToastVariant, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { className: string; icon: typeof Info }> = {
  success: {
    className: 'border-emerald-400/30 bg-emerald-950/90 text-emerald-100',
    icon: CheckCircle2,
  },
  error: {
    className: 'border-rose-400/30 bg-rose-950/90 text-rose-100',
    icon: XCircle,
  },
  info: {
    className: 'border-accent-indigo/40 bg-navy-800/95 text-slate-100',
    icon: Info,
  },
};

const DEFAULT_DURATION_MS = 4500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextIdRef = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (variant: ToastVariant, message: string) => {
      const id = nextIdRef.current++;
      setToasts((current) => [...current.slice(-2), { id, variant, message }]);
    },
    [],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* `aria-live` keeps the messages accessible to screen readers. */}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
        role="status"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const style = VARIANT_STYLES[item.variant];
  const Icon = style.icon;

  // Auto-dismiss, cleaned up if the toast is removed early.
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(item.id), DEFAULT_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [item.id, onDismiss]);

  return (
    <div
      className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur transition-all animate-scale-in ${style.className}`}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm leading-relaxed">{item.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="rounded-md p-1 transition hover:bg-white/10"
        aria-label="Dismiss notification"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

/** Returns the toast API. Must be used inside `ToastProvider`. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

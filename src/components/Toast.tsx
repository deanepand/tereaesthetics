import { useEffect } from 'react';
import { Check, X, Info, AlertTriangle } from 'lucide-react';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-[90vw] sm:max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastData; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const config = {
    success: { bg: 'bg-sage-500', icon: Check },
    error: { bg: 'bg-red-500', icon: X },
    info: { bg: 'bg-dusty-500', icon: Info },
    warning: { bg: 'bg-champagne-500', icon: AlertTriangle },
  }[toast.type];

  const Icon = config.icon;

  return (
    <div className={`${config.bg} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-toastIn text-sm`}>
      <Icon size={16} className="flex-shrink-0" />
      <span className="flex-1 min-w-0 break-words">{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="flex-shrink-0 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

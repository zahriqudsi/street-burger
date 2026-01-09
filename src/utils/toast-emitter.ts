/**
 * Street Burger - Toast Event Emitter
 * Used to trigger toasts from non-component files like api.ts
 */

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastEvent {
    message: string;
    type?: ToastType;
    duration?: number;
}

type ToastListener = (event: ToastEvent) => void;

class ToastEmitter {
    private listeners: ToastListener[] = [];

    addListener(listener: ToastListener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    emit(event: ToastEvent) {
        this.listeners.forEach(listener => listener(event));
    }
}

export const toastEmitter = new ToastEmitter();

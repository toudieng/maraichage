// src/components/Toast.jsx
import { useState, useEffect } from 'react';

export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto-remove après 3 secondes
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    return { toasts, showToast };
};

export const ToastContainer = ({ toasts }) => {
    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-2">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} />
            ))}
        </div>
    );
};

const Toast = ({ message, type }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animation d'entrée
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    }[type] || 'bg-gray-500';

    const icon = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    }[type] || '•';

    return (
        <div
            className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] transform transition-all duration-300 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
        >
            <span className="text-2xl font-bold">{icon}</span>
            <p className="font-semibold">{message}</p>
        </div>
    );
};
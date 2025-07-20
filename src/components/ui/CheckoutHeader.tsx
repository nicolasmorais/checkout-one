// src/components/ui/CheckoutHeader.tsx
"use client";
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export default function CheckoutHeader() {
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutos em segundos

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <header className="w-full bg-green-500 text-white p-3 text-center text-sm">
            <div className="flex items-center justify-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>Oferta Exclusiva termina em: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
            </div>
        </header>
    );
}

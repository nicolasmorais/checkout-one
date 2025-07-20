// src/app/checkout/page.tsx
"use client";

import { useState } from 'react';
import CheckoutStep1 from '@/components/ui/CheckoutStep1';
import CheckoutStep2 from '@/components/ui/CheckoutStep2';
import CheckoutHeader from '@/components/ui/CheckoutHeader';
import Testimonials from '@/components/ui/Testimonials';
import CheckoutFooter from '@/components/ui/CheckoutFooter';
import { Loader2 } from 'lucide-react';

// Tipos
type CheckoutData = {
    name: string;
    email: string;
    value: number;
};

type QrCodeData = {
    qrCode: string;
    transactionId: string;
};

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [qrCodeData, setQrCodeData] = useState<QrCodeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNextStep = async (data: CheckoutData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-qr-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData: { message?: string } = await response.json();
        throw new Error(errorData.message || "Falha ao gerar o QR Code.");
      }

      const result: QrCodeData = await response.json();
      setQrCodeData(result);
      setStep(2);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <CheckoutHeader />
      <main className="w-full flex-grow flex flex-col items-center justify-center p-4 md:p-6">
        
        {/* Etapa 1: Formulário e Depoimentos */}
        {step === 1 && (
          <>
            <div className="w-full max-w-lg">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg h-96">
                        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
                        <p className="mt-4 text-gray-700 font-semibold">Gerando seu PIX, aguarde...</p>
                    </div>
                ) : (
                    <CheckoutStep1 onNext={handleNextStep} />
                )}
                 {error && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">
                        <span className="font-bold">Erro:</span> {error}
                    </div>
                )}
            </div>
            {!isLoading && <Testimonials />}
          </>
        )}

        {/* Etapa 2: QR Code */}
        {step === 2 && qrCodeData && (
          <div className="w-full max-w-lg">
            <CheckoutStep2 qrCodeData={qrCodeData} />
          </div>
        )}

      </main>
      <CheckoutFooter />
    </div>
  );
}

// src/app/checkout/page.tsx
"use client";

import { useState } from 'react';
import CheckoutStep1 from '@/components/ui/CheckoutStep1';
import CheckoutStep2 from '@/components/ui/CheckoutStep2';
import { AlertTriangle, Loader2 } from 'lucide-react';

// Definindo os tipos que serão usados na página
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
        headers: {
          'Content-Type': 'application/json',
        },
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
      // Permanece no Passo 1 para que o usuário possa ver o erro
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 1 && (
            <>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
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
            </>
        )}
        {step === 2 && qrCodeData && <CheckoutStep2 qrCodeData={qrCodeData} />}
      </div>

      {/* Aviso Legal da Pushin Pay */}
      <div className="mt-8 w-full max-w-lg bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md shadow-md">
        <div className="flex">
          <div className="py-1">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-4" />
          </div>
          <div>
            <p className="font-bold">Aviso Importante</p>
            <p className="text-sm">
              A PUSHIN PAY atua exclusivamente como processadora de pagamentos e não possui qualquer responsabilidade pela entrega, suporte, conteúdo, qualidade ou cumprimento das obrigações relacionadas aos produtos ou serviços oferecidos pelo vendedor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/components/ui/CheckoutStep2.tsx
"use client";

import { CheckCircle, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

interface QrCodeData {
    qrCode: string;
    transactionId: string;
}

export default function CheckoutStep2({ qrCodeData }: { qrCodeData: QrCodeData }) {

  return (
    <div className="w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
        {/* Logo */}
        <div className="text-center mb-6">
             <Image 
                src="https://i.postimg.cc/6QkX7yqN/Chat-GPT-Image-16-de-jul-de-2025-16-58-36-1.png" 
                alt="One Conversion Logo"
                width={200}
                height={50}
                className="mx-auto"
            />
        </div>

        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Falta pouco!</h2>
            <p className="text-gray-600 mb-6">Escaneie a imagem abaixo para pagar</p>

             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
                src={qrCodeData.qrCode} 
                alt="QR Code PIX para pagamento" 
                className="mx-auto rounded-lg shadow-md border-4 border-white" 
            />
            
            <div className="mt-4 text-xs text-gray-500">
                <span>ID da Transação: {qrCodeData.transactionId}</span>
            </div>

             <div className="mt-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
                <div className="flex">
                    <div className="py-1"><CheckCircle className="h-5 w-5 text-green-500 mr-3" /></div>
                    <div>
                        <p className="font-bold">Pagamento confirmado!</p>
                        <p className="text-sm">Você receberá os dados de acesso no seu e-mail.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="text-center mt-4 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm text-gray-500">Ambiente seguro</span>
        </div>
    </div>
  );
}

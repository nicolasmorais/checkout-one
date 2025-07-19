// src/components/ui/CheckoutStep2.tsx
"use client";

import { CheckCircle } from 'lucide-react';

interface QrCodeData {
    qrCode: string;
    transactionId: string;
}

export default function CheckoutStep2({ qrCodeData }: { qrCodeData: QrCodeData }) {

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Quase lá!</h2>
            <p className="text-gray-600 mb-6">Passo 2: Pagamento</p>
        </div>

        <div className="text-center">
          <p className="mb-4 text-gray-700">Escaneie o QR code abaixo para finalizar a compra.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrCodeData.qrCode} alt="QR Code PIX" className="mx-auto rounded-lg shadow-md" />
          <div className="mt-4 text-xs text-gray-500">
            ID da Transação: {qrCodeData.transactionId}
          </div>
          <div className="mt-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
            <div className="flex">
              <div className="py-1"><CheckCircle className="h-5 w-5 text-green-500 mr-3" /></div>
              <div>
                <p className="font-bold">Pagamento seguro</p>
                <p className="text-sm">Seus dados estão protegidos.</p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

// src/components/ui/CheckoutStep1.tsx
"use client";

import { useState } from 'react';
import { z } from 'zod';
import { ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { createTransactionAndGeneratePix } from '@/app/actions';
import type { Transaction } from '@/lib/types';

// Schema de validação
const schema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
});

// Props
interface CheckoutStep1Props {
    onNext: (data: Transaction) => void;
}

export default function CheckoutStep1({ onNext }: CheckoutStep1Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string[]; email?: string[]; server?: string; }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const validationResult = schema.safeParse({ name, email });

    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
      setIsSubmitting(false);
      return;
    }

    const customerData = {
        customerName: name,
        customerEmail: email,
        productName: "Acesso Exclusivo – Plano Vitalício",
        amount: 1.50, // Valor fixo
    };

    const result = await createTransactionAndGeneratePix(customerData);

    setIsSubmitting(false);

    if (result.success && result.transaction) {
      onNext(result.transaction);
    } else {
      setErrors({ server: result.message || "Não foi possível processar seu pedido. Tente novamente." });
    }
  };

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

        {/* Detalhes do Produto */}
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700">Acesso Exclusivo – Plano Vitalício</p>
            <p className="font-bold text-green-500 text-lg">R$1,50</p>
        </div>

      <p className="text-gray-600 mb-4">Preencha os dados abaixo para concluir a sua compra.</p>
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Maria Oliveira Silva"
            className={`w-full px-4 py-2 border rounded-md bg-gray-50 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            className={`w-full px-4 py-2 border rounded-md bg-gray-50 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
        </div>

        {errors.server && <p className="text-red-500 text-sm text-center mb-4">{errors.server}</p>}

        <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors duration-300 font-semibold flex items-center justify-center disabled:bg-green-400" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              Ir para pagamento
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-4 flex items-center justify-center">
        <ShieldCheck className="h-4 w-4 text-green-500 mr-2" />
        <span className="text-sm text-gray-500">Ambiente seguro</span>
      </div>
    </div>
  );
}

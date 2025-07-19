// src/components/ui/CheckoutStep1.tsx
"use client";

import { useState } from 'react';
import { z } from 'zod';

// Schema de validação sem o campo de valor
const schema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
});

export default function CheckoutStep1({ onNext }: { onNext: (data: any) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string[]; email?: string[] }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = schema.safeParse({ name, email });

    if (result.success) {
      // Envia os dados com o valor fixo de 200 centavos (R$ 2,00)
      onNext({ name, email, value: 200 });
      setErrors({});
    } else {
      setErrors(result.error.flatten().fieldErrors);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
      <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Pagamento PIX</h2>
      <p className="text-center text-gray-600 mb-8">Valor: <span className="font-bold">R$ 2,00</span></p>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Nome</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
        </div>
        <div className="mb-8">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-bold text-lg">
          Gerar QR Code PIX
        </button>
      </form>
    </div>
  );
}

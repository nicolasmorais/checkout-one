// src/app/api/generate-qr-code/route.ts
import { NextResponse } from 'next/server';
import { createPix } from '@/lib/pushinpay';
import { z } from 'zod';
import { kv } from '@vercel/kv';
import type { Transaction } from '@/lib/types'; // <-- CORRIGIDO para usar o arquivo central

// Schema para validar o corpo da requisição
const requestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  value: z.number().min(50),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Dados inválidos", details: validation.error.flatten() }, { status: 400 });
    }

    const { name, email, value } = validation.data;

    // 1. Cria o PIX na Pushin Pay
    const pixData = await createPix(value);

    // 2. Prepara os dados da transação para salvar
    const newTransaction: Transaction = {
      id: pixData.id,
      name,
      email,
      value, // Salva o valor em centavos
      date: new Date().toISOString(),
      status: pixData.status, // 'created', 'paid', etc.
    };

    // 3. Salva a transação no Vercel KV
    await kv.set(`txn:${newTransaction.id}`, newTransaction);
    await kv.lpush('transactions', newTransaction.id);


    // 4. Retorna o QR Code para o cliente
    return NextResponse.json({ 
      qrCode: pixData.qr_code_base64,
      transactionId: pixData.id 
    });

  } catch (error) {
    console.error("Erro na rota /api/generate-qr-code:", error);
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    return NextResponse.json({ error: "Não foi possível gerar o QR Code.", message: errorMessage }, { status: 500 });
  }
}

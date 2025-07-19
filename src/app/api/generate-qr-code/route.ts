// src/app/api/generate-qr-code/route.ts
import { NextResponse } from 'next/server';
import { createPix } from '@/lib/pushinpay';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

// Schema para validar o corpo da requisição
const requestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  value: z.number().min(50),
});

// Define o tipo para uma transação
interface Transaction {
  id: string;
  name: string;
  email: string;
  value: number;
  date: string;
  status: string;
}

// Caminho para o nosso "banco de dados"
const dbPath = path.join(process.cwd(), 'data', 'db.json');

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

    // 3. Salva a transação no db.json
    const dbData = await fs.readFile(dbPath, 'utf-8');
    const dbJson = JSON.parse(dbData);
    dbJson.transactions.unshift(newTransaction); // Adiciona no início do array
    await fs.writeFile(dbPath, JSON.stringify(dbJson, null, 2));


    // 4. Retorna o QR Code para o cliente
    return NextResponse.json({ 
      qrCode: pixData.qr_code_base64,
      transactionId: pixData.id 
    });

  } catch (error: any) {
    console.error("Erro na rota /api/generate-qr-code:", error);
    return NextResponse.json({ error: "Não foi possível gerar o QR Code.", message: error.message }, { status: 500 });
  }
}

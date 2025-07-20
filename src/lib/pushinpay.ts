// src/lib/pushinpay.ts

import { z } from 'zod';

const PUSHINPAY_API_URL = process.env.PUSHINPAY_API_URL;
const PUSHINPAY_API_TOKEN = process.env.PUSHINPAY_API_TOKEN;

// Schema para a RESPOSTA da criação de PIX
const createPixResponseSchema = z.object({
  transactionID: z.string(),
  qrCode: z.string(),
  link: z.string(),
});

// Schema específico e mais flexível para a resposta da CONSULTA de PIX
const consultPixResponseSchema = z.object({
  id: z.string(),
  status: z.string(),
  value: z.coerce.number(), // Usa coerce para garantir que o valor seja numérico
  // Todos os outros campos são opcionais, pois podem não estar presentes na consulta
  end_to_end_id: z.string().nullable().optional(),
  payer_name: z.string().nullable().optional(),
  payer_national_registration: z.string().nullable().optional(),
  webhook_url: z.string().nullable().optional(),
  // ... e quaisquer outros campos da documentação
});


/**
 * Cria uma cobrança PIX na Pushin Pay.
 */
export async function criarPix({ valor, pagador }: { valor: number, pagador: { nome: string, email: string, cpf: string } }) {
  if (!PUSHINPAY_API_URL || !PUSHINPAY_API_TOKEN) {
    throw new Error('As variáveis de ambiente da Pushin Pay não foram configuradas.');
  }
  
  const response = await fetch(`${PUSHINPAY_API_URL}/pix`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PUSHINPAY_API_TOKEN}`,
    },
    body: JSON.stringify({
      value: valor,
      payer: {
        name: pagador.nome,
        email: pagador.email,
        national_registration: pagador.cpf,
      }
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Erro da API Pushin Pay: ${response.status}`, errorBody);
    throw new Error(`Falha ao criar cobrança PIX. Status: ${response.status}`);
  }

  const data = await response.json();
  const validatedData = createPixResponseSchema.parse(data);
  return validatedData;
}


/**
 * Consulta o status de uma transação PIX.
 */
export async function consultarPix(transactionId: string) {
  if (!PUSHINPAY_API_URL || !PUSHINPAY_API_TOKEN) {
    throw new Error('As variáveis de ambiente da Pushin Pay não foram configuradas.');
  }

  try {
    const response = await fetch(`${PUSHINPAY_API_URL}/pix/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PUSHINPAY_API_TOKEN}`,
      },
    });

    if (response.status === 404) {
      console.log(`Transação ${transactionId} não encontrada na API Pushin Pay.`);
      return null;
    }
    
    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Erro da API Pushin Pay ao consultar: ${response.status}`, errorBody);
        throw new Error(`Falha ao consultar transação PIX. Status: ${response.status}`);
    }

    const data = await response.json();
    const validatedData = consultPixResponseSchema.parse(data);
    return validatedData;
  } catch (error) {
    console.error("Erro ao consultar PIX:", error);
    if (error instanceof z.ZodError) {
      console.error("Erro de validação Zod:", error.issues);
    }
    throw error;
  }
}

// src/lib/pushinpay.ts
import { z } from 'zod';

const PUSHINPAY_API_URL = process.env.PUSHINPAY_API_URL;
const PUSHINPAY_API_TOKEN = process.env.PUSHINPAY_API_TOKEN;

// Schema para a resposta da criação de PIX (mais estrito)
const createPixResponseSchema = z.object({
  id: z.string(),
  status: z.string(),
  value: z.number(),
  qr_code: z.string(),
  qr_code_base64: z.string(),
  // ... outros campos que podem ser obrigatórios na criação
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
export async function createPix(value: number) {
  if (!PUSHINPAY_API_URL || !PUSHINPAY_API_TOKEN) {
    throw new Error('As variáveis de ambiente da Pushin Pay não foram configuradas.');
  }

  const response = await fetch(`${PUSHINPAY_API_URL}/api/pix/cashIn`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PUSHINPAY_API_TOKEN}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(`Erro da API de Pagamento (${response.status}): ${errorBody.message || 'Erro desconhecido'}`);
  }

  const data = await response.json();
  const validatedData = createPixResponseSchema.safeParse(data);

  if (!validatedData.success) {
      console.error("Erro de validação (createPix):", validatedData.error.issues);
      throw new Error("A resposta da API (createPix) tem um formato inesperado.");
  }
  return validatedData.data;
}

/**
 * Consulta o status de uma transação PIX.
 */
export async function consultarPix(transactionId: string) {
    if (!PUSHINPAY_API_URL || !PUSHINPAY_API_TOKEN) {
        throw new Error('As variáveis de ambiente da Pushin Pay não foram configuradas.');
    }

    const response = await fetch(`${PUSHINPAY_API_URL}/api/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${PUSHINPAY_API_TOKEN}`,
            'Accept': 'application/json',
        },
    });

    // Tratamento específico para 404, como manda a documentação
    if (response.status === 404) {
        console.log(`Transação ${transactionId} não encontrada (404).`);
        return null; // Retorna null se não encontrado
    }

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(`Erro da API de Pagamento (${response.status}): ${errorBody.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();
    // Usa o novo schema, específico para a consulta
    const validatedData = consultPixResponseSchema.safeParse(data);

    if (!validatedData.success) {
        console.error("Erro de validação (consultarPix):", validatedData.error.issues);
        // Este é o erro que você estava vendo.
        throw new Error("A resposta da API (consultarPix) não corresponde ao esperado.");
    }

    return validatedData.data;
}

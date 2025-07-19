// src/lib/pushinpay.ts
import { z } from 'zod';

const PUSHINPAY_API_URL = process.env.PUSHINPAY_API_URL;
const PUSHINPAY_API_TOKEN = process.env.PUSHINPAY_API_TOKEN;

// Schema para validar a resposta da API
const pixResponseSchema = z.object({
  id: z.string(),
  qr_code: z.string().nullable().optional(), // Nullable no GET
  status: z.string(),
  value: z.number(),
  webhook_url: z.string().nullable(),
  qr_code_base64: z.string().nullable().optional(), // Nullable no GET
  webhook: z.string().nullable(),
  split_rules: z.array(z.any()),
  end_to_end_id: z.string().nullable(),
  payer_name: z.string().nullable(),
  payer_national_registration: z.string().nullable(),
});

/**
 * Cria uma cobrança PIX na Pushin Pay.
 * @param value O valor da cobrança em centavos.
 * @returns Os dados do PIX gerado.
 */
export async function createPix(value: number) {
  if (!PUSHINPAY_API_URL || !PUSHINPAY_API_TOKEN) {
    throw new Error('As variáveis de ambiente da Pushin Pay não foram configuradas.');
  }

  try {
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
      const errorBody = await response.json();
      console.error("Erro da API Pushin Pay (createPix):", errorBody);
      throw new Error(`Erro ao criar PIX: ${response.statusText}`);
    }

    const data = await response.json();
    const validatedData = pixResponseSchema.safeParse(data);

    if (!validatedData.success) {
        console.error("Erro de validação da resposta (createPix):", validatedData.error);
        throw new Error("A resposta da API (createPix) não corresponde ao esperado.");
    }
    
    return validatedData.data;

  } catch (error) {
    console.error("Erro na comunicação com a Pushin Pay (createPix):", error);
    throw new Error("Não foi possível se comunicar com a API de pagamento.");
  }
}

/**
 * Consulta o status de uma transação PIX.
 * @param transactionId O ID da transação.
 * @returns Os dados da transação.
 */
export async function consultarPix(transactionId: string) {
    if (!PUSHINPAY_API_URL || !PUSHINPAY_API_TOKEN) {
        throw new Error('As variáveis de ambiente da Pushin Pay não foram configuradas.');
    }

    try {
        const response = await fetch(`${PUSHINPAY_API_URL}/api/transactions/${transactionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${PUSHINPAY_API_TOKEN}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 404) {
            return null; // Transação não encontrada
        }

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Erro da API Pushin Pay (consultarPix):", errorBody);
            throw new Error(`Erro ao consultar PIX: ${response.statusText}`);
        }

        const data = await response.json();
        const validatedData = pixResponseSchema.safeParse(data);

        if (!validatedData.success) {
            console.error("Erro de validação da resposta (consultarPix):", validatedData.error);
            throw new Error("A resposta da API (consultarPix) não corresponde ao esperado.");
        }

        return validatedData.data;

    } catch (error) {
        console.error("Erro na comunicação com a Pushin Pay (consultarPix):", error);
        throw new Error("Não foi possível se comunicar com a API de pagamento.");
    }
}

// src/app/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { consultarPix } from '@/lib/pushinpay';
import { kv } from '@vercel/kv';
import type { Transaction } from '@/lib/types';


export async function checkTransactionStatus(transactionId: string) {
    try {
        const pixData = await consultarPix(transactionId);

        // Se a consulta retornar dados, atualize o status.
        if (pixData) {
            const transaction = await kv.get<Transaction>(`txn:${transactionId}`);
            if (transaction) {
                transaction.status = pixData.status;
                await kv.set(`txn:${transactionId}`, transaction);
            }
        // Se a consulta retornar null (404), podemos opcionalmente marcar como "not_found" ou "expired"
        } else {
          console.log(`Transação ${transactionId} não encontrada na API. Nenhum status para atualizar.`);
        }

        revalidatePath('/dashboard');
        
        return { success: true, newStatus: pixData?.status || 'not_found' };

    } catch (error) {
        console.error("Erro detalhado ao verificar status da transação:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
        return { success: false, message: errorMessage };
    }
}

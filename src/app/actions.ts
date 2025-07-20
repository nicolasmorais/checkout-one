// src/app/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { consultarPix } from '@/lib/pushinpay';
import { kv } from '@vercel/kv';
import type { Transaction } from '@/lib/types';


export async function checkTransactionStatus(transactionId: string) {
    try {
        const pixData = await consultarPix(transactionId);

        if (pixData) {
            const transaction = await kv.get<Transaction>(`txn:${transactionId}`);

            if (transaction) {
                transaction.status = pixData.status;
                await kv.set(`txn:${transactionId}`, transaction);
            }
        }

        revalidatePath('/dashboard');
        
        return { success: true, newStatus: pixData?.status || 'unknown' };

    } catch (error) {
        console.error("Erro detalhado ao verificar status da transação:", error);
        
        // Captura a mensagem de erro específica e a retorna para o cliente.
        const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
        return { success: false, message: errorMessage };
    }
}

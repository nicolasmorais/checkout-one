// src/app/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { consultarPix } from '@/lib/pushinpay';
import { kv } from '@vercel/kv';
// CORREÇÃO: O caminho da importação estava errado.
import type { Transaction } from '@/app/api/generate-qr-code/route';


export async function checkTransactionStatus(transactionId: string) {
    try {
        const pixData = await consultarPix(transactionId);

        if (pixData) {
            // Busca a transação existente no KV
            const transaction = await kv.get<Transaction>(`txn:${transactionId}`);

            if (transaction) {
                // Atualiza o status
                transaction.status = pixData.status;
                // Salva a transação atualizada de volta no KV
                await kv.set(`txn:${transactionId}`, transaction);
            }
        }

        // Revalida a página do dashboard para mostrar o status atualizado
        revalidatePath('/dashboard');
        
        return { success: true, newStatus: pixData?.status || 'unknown' };

    } catch (error) {
        console.error("Erro ao verificar status da transação:", error);
        return { success: false, message: "Falha ao verificar o status." };
    }
}

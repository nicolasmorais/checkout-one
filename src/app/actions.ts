// src/app/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { consultarPix } from '@/lib/pushinpay';
import fs from 'fs/promises';
import path from 'path';

interface Transaction {
    id: string;
    name: string;
    email: string;
    value: number;
    date: string;
    status: string;
}

const dbPath = path.join(process.cwd(), 'data', 'db.json');

export async function checkTransactionStatus(transactionId: string) {
    try {
        const pixData = await consultarPix(transactionId);

        if (pixData) {
            // Ler o banco de dados
            const dbData = await fs.readFile(dbPath, 'utf-8');
            const dbJson = JSON.parse(dbData);

            // Encontrar e atualizar a transação
            const transactionIndex = dbJson.transactions.findIndex((t: Transaction) => t.id === transactionId);

            if (transactionIndex > -1) {
                dbJson.transactions[transactionIndex].status = pixData.status;
                // Salvar as alterações
                await fs.writeFile(dbPath, JSON.stringify(dbJson, null, 2));
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

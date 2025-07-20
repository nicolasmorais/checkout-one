// src/app/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { consultarPix, criarPix } from "@/lib/pushinpay";
import { kv } from "@vercel/kv";
import type { Transaction } from "@/lib/types";

// Nova ação para criar a transação e gerar o Pix
export async function createTransactionAndGeneratePix(
  customerData: Omit<Transaction, "id" | "status" | "qrCode" | "link">
) {
  try {
    const pixResponse = await criarPix({
      valor: customerData.amount,
      pagador: {
        nome: customerData.customerName,
        email: customerData.customerEmail,
        cpf: "12345678900", // CPF Fictício - Melhorar no futuro
      },
    });

    if (!pixResponse || !pixResponse.transactionID) {
      throw new Error("Falha ao gerar o QR Code do Pix.");
    }

    const newTransaction: Transaction = {
      id: pixResponse.transactionID,
      status: "PENDING",
      customerName: customerData.customerName,
      customerEmail: customerData.customerEmail,
      productName: customerData.productName,
      amount: customerData.amount,
      qrCode: pixResponse.qrCode,
      link: pixResponse.link,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`txn:${newTransaction.id}`, newTransaction);

    return {
      success: true,
      transaction: newTransaction,
    };
  } catch (error) {
    console.error("Erro ao criar transação e gerar PIX:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    return { success: false, message: errorMessage };
  }
}

// Ação atualizada para verificar o status e enviar o e-mail
export async function checkTransactionStatus(transactionId: string) {
  try {
    const pixData = await consultarPix(transactionId);
    let transaction = await kv.get<Transaction>(`txn:${transactionId}`);

    if (!transaction) {
      console.error(`Transação ${transactionId} não encontrada no KV.`);
      return { success: false, message: "Transação não encontrada." };
    }

    // Se o status na API for diferente do status salvo, atualize e tome ações.
    if (pixData && pixData.status !== transaction.status) {
      transaction.status = pixData.status;
      await kv.set(`txn:${transactionId}`, transaction);

      // Se o pagamento foi confirmado, envie o e-mail de confirmação.
      if (pixData.status === "CONFIRMED") {
        console.log(`Pagamento confirmado para a transação ${transactionId}. Enviando e-mail...`);
        
        // Obtenha a URL base para o e-mail
        const baseUrl = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000";

        // Chame a API de envio de e-mail (não bloqueante)
        fetch(`${baseUrl}/api/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName: transaction.customerName,
            customerEmail: transaction.customerEmail,
            orderId: transaction.id,
            productName: transaction.productName,
            productPrice: new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(transaction.amount),
          }),
        }).catch(err => {
            // Mesmo que o envio de email falhe, não queremos que a verificação de status falhe.
            // Apenas logamos o erro.
            console.error("Falha ao chamar a API de envio de e-mail:", err);
        });
      }
    } else if (!pixData) {
      console.log(
        `Transação ${transactionId} não encontrada na API Pushin Pay. Nenhum status para atualizar.`
      );
    }
    
    // Revalida o caminho para atualizar a UI do dashboard.
    revalidatePath("/dashboard");

    return { success: true, newStatus: transaction.status };
  } catch (error) {
    console.error(
      "Erro detalhado ao verificar status da transação:",
      error
    );
    const errorMessage =
      error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    return { success: false, message: errorMessage };
  }
}

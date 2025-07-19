// src/components/ui/RecentSales.tsx
"use client";

import { useState } from 'react';
import { checkTransactionStatus } from '@/app/actions';
import type { Transaction } from '@/app/api/generate-qr-code/route';


// Props para o componente, que receberá as transações iniciais
interface RecentSalesProps {
    initialTransactions: Transaction[];
}

// ... (Funções de formatação e StatusBadge permanecem as mesmas)
function formatCurrency(valueInCents: number) {
    return (valueInCents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
}
function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
}
function StatusBadge({ status }: { status: string }) {
    const baseClasses = "px-3 py-1 text-xs font-medium text-white rounded-full";
    let colorClasses = "bg-gray-400";
    let text = "Criado";
    if (status === 'paid') {
        colorClasses = "bg-green-500";
        text = "Pago";
    } else if (status === 'expired') {
        colorClasses = "bg-red-500";
        text = "Expirado";
    }
    return <span className={`${baseClasses} ${colorClasses}`}>{text}</span>;
}


export default function RecentSales({ initialTransactions }: RecentSalesProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleCheckStatus = async (transactionId: string) => {
    setLoadingId(transactionId);
    const result = await checkTransactionStatus(transactionId);
    if (!result.success) {
        alert(result.message);
    }
    // O revalidatePath cuidará de atualizar a UI, então não precisamos de estado local
    setLoadingId(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Vendas Recentes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID da Transação</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Cliente</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Valor</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Data</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {initialTransactions.map((sale) => (
              <tr key={sale.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-700 font-mono truncate" style={{ maxWidth: '100px' }}>{sale.id}</td>
                <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="font-medium">{sale.name}</div>
                    <div className="text-xs text-gray-500">{sale.email}</div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-700 font-semibold">{formatCurrency(sale.value)}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{formatDate(sale.date)}</td>
                <td className="py-3 px-4 text-sm text-gray-700">
                    <StatusBadge status={sale.status} />
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  <button 
                    onClick={() => handleCheckStatus(sale.id)}
                    disabled={loadingId === sale.id}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-xs disabled:bg-gray-400"
                  >
                    {loadingId === sale.id ? 'Verificando...' : 'Verificar Status'}
                  </button>
                </td>
              </tr>
            ))}
             {initialTransactions.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhuma venda recente encontrada.
                    </td>
                </tr>
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

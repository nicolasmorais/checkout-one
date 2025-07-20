// src/app/dashboard/page.tsx

// Força a página a ser renderizada dinamicamente, evitando erros de build em produção
export const dynamic = 'force-dynamic';

import { BarChart, DollarSign, ShoppingBag, User } from "lucide-react";
import RecentSales from "@/components/ui/RecentSales";
import { kv } from '@vercel/kv';
import type { Transaction } from '@/lib/types'; // <-- CORRIGIDO para usar o arquivo central


// Função para buscar os dados e calcular as estatísticas do Vercel KV
async function getDashboardStats() {
    try {
        const transactionIds = await kv.lrange<string>('transactions', 0, 99);

        if (transactionIds.length === 0) {
            return { totalSales: 'R$ 0,00', totalOrders: 0, uniqueCustomers: 0, recentSales: [] };
        }

        const transactions = await kv.mget<Transaction[]>(...transactionIds.map(id => `txn:${id}`));
        const validTransactions = transactions.filter((t): t is Transaction => t !== null);
        
        const totalSales = validTransactions
            .filter(t => t.status === 'paid')
            .reduce((sum, t) => sum + t.value, 0);

        const totalOrders = validTransactions.length;
        const uniqueCustomers = new Set(validTransactions.map(t => t.email)).size;

        return {
            totalSales: (totalSales / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            totalOrders,
            uniqueCustomers,
            recentSales: validTransactions 
        };

    } catch (error) {
        console.error("Erro ao carregar as estatísticas do dashboard do Vercel KV:", error);
        return {
            totalSales: 'R$ 0,00',
            totalOrders: 0,
            uniqueCustomers: 0,
            recentSales: []
        };
    }
}


export default async function DashboardPage() {
  const { totalSales, totalOrders, uniqueCustomers, recentSales } = await getDashboardStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Seu Dashboard</h1>
        <p className="text-gray-600">Bem-vindo de volta!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 glow-effect">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-500">Vendas Aprovadas</h2>
              <p className="text-3xl font-bold text-gray-800">{totalSales}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 glow-effect">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-500">Total de Pedidos</h2>
              <p className="text-3xl font-bold text-gray-800">{totalOrders}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 glow-effect">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-500">Clientes Únicos</h2>
              <p className="text-3xl font-bold text-gray-800">{uniqueCustomers}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <User className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>
      
      <RecentSales initialTransactions={recentSales} />

    </div>
  );
}

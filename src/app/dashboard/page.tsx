// src/app/dashboard/page.tsx
import { BarChart, DollarSign, ShoppingBag, User } from "lucide-react";
import RecentSales from "@/components/ui/RecentSales";
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

// Função para buscar os dados no servidor
async function getRecentSales(): Promise<Transaction[]> {
    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    try {
        const dbData = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(dbData).transactions;
    } catch (error) {
        console.error("Erro ao carregar as vendas recentes para o dashboard:", error);
        return [];
    }
}


export default async function DashboardPage() {
  const recentSalesData = await getRecentSales();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Seu Dashboard</h1>
        <p className="text-gray-600">Bem-vindo de volta!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cards do Dashboard... */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 glow-effect">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-500">Vendas Totais</h2>
              <p className="text-3xl font-bold text-gray-800">R$ 12.345</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 glow-effect">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-500">Pedidos</h2>
              <p className="text-3xl font-bold text-gray-800">1.234</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 glow-effect">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-500">Clientes</h2>
              <p className="text-3xl font-bold text-gray-800">567</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <User className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 glow-effect">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-500">Relatórios</h2>
              <p className="text-3xl font-bold text-gray-800">23</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
                <BarChart className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Passa os dados iniciais para o componente de cliente */}
      <RecentSales initialTransactions={recentSalesData} />

    </div>
  );
}

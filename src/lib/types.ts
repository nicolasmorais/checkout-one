// src/lib/types.ts

// Define a estrutura de uma Transação em um único local.
export interface Transaction {
  id: string;
  name: string;
  email: string;
  value: number; // em centavos
  date: string;
  status: string; // e.g., 'created', 'paid', 'expired'
}

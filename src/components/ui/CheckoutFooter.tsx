// src/components/ui/CheckoutFooter.tsx
import { Lock } from 'lucide-react';

export default function CheckoutFooter() {
    return (
        <footer className="w-full max-w-lg mt-10 text-center text-sm text-gray-500">
            <div className="flex justify-center items-center space-x-6">
                <div>
                    <p className="font-bold">OneConversion</p>
                    <p>CNPJ: 12.345.678/0001-99</p>
                    <p>© 2023 Todos os direitos reservados.</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg flex items-center">
                    <Lock className="h-5 w-5 text-gray-600 mr-2" />
                    <div>
                        <p className="font-semibold">Pagamento Seguro</p>
                        <p>Transação protegida pelo</p>
                        <p>Banco Central.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

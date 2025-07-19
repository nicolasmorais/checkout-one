// src/components/ui/Sidebar.tsx
import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, User, Building } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed flex flex-col shadow-2xl">
      <div className="p-6 flex items-center space-x-4 border-b border-gray-700">
        <Building className="h-8 w-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-white tracking-wider">Dashboard</h2>
      </div>
      <nav className="mt-8 flex-1">
        <ul>
          <li className="mb-4">
            <Link href="/dashboard" className="flex items-center p-4 text-lg text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg mx-4 transition-all duration-300 glow-link">
              <LayoutDashboard className="mr-4 h-6 w-6 text-blue-400" />
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/checkout" className="flex items-center p-4 text-lg text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg mx-4 transition-all duration-300 glow-link">
              <ShoppingCart className="mr-4 h-6 w-6 text-green-400" />
              Checkout
            </Link>
          </li>
          <li className="mb-4">
            <Link href="#" className="flex items-center p-4 text-lg text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg mx-4 transition-all duration-300 glow-link">
              <User className="mr-4 h-6 w-6 text-yellow-400" />
              Profile
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-6 border-t border-gray-700">
        <p className="text-center text-sm text-gray-500">© 2024 Your Company</p>
      </div>
    </aside>
  );
}

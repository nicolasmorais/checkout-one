// src/app/dashboard/layout.tsx
import Sidebar from '@/components/ui/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 ml-64">
        {children}
      </main>
    </div>
  );
}

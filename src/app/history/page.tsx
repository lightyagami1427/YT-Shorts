'use client';

import Sidebar from '@/components/Sidebar';

export default function HistoryPage() {
  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-10 max-w-6xl mx-auto text-center py-40">
        <h2 className="text-4xl font-bold mb-4">Video History</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Connect your Supabase project in `.env.local` to unlock cloud history storage. 
          Your past generated video packages will appear here.
        </p>
      </main>
    </div>
  );
}

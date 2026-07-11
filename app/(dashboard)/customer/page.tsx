'use client';

import React from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import ExploreFeedPage from '@/app/(public)/explore/page';
import { Sparkles } from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-4">
      {/* Greetings banner */}
      <div className="bg-gradient-to-r from-primary to-amber-accent text-bg p-4 rounded-xl flex items-center justify-between shadow-sm">
        <div>
          <h2 className="text-lg font-serif font-bold">Hello, {user?.name}!</h2>
          <p className="text-xs text-white/80 mt-0.5">Ready to discover premium plating ideas in Mumbai?</p>
        </div>
        <div className="bg-white/10 p-2 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Render the core explore feed */}
      <ExploreFeedPage />
    </div>
  );
}

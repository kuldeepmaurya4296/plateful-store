'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { motion } from 'framer-motion';
import { Sparkles, Utensils, Shield, User, Smartphone } from 'lucide-react';
import { scaleUp } from '@/lib/animations';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [role, setRole] = useState<'customer' | 'owner' | 'manager' | 'captain' | 'superadmin'>('customer');
  const [username, setUsername] = useState('riya.eats');
  const [password, setPassword] = useState('••••••••');

  const handleRoleChange = (newRole: 'customer' | 'owner' | 'manager' | 'captain' | 'superadmin') => {
    setRole(newRole);
    // Prefill username for easy review testing
    if (newRole === 'customer') setUsername('riya.eats');
    else if (newRole === 'owner') setUsername('vikram.owner');
    else if (newRole === 'manager') setUsername('priya.manager');
    else if (newRole === 'captain') setUsername('aman.captain');
    else if (newRole === 'superadmin') setUsername('admin.saas');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, role);

    if (success) {
      toast({
        type: 'success',
        title: 'Logged in successfully',
        description: `Welcome back, logged in as ${role}`
      });
      // Redirect will be handled by Layout wrapper, but let's push to be explicit
      if (role === 'customer') router.push('/customer');
      else if (role === 'captain') router.push('/captain');
      else if (role === 'superadmin') router.push('/superadmin');
      else router.push('/manager');
    } else {
      toast({
        type: 'error',
        title: 'Login failed',
        description: 'Please check your credentials.'
      });
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-bg relative overflow-hidden px-4">
      {/* Background graphic elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <motion.div
        variants={scaleUp}
        initial="initial"
        animate="animate"
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex bg-primary/10 text-primary p-2.5 rounded-xl mb-3">
            <Utensils className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-ink">Plateful</h1>
          <p className="text-sm text-ink-soft mt-1">One app. Three surfaces. Infinite discovery.</p>
        </div>

        <Card className="shadow-xl border-line/60">
          <h3 className="text-lg font-serif font-bold text-ink mb-4 text-center">
            Sign In to Portal
          </h3>

          {/* Role selector tabs */}
          <div className="grid grid-cols-5 gap-1 bg-bg-alt p-1 rounded-lg mb-6 border border-line">
            {(['customer', 'owner', 'manager', 'captain', 'superadmin'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleChange(r)}
                className={`py-2 text-[10px] sm:text-xs font-semibold capitalize rounded-md transition-all cursor-pointer ${
                  role === r
                    ? 'bg-bg-card text-primary shadow-sm'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                {r === 'superadmin' ? 'SaaS' : r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username / ID"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder={`Enter ${role} username`}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <div className="text-right">
              <a href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" variant="primary" fullWidth className="py-2.5">
              Access Portal
            </Button>
          </form>

          {/* Helper notes for testing */}
          <div className="mt-6 pt-4 border-t border-line/60 bg-bg/50 -mx-5 -mb-5 px-5 py-4 rounded-b-lg">
            <p className="text-[10px] font-mono text-ink-soft leading-relaxed">
              <span className="font-bold text-primary">Demo Notice:</span> Select a role above. Pre-filled usernames match mock database entries from <code className="text-xs">users.json</code>.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

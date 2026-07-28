'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { motion } from 'framer-motion';
import { Utensils, UserPlus, LogIn, Sparkles, User, Mail, Lock, AtSign, ArrowRight } from 'lucide-react';
import { scaleUp } from '@/lib/animations';
import { signIn } from 'next-auth/react';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { user, login, isLoading } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<'customer' | 'owner' | 'manager' | 'captain' | 'superadmin'>('customer');
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  
  // Sign In state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automatic Session Redirection: If user is already logged in, redirect to their role portal
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'customer') router.replace('/customer');
      else if (user.role === 'captain') router.replace('/captain');
      else if (user.role === 'superadmin') router.replace('/superadmin');
      else router.replace('/manager');
    }
  }, [user, isLoading, router]);

  const handleRoleChange = (newRole: 'customer' | 'owner' | 'manager' | 'captain' | 'superadmin') => {
    setRole(newRole);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(username, role, password);
    setIsSubmitting(false);

    if (success) {
      toast({
        type: 'success',
        title: 'Logged in successfully',
        description: `Welcome back, logged in as ${role}`
      });
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

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          username: regUsername,
          password: regPassword,
          role
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          type: 'error',
          title: 'Registration Failed',
          description: data.error || 'Failed to create account.'
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        type: 'success',
        title: 'Account Created!',
        description: `Welcome to Plateful, ${regName}. Signing you in...`
      });

      // Automatically sign in newly registered user
      const loggedIn = await login(regUsername, role, regPassword);
      setIsSubmitting(false);

      if (loggedIn) {
        if (role === 'customer') router.push('/customer');
        else if (role === 'captain') router.push('/captain');
        else if (role === 'superadmin') router.push('/superadmin');
        else router.push('/manager');
      }
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Error',
        description: err.message || 'Something went wrong during registration.'
      });
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/customer' });
  };

  // Fullscreen loading spinner while checking active session
  if (isLoading || user) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-medium text-ink-soft">Redirecting to your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-bg relative overflow-hidden px-4 py-8">
      {/* Background graphic elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <motion.div
        variants={scaleUp}
        initial="initial"
        animate="animate"
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="inline-flex bg-primary/10 text-primary p-2.5 rounded-xl mb-2">
            <Utensils className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-ink">Plateful</h1>
          <p className="text-xs text-ink-soft mt-1">One app. Three surfaces. Infinite discovery.</p>
        </div>

        <Card className="shadow-xl border-line/60">
          {/* Main Auth Mode Toggle (Sign In vs Sign Up) */}
          <div className="flex bg-bg-alt p-1 rounded-xl mb-5 border border-line">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signin'
                  ? 'bg-bg-card text-primary shadow-sm'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-bg-card text-primary shadow-sm'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Role selector tabs */}
          <div className="mb-5">
            <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block mb-1.5">
              Select Portal Role
            </label>
            <div className="grid grid-cols-5 gap-1 bg-bg-alt p-1 rounded-lg border border-line">
              {(['customer', 'owner', 'manager', 'captain', 'superadmin'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`py-1.5 text-[10px] sm:text-xs font-semibold capitalize rounded-md transition-all cursor-pointer ${
                    role === r
                      ? 'bg-bg-card text-primary shadow-sm'
                      : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {r === 'superadmin' ? 'SaaS' : r}
                </button>
              ))}
            </div>
          </div>

          {/* SIGN IN FORM */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <Input
                label="Username / ID"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder={
                  role === 'customer' ? 'e.g. riya.eats' :
                  role === 'owner' ? 'e.g. vikram.owner' :
                  role === 'manager' ? 'e.g. priya.manager' :
                  role === 'captain' ? 'e.g. aman.captain' :
                  'e.g. admin.saas'
                }
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Default: Kuldeep@123"
              />

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={isSubmitting} className="py-2.5 flex items-center justify-center gap-2">
                <span>{isSubmitting ? 'Authenticating...' : `Access ${role.toUpperCase()} Portal`}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-line"></div>
                <span className="flex-shrink mx-3 text-[10px] font-bold text-ink-soft uppercase">Or</span>
                <div className="flex-grow border-t border-line"></div>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 border border-line rounded-lg bg-bg hover:bg-bg-alt text-ink text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          ) : (
            /* SIGN UP / REGISTRATION FORM */
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <Input
                label="Full Name"
                type="text"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                required
                placeholder="e.g. Ananya Sharma"
              />

              <Input
                label="Email Address"
                type="email"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                required
                placeholder="e.g. ananya@gmail.com"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Username"
                  type="text"
                  value={regUsername}
                  onChange={e => setRegUsername(e.target.value)}
                  required
                  placeholder="ananya.foodie"
                />

                <Input
                  label="Password"
                  type="password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={isSubmitting} className="py-2.5 mt-2 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Creating Account...' : 'Register Account'}</span>
              </Button>
            </form>
          )}
        </Card>
      </motion.div>

      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </div>
  );
};

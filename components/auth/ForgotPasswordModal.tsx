'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { motion } from 'framer-motion';
import { X, KeyRound, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim()) {
      toast({
        type: 'error',
        title: 'Input Required',
        description: 'Please enter your registered email address or username.'
      });
      return;
    }
    
    // Simulate sending 6-digit verification OTP
    setStep(2);
    setOtp('849201'); // Auto-populate simulated test OTP code
    toast({
      type: 'success',
      title: 'Verification Code Sent',
      description: `6-digit security OTP sent to ${emailOrUsername}. (Test code: 849201)`
    });
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '849201' && otp.length < 6) {
      toast({
        type: 'error',
        title: 'Invalid OTP',
        description: 'Please enter a valid 6-digit verification code.'
      });
      return;
    }
    setStep(3);
    toast({
      type: 'success',
      title: 'Code Verified',
      description: 'Identity confirmed. Please set your new password.'
    });
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        type: 'error',
        title: 'Password Mismatch',
        description: 'New password and confirmation do not match.'
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        type: 'error',
        title: 'Weak Password',
        description: 'Password must be at least 6 characters long.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrUsername,
          newPassword
        })
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (!res.ok) {
        toast({
          type: 'error',
          title: 'Reset Failed',
          description: data.error || 'Failed to update password.'
        });
        return;
      }

      toast({
        type: 'success',
        title: 'Password Reset Successful!',
        description: 'Your password has been updated. You can now log in.'
      });

      // Reset state and close
      setStep(1);
      setEmailOrUsername('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      toast({
        type: 'error',
        title: 'Error',
        description: err.message || 'Network error resetting password.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-bg-card border border-line rounded-2xl shadow-2xl p-6 relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-bg-alt text-ink-soft hover:text-ink transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            {step === 1 && <KeyRound className="w-5 h-5" />}
            {step === 2 && <ShieldCheck className="w-5 h-5" />}
            {step === 3 && <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-ink">Reset Password</h3>
            <p className="text-xs text-ink-soft">
              {step === 1 && 'Step 1 of 3: Enter your registered account'}
              {step === 2 && 'Step 2 of 3: Verify 6-digit security OTP'}
              {step === 3 && 'Step 3 of 3: Set new account password'}
            </p>
          </div>
        </div>

        {/* STEP 1: Enter Email / Username */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <Input
              label="Email Address or Username"
              type="text"
              value={emailOrUsername}
              onChange={e => setEmailOrUsername(e.target.value)}
              required
              placeholder="e.g. riya.eats or riya@gmail.com"
            />

            <Button type="submit" variant="primary" fullWidth className="py-2.5 flex items-center justify-center gap-2">
              <span>Send Verification Code</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}

        {/* STEP 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-primary font-medium">
              Code sent to: <span className="font-bold">{emailOrUsername}</span>
            </div>

            <Input
              label="6-Digit Verification Code"
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              maxLength={6}
              placeholder="Enter 6-digit code (e.g. 849201)"
            />

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                Verify Code
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: Set New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />

            <Button type="submit" variant="primary" fullWidth disabled={isSubmitting} className="py-2.5">
              <span>{isSubmitting ? 'Updating...' : 'Save New Password'}</span>
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

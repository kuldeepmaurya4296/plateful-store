'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Utensils, Shield, Smartphone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { staggerContainer, listItem, scaleUp } from '@/lib/animations';

export const LandingView: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg relative overflow-x-hidden flex flex-col justify-between">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto px-6 h-20 w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary p-2 rounded-xl">
            <Utensils className="w-6 h-6" />
          </div>
          <span className="font-serif font-bold text-2xl tracking-wide text-ink">Plateful</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/explore">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Explore Feed
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="primary" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 w-full flex-1 flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex-1 space-y-6 text-center lg:text-left"
        >
          <motion.div variants={listItem} className="inline-flex items-center gap-2 bg-primary-soft text-primary px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dine-in Experience Evolved</span>
          </motion.div>
          
          <motion.h1 variants={listItem} className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold text-ink leading-tight">
            Order with <span className="text-primary italic font-semibold">absolute</span> confidence.
          </motion.h1>
          
          <motion.p variants={listItem} className="text-base sm:text-lg text-ink-soft max-w-xl mx-auto lg:mx-0">
            A city-aware food discovery platform connecting diners, tables, and staff. See real-plating photos, scan menus, and share your table orders in real time.
          </motion.p>
          
          <motion.div variants={listItem} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link href="/explore">
              <Button variant="primary" size="lg" className="w-full sm:w-auto flex gap-2">
                <span>Start Exploring</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Merchant Portal
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={scaleUp}
          initial="initial"
          animate="animate"
          className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl"
        >
          <div className="bg-bg-card border border-line rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit mb-4">
              <Utensils className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-ink mb-2">QR Visual Menus</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              No more guessing fancy names. Scan table QR codes to view high-resolution plating guides and descriptive menu highlights.
            </p>
          </div>

          <div className="bg-bg-card border border-line rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-secondary/10 text-secondary p-3 rounded-lg w-fit mb-4">
              <Shield className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-ink mb-2">Owner Console</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              A comprehensive console for owners and managers. Keep track of table occupancy, online orders, expenses, and reviews.
            </p>
          </div>

          <div className="bg-bg-card border border-line rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-amber-accent/10 text-amber-accent p-3 rounded-lg w-fit mb-4">
              <Smartphone className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-ink mb-2">Captain Toolkit</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Mobile dashboard built for table-side service. Take orders, manage preparation updates, and settle bills in seconds.
            </p>
          </div>

          <div className="bg-bg-card border border-line rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-info-bg text-info p-3 rounded-lg w-fit mb-4">
              <Globe className="w-5.5 h-5.5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-ink mb-2">City-Aware Feed</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Discovery that automatically updates with location context, highlighting followed cafes and popular dishes near you.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-bg-alt/30 py-8 px-6 text-center text-xs text-ink-soft">
        <p>© 2026 Plateful. Built with Next.js 16, Tailwind CSS v4, and Framer Motion.</p>
      </footer>
    </div>
  );
};

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Shield, Store, Users, UtensilsCrossed, ChefHat,
  LayoutDashboard, QrCode, Search, Bell, Star,
  CreditCard, BarChart3, FileText, MessageSquare,
  Camera, Tag, Sparkles, MapPin, ClipboardList,
  Package, UserCog, Settings, LogOut, BookOpen,
  Smartphone, Monitor, Globe, Lock, Zap, Heart,
  TrendingUp, Receipt, Wallet, Eye, Share2, Image,
  CalendarDays, Table2, Printer, ShoppingCart, Megaphone,
  ChevronDown, ChevronRight, ArrowLeft, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';

import featureRegistry from '@/data/feature-registry.json';

/* ─────────────── Data Types ─────────────── */

type FeatureStatus = 'live' | 'partial' | 'planned';

interface RegistryFeature {
  id: string;
  name: string;
  description: string;
  role: string;
  category: string;
  srsRef?: string;
  status: FeatureStatus;
  evidence: string[];
}

const statusConfig: Record<FeatureStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  live:    { label: 'Live',    color: 'text-success',  bg: 'bg-success-bg', icon: <CheckCircle2 size={12} /> },
  partial: { label: 'In Progress', color: 'text-warning',  bg: 'bg-warning-bg', icon: <Clock size={12} /> },
  planned: { label: 'Planned', color: 'text-info',     bg: 'bg-info-bg',    icon: <AlertCircle size={12} /> },
};

const roleMeta: Record<string, { label: string; subtitle: string; icon: React.ReactNode; gradient: string; borderColor: string; badgeColor: string }> = {
  superadmin: {
    label: 'Superadmin',
    subtitle: 'Platform-wide oversight & tenant management',
    icon: <Shield size={22} />,
    gradient: 'from-violet-500/10 to-purple-500/10',
    borderColor: 'border-violet-200',
    badgeColor: 'bg-violet-100 text-violet-700',
  },
  owner: {
    label: 'Owner',
    subtitle: 'Full restaurant control, financials & staff management',
    icon: <Store size={22} />,
    gradient: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  manager: {
    label: 'Manager / Reception',
    subtitle: 'Day-to-day restaurant operations, menu & social management',
    icon: <ChefHat size={22} />,
    gradient: 'from-emerald-500/10 to-teal-500/10',
    borderColor: 'border-emerald-200',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  captain: {
    label: 'Captain / Waiter',
    subtitle: 'Floor operations, table-side ordering & settlement',
    icon: <UtensilsCrossed size={22} />,
    gradient: 'from-sky-500/10 to-blue-500/10',
    borderColor: 'border-sky-200',
    badgeColor: 'bg-sky-100 text-sky-700',
  },
  customer: {
    label: 'Customer',
    subtitle: 'Discovery, ordering, social engagement & dining experience',
    icon: <Heart size={22} />,
    gradient: 'from-rose-500/10 to-pink-500/10',
    borderColor: 'border-rose-200',
    badgeColor: 'bg-rose-100 text-rose-700',
  },
  platform: {
    label: 'Platform Infrastructure',
    subtitle: 'Core security, databases, payments & system architecture',
    icon: <Globe size={22} />,
    gradient: 'from-slate-500/10 to-gray-500/10',
    borderColor: 'border-slate-200',
    badgeColor: 'bg-slate-100 text-slate-700',
  }
};

/* ─────────────── Components ─────────────── */

function StatusBadge({ status }: { status: FeatureStatus }) {
  const c = statusConfig[status] || statusConfig.planned;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.bg} ${c.color} whitespace-nowrap`}>
      {c.icon}
      {c.label}
    </span>
  );
}

function FeatureRow({ feature }: { feature: RegistryFeature }) {
  return (
    <div className="flex items-start gap-3 py-3 px-2 border-b border-line/50 last:border-b-0 group hover:bg-primary-soft/20 rounded-lg transition-colors duration-200">
      <div className="mt-0.5 text-ink-soft group-hover:text-primary transition-colors shrink-0">
        <Zap size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-ink">{feature.name}</span>
          <StatusBadge status={feature.status} />
          {feature.srsRef && (
            <span className="text-[10px] font-mono text-ink-soft bg-bg-alt px-1.5 py-0.5 rounded">
              {feature.srsRef}
            </span>
          )}
        </div>
        <p className="text-xs text-ink-soft mt-0.5 leading-relaxed">{feature.description}</p>
        
        {feature.evidence && feature.evidence.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-1.5">
            {feature.evidence.map((ev, idx) => (
              <span key={idx} className="text-[10px] font-mono bg-bg-alt/70 text-ink-soft px-1.5 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 size={9} className="text-success" />
                {ev}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RoleCard({ roleId, features }: { roleId: string; features: RegistryFeature[] }) {
  const [expanded, setExpanded] = useState(false);
  const meta = roleMeta[roleId] || roleMeta.platform;

  const categoriesMap = new Map<string, RegistryFeature[]>();
  for (const f of features) {
    const list = categoriesMap.get(f.category) || [];
    list.push(f);
    categoriesMap.set(f.category, list);
  }

  const live = features.filter(f => f.status === 'live').length;
  const partial = features.filter(f => f.status === 'partial').length;
  const planned = features.filter(f => f.status === 'planned').length;

  return (
    <motion.div
      layout
      className={`bg-bg-card rounded-xl border ${meta.borderColor} shadow-sm overflow-hidden`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full text-left px-5 py-4 bg-gradient-to-br ${meta.gradient} transition-colors`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${meta.badgeColor}`}>
              {meta.icon}
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-ink">{meta.label}</h3>
              <p className="text-xs text-ink-soft mt-0.5">{meta.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-success font-semibold">
                <CheckCircle2 size={10} /> {live}
              </span>
              <span className="flex items-center gap-1 text-warning font-semibold">
                <Clock size={10} /> {partial}
              </span>
              <span className="flex items-center gap-1 text-info font-semibold">
                <AlertCircle size={10} /> {planned}
              </span>
            </div>
            <div className="text-[11px] font-bold text-ink-soft bg-bg-card/80 px-2 py-1 rounded-full">
              {features.length} features
            </div>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={18} className="text-ink-soft" />
            </motion.div>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 border-t border-line/30 space-y-4">
              {Array.from(categoriesMap.entries()).map(([catTitle, catFeatures]) => (
                <div key={catTitle}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-2">
                    {catTitle}
                  </h4>
                  <div className="pl-1">
                    {catFeatures.map((f) => (
                      <FeatureRow key={f.id} feature={f} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────── Main Docs Page ─────────────── */

export default function DocsPage() {
  const summary = featureRegistry.summary;
  const features = featureRegistry.features as RegistryFeature[];

  const roleKeys = ['superadmin', 'owner', 'manager', 'captain', 'customer', 'platform'];
  const formattedDate = new Date(featureRegistry.generatedAt).toLocaleString();

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-accent/5" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to Plateful
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                Live Codebase Feature Registry
              </h1>
              <p className="text-ink-soft mt-2 text-sm sm:text-base max-w-lg leading-relaxed">
                Auto-scanned feature inventory generated by <code className="text-xs bg-bg-alt px-1.5 py-0.5 rounded font-mono">npm run docs:update</code> tracking exact codebase state.
              </p>
              <p className="text-[11px] font-mono text-ink-soft mt-2">
                Last Scanned: {formattedDate}
              </p>
            </div>

            {/* Global stats */}
            <div className="glass rounded-xl px-5 py-3 flex items-center gap-5 shrink-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-ink font-serif">{summary.total}</p>
                <p className="text-[10px] text-ink-soft uppercase tracking-wider">Total</p>
              </div>
              <div className="w-px h-8 bg-line" />
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-success">{summary.live}</p>
                  <p className="text-[10px] text-ink-soft uppercase tracking-wider">Live</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-warning">{summary.partial}</p>
                  <p className="text-[10px] text-ink-soft uppercase tracking-wider">In Progress</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-info">{summary.planned}</p>
                  <p className="text-[10px] text-ink-soft uppercase tracking-wider">Planned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-ink-soft uppercase tracking-wider">Status Legend:</span>
            {Object.entries(statusConfig).map(([key, val]) => (
              <span key={key} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${val.bg} ${val.color} font-medium`}>
                {val.icon} {val.label}
              </span>
            ))}
          </div>
        </div>

        {/* Roles list */}
        <div className="space-y-4 mb-12">
          {roleKeys.map((rk) => {
            const roleFeatures = features.filter(f => f.role === rk);
            if (roleFeatures.length === 0) return null;
            return <RoleCard key={rk} roleId={rk} features={roleFeatures} />;
          })}
        </div>

        {/* SaaS Subscription Plans */}
        <section className="mb-12">
          <h2 className="font-serif text-xl font-bold text-ink mb-5 flex items-center gap-2">
            <CreditCard size={20} className="text-primary" />
            SaaS Subscription Plans
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-line rounded-xl overflow-hidden bg-bg-card">
              <thead>
                <tr className="bg-bg-alt text-left">
                  <th className="py-3 px-4 font-semibold text-ink">Feature</th>
                  <th className="py-3 px-4 font-semibold text-center">Basic (₹1,999)</th>
                  <th className="py-3 px-4 font-semibold text-center">Premium (₹4,999)</th>
                  <th className="py-3 px-4 font-semibold text-center">Enterprise (₹9,999)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {[
                  { feat: 'Table Grid & Status', b: true, p: true, e: true },
                  { feat: 'CRUD Menu Editor', b: true, p: true, e: true },
                  { feat: 'Order Alerts & Pipeline', b: true, p: true, e: true },
                  { feat: 'Payment Settlements', b: true, p: true, e: true },
                  { feat: 'Customer Stories', b: false, p: true, e: true },
                  { feat: 'Discount Campaigns', b: false, p: true, e: true },
                  { feat: "Today's Special Module", b: false, p: true, e: true },
                  { feat: 'Interactive Table Layout', b: false, p: true, e: true },
                  { feat: 'Raw Material Forecasting', b: false, p: false, e: true },
                  { feat: 'Drawer Cash Audits', b: false, p: false, e: true },
                ].map(({ feat, b, p, e }) => (
                  <tr key={feat} className="hover:bg-primary-soft/10 transition-colors">
                    <td className="py-2.5 px-4 text-ink">{feat}</td>
                    {[b, p, e].map((v, i) => (
                      <td key={i} className="py-2.5 px-4 text-center">
                        {v
                          ? <CheckCircle2 size={16} className="text-success mx-auto" />
                          : <Lock size={14} className="text-ink-soft/40 mx-auto" />
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-soft">
          <p>Plateful v0.1.0 — Codebase Auto-Docs Registry</p>
          <p className="flex items-center gap-1">
            Built with <Heart size={12} className="text-primary" /> using Next.js, React &amp; TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}

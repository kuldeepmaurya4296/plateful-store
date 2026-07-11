'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { scaleUp } from '@/lib/animations';

interface SaaSUpgradeGateProps {
  currentPlan: 'Basic' | 'Premium' | 'Enterprise';
  requiredPlan: 'Premium' | 'Enterprise';
  featureName: string;
  children: React.ReactNode;
}

export const SaaSUpgradeGate: React.FC<SaaSUpgradeGateProps> = ({
  currentPlan,
  requiredPlan,
  featureName,
  children
}) => {
  // Plan hierarchies
  const planLevels = { Basic: 0, Premium: 1, Enterprise: 2 };
  const hasAccess = planLevels[currentPlan] >= planLevels[requiredPlan];

  if (hasAccess) {
    return <>{children}</>;
  }

  const planPricing = {
    Premium: '₹4,999/mo',
    Enterprise: '₹9,999/mo'
  };

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {/* Blurred background of the feature */}
      <div className="absolute inset-0 filter blur-md pointer-events-none opacity-40 select-none overflow-hidden">
        {children}
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-6 bg-bg/20 z-20">
        <motion.div
          variants={scaleUp}
          initial="initial"
          animate="animate"
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-primary/20 bg-bg-card/90 backdrop-blur-md text-center p-8 space-y-5">
            <div className="w-14 h-14 bg-primary-soft text-primary rounded-full flex items-center justify-center mx-auto border border-primary/10">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-center gap-1.5 items-center">
                <Badge variant="danger" className="uppercase tracking-wider text-[9px] font-bold py-0.5 px-2">
                  Feature Locked
                </Badge>
                <Badge variant="primary" className="uppercase tracking-wider text-[9px] font-bold py-0.5 px-2">
                  Requires {requiredPlan}
                </Badge>
              </div>

              <h3 className="text-lg font-serif font-extrabold text-ink leading-tight">
                {featureName}
              </h3>
              
              <p className="text-xs text-ink-soft leading-relaxed max-w-xs mx-auto">
                Your restaurant is currently on the <span className="font-bold text-ink">{currentPlan} Plan</span>. Upgrade to unlock advanced marketing and automation.
              </p>
            </div>

            <div className="bg-bg p-4 rounded-xl border border-line flex justify-between items-center text-xs">
              <div className="text-left">
                <span className="font-semibold text-ink-soft block">Upgrade to {requiredPlan}</span>
                <span className="text-[10px] text-ink-soft">Instantly unlocks this feature</span>
              </div>
              <span className="font-serif font-bold text-primary text-base">
                {planPricing[requiredPlan]}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                fullWidth
                size="sm"
                className="flex gap-1.5 justify-center items-center text-xs border-line bg-bg hover:bg-bg-alt"
                onClick={() => alert('SaaS pricing details can be reviewed in the Superadmin Portal.')}
              >
                <HelpCircle className="w-4 h-4 text-ink-soft" />
                <span>Plan Details</span>
              </Button>
              
              <Button
                variant="primary"
                fullWidth
                size="sm"
                className="flex gap-1.5 justify-center items-center text-xs"
                onClick={() => alert(`A request to upgrade your restaurant subscription to ${requiredPlan} Plan has been dispatched to the platform admin. Please check again shortly!`)}
              >
                <Sparkles className="w-4 h-4" />
                <span>Request Upgrade</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

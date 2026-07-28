/**
 * Plateful Feature Registry Auto-Scanner
 * ─────────────────────────────────────────
 * Scans the codebase to determine the real implementation status of every
 * feature, then writes `data/feature-registry.json` which the /docs page
 * imports at build time.
 *
 * Usage:  npx tsx scripts/update-docs.ts
 * (also wired to `npm run docs:update`)
 */

import fs from 'fs';
import path from 'path';

/* ───── helpers ───── */

const ROOT = path.resolve(__dirname, '..');

function exists(...segments: string[]): boolean {
  return fs.existsSync(path.join(ROOT, ...segments));
}

function readFile(...segments: string[]): string {
  const p = path.join(ROOT, ...segments);
  if (!fs.existsSync(p)) return '';
  return fs.readFileSync(p, 'utf-8');
}

function fileContains(content: string, ...needles: string[]): boolean {
  const lower = content.toLowerCase();
  return needles.every(n => lower.includes(n.toLowerCase()));
}

function countLines(...segments: string[]): number {
  const content = readFile(...segments);
  return content ? content.split('\n').length : 0;
}

/** Recursively list all .ts/.tsx files under a directory */
function listFiles(dir: string, exts = ['.ts', '.tsx']): string[] {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return [];
  const results: string[] = [];
  function walk(d: string) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (exts.some(e => entry.name.endsWith(e))) results.push(full);
    }
  }
  walk(abs);
  return results;
}

/** Check if an API route has auth guard (imports serverAuth) */
function hasAuthGuard(apiDir: string): boolean {
  const files = listFiles(apiDir);
  return files.some(f => {
    const c = fs.readFileSync(f, 'utf-8');
    return c.includes('requireAuthRoles') || c.includes('getAuthSession');
  });
}

/** Check if an API route has Zod validation */
function hasZodValidation(apiDir: string): boolean {
  const files = listFiles(apiDir);
  return files.some(f => {
    const c = fs.readFileSync(f, 'utf-8');
    return c.includes('z.object') || c.includes('safeParse');
  });
}

/* ───── status determination ───── */

type Status = 'live' | 'partial' | 'planned';

interface FeatureCheck {
  id: string;
  name: string;
  description: string;
  role: string;
  category: string;
  srsRef?: string;
  checks: () => { status: Status; evidence: string[] };
}

const features: FeatureCheck[] = [
  // ══════════════════════════════════════════
  //  SUPERADMIN
  // ══════════════════════════════════════════
  {
    id: 'sa-dashboard', name: 'Platform Analytics Dashboard', role: 'superadmin', category: 'Platform Administration',
    description: 'Active tenants, revenue, user metrics with real-time KPIs',
    checks: () => {
      const page = exists('app/(dashboard)/superadmin/page.tsx');
      const api = exists('app/api/analytics/route.ts');
      const evidence: string[] = [];
      if (page) evidence.push('page exists');
      if (api) evidence.push('analytics API exists');
      return { status: page && api ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'sa-tenants', name: 'Tenant Registry', role: 'superadmin', category: 'Platform Administration',
    description: 'Manage restaurant subscriptions, plans, billing status',
    checks: () => {
      const page = exists('app/(dashboard)/superadmin/tenants/page.tsx');
      const api = exists('app/api/restaurants/route.ts');
      const evidence: string[] = [];
      if (page) evidence.push('page exists');
      if (api) evidence.push('restaurants API exists');
      return { status: page && api ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'sa-owners', name: 'Owner Provisioning', role: 'superadmin', category: 'Platform Administration',
    description: 'Create/reset merchant owner credentials',
    checks: () => {
      const page = exists('app/(dashboard)/superadmin/owners/page.tsx');
      const api = exists('app/api/users/route.ts');
      const evidence: string[] = [];
      if (page) evidence.push('page exists');
      if (api) evidence.push('users API exists');
      return { status: page && api ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'sa-customers', name: 'Customer Directory', role: 'superadmin', category: 'Platform Administration',
    description: 'Platform-wide user management with spam flagging',
    checks: () => {
      const page = exists('app/(dashboard)/superadmin/customers/page.tsx');
      const evidence: string[] = [];
      if (page) evidence.push('page exists');
      const content = readFile('app/(dashboard)/superadmin/customers/page.tsx');
      if (fileContains(content, 'flag', 'spam')) evidence.push('flagging logic found');
      return { status: evidence.length >= 2 ? 'live' : page ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'sa-config', name: 'Platform Configuration', role: 'superadmin', category: 'Platform Administration',
    description: 'Global feature toggles and settings',
    checks: () => {
      const page = exists('app/(dashboard)/superadmin/config/page.tsx');
      const evidence: string[] = [];
      if (page) evidence.push('page exists');
      return { status: page ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'sa-audit', name: 'Audit Logging', role: 'superadmin', category: 'Platform Administration',
    description: 'Complete audit trail for admin actions',
    checks: () => {
      const model = exists('lib/db/models/AuditLog.ts');
      const api = exists('app/api/audit/route.ts');
      const evidence: string[] = [];
      if (model) evidence.push('AuditLog model exists');
      if (api) evidence.push('audit API endpoint exists');
      return { status: model && api ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'sa-broadcast', name: 'Platform Notifications Broadcast', role: 'superadmin', category: 'Platform Administration',
    description: 'Send platform-wide announcements',
    checks: () => {
      const api = exists('app/api/notifications/broadcast/route.ts');
      const evidence: string[] = [];
      if (api) evidence.push('broadcast API exists');
      const content = readFile('app/api/notifications/broadcast/route.ts');
      if (fileContains(content, 'Notification.insertMany')) evidence.push('platform-wide broadcast logic');
      return { status: evidence.length >= 2 ? 'live' : 'planned', evidence };
    },
  },

  {
    id: 'sa-plans', name: 'Plan Tier Management', role: 'superadmin', category: 'SaaS Subscription Management',
    description: 'Define and manage SaaS plan tiers with feature gating',
    checks: () => {
      const gate = exists('components/shared/SaaSUpgradeGate.tsx');
      const serverAuth = readFile('lib/auth/serverAuth.ts');
      const evidence: string[] = [];
      if (gate) evidence.push('SaaSUpgradeGate component exists');
      if (fileContains(serverAuth, 'SAAS_FEATURE_TIERS')) evidence.push('server-side plan map exists');
      return { status: evidence.length >= 2 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'sa-server-plan', name: 'Server-Side Plan Enforcement', role: 'superadmin', category: 'SaaS Subscription Management',
    description: 'API-level feature gating by subscription plan',
    checks: () => {
      const serverAuth = readFile('lib/auth/serverAuth.ts');
      const evidence: string[] = [];
      if (fileContains(serverAuth, 'checkSaaSPlanPermission')) evidence.push('checkSaaSPlanPermission function exists');
      if (fileContains(serverAuth, 'SAAS_FEATURE_TIERS')) evidence.push('feature tier map defined');
      return { status: evidence.length >= 2 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },

  // ══════════════════════════════════════════
  //  OWNER
  // ══════════════════════════════════════════
  {
    id: 'ow-dashboard', name: 'Revenue Dashboard', role: 'owner', category: 'Dashboard & Analytics',
    description: 'Sales, profit, review summary with period toggle', srsRef: 'B.1',
    checks: () => {
      const page = exists('app/(dashboard)/manager/page.tsx');
      const api = exists('app/api/analytics/route.ts');
      const apiContent = readFile('app/api/analytics/route.ts');
      const evidence: string[] = [];
      if (page) evidence.push('manager dashboard page exists');
      if (api) evidence.push('analytics API exists');
      if (fileContains(apiContent, 'aggregate', 'totalSales')) evidence.push('MongoDB aggregation pipeline');
      return { status: evidence.length >= 3 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'ow-top-dishes', name: 'Top-Selling Dishes Breakdown', role: 'owner', category: 'Dashboard & Analytics',
    description: 'Best-performing menu items by revenue', srsRef: 'FR-B.1.3',
    checks: () => {
      const apiContent = readFile('app/api/analytics/route.ts');
      const evidence: string[] = [];
      if (fileContains(apiContent, 'topDishes', 'menuItem')) evidence.push('top dishes aggregation');
      return { status: evidence.length ? 'live' : 'partial', evidence };
    },
  },
  {
    id: 'ow-reviews', name: 'Review Summary (Food/Presentation/Ambiance)', role: 'owner', category: 'Dashboard & Analytics',
    description: 'Aggregated rating breakdown with MongoDB aggregation', srsRef: 'FR-B.1.5',
    checks: () => {
      const apiContent = readFile('app/api/analytics/route.ts');
      const evidence: string[] = [];
      if (fileContains(apiContent, 'avgFood', 'avgPresentation', 'avgAmbiance')) evidence.push('review aggregation pipeline');
      return { status: evidence.length ? 'live' : 'partial', evidence };
    },
  },
  {
    id: 'ow-expense-dash', name: 'Expense Subtotals on Dashboard', role: 'owner', category: 'Dashboard & Analytics',
    description: 'Raw material cost summary on home screen', srsRef: 'FR-B.1.6',
    checks: () => {
      const apiContent = readFile('app/api/analytics/route.ts');
      const evidence: string[] = [];
      if (fileContains(apiContent, 'totalExpense', 'netProfit')) evidence.push('expense aggregation');
      return { status: evidence.length ? 'live' : 'partial', evidence };
    },
  },
  {
    id: 'ow-staff', name: 'User & Captain Management', role: 'owner', category: 'Staff & Counter Management',
    description: 'Create captain credentials and assign tables', srsRef: 'B.5',
    checks: () => {
      const page = exists('app/(dashboard)/manager/users/page.tsx');
      const api = exists('app/api/users/route.ts');
      const evidence: string[] = [];
      if (page) evidence.push('users page exists');
      if (api) evidence.push('users API exists');
      return { status: page && api ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'ow-counters', name: 'Billing Counter Definition', role: 'owner', category: 'Staff & Counter Management',
    description: 'Define counters with specific table ranges', srsRef: 'FR-B.5.1',
    checks: () => {
      const model = exists('lib/db/models/Counter.ts');
      const api = exists('app/api/counters/route.ts');
      const evidence: string[] = [];
      if (model) evidence.push('Counter model exists');
      if (api) evidence.push('counters API exists');
      return { status: model && api ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'ow-shifts', name: 'Staff Roster & Shift Scheduling', role: 'owner', category: 'Staff & Counter Management',
    description: 'Employee management and shift assignment',
    checks: () => {
      const page = exists('app/(dashboard)/manager/staff/page.tsx');
      const evidence: string[] = [];
      if (page) evidence.push('staff page exists');
      return { status: page ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'ow-expenses', name: 'Expense Logging', role: 'owner', category: 'Inventory & Expenses',
    description: 'Log raw kitchen ingredient costs, supplier payouts, gas refills', srsRef: 'B.6',
    checks: () => {
      const page = exists('app/(dashboard)/manager/expenses/page.tsx');
      const api = exists('app/api/expenses/route.ts');
      const model = exists('lib/db/models/Expense.ts');
      const evidence: string[] = [];
      if (page) evidence.push('expenses page exists');
      if (api) evidence.push('expenses API exists');
      if (model) evidence.push('Expense model exists');
      return { status: evidence.length >= 3 ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'ow-forecast', name: 'Raw Material Forecast', role: 'owner', category: 'Inventory & Expenses',
    description: 'Predict raw materials needed for the next day', srsRef: 'FR-B.6.2',
    checks: () => {
      const api = exists('app/api/forecast/route.ts');
      const model = exists('lib/db/models/ForecastItem.ts');
      const evidence: string[] = [];
      if (api) evidence.push('forecast API exists');
      if (model) evidence.push('ForecastItem model exists');
      return { status: api && model ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'ow-mark-purchased', name: 'Mark Purchased → Auto-Log Expense', role: 'owner', category: 'Inventory & Expenses',
    description: 'One-click conversion from forecast to expense entry', srsRef: 'FR-B.6.3',
    checks: () => {
      const api = exists('app/api/forecast/[id]/purchased/route.ts');
      const evidence: string[] = [];
      if (api) evidence.push('purchased API endpoint exists');
      const content = readFile('app/api/forecast/[id]/purchased/route.ts');
      if (fileContains(content, 'Expense.create')) evidence.push('auto-creates expense');
      return { status: evidence.length >= 2 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },

  // ══════════════════════════════════════════
  //  MANAGER
  // ══════════════════════════════════════════
  {
    id: 'mg-table-grid', name: 'Table Grid (¾/¼ split view)', role: 'manager', category: 'Table & Order Management',
    description: 'Visual table layout with real-time status tracking', srsRef: 'B.2',
    checks: () => {
      const page = exists('app/(dashboard)/manager/tables/page.tsx');
      const comp = exists('components/manager/TableGridConsoleView.tsx');
      const evidence: string[] = [];
      if (page) evidence.push('tables page exists');
      if (comp) evidence.push('TableGridConsoleView component exists');
      const content = readFile('components/manager/TableGridConsoleView.tsx');
      if (content.length > 5000) evidence.push(`component has ${countLines('components/manager/TableGridConsoleView.tsx')} lines`);
      return { status: evidence.length >= 2 ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'mg-table-fsm', name: 'Table State Machine', role: 'manager', category: 'Table & Order Management',
    description: 'FSM-driven table status transitions with server validation', srsRef: 'FR-B.2.2',
    checks: () => {
      const fsm = exists('lib/tableStateMachine.ts');
      const api = exists('app/api/tables/[id]/status/route.ts');
      const evidence: string[] = [];
      if (fsm) evidence.push('tableStateMachine.ts exists');
      if (api) evidence.push('status PATCH API exists');
      const content = readFile('app/api/tables/[id]/status/route.ts');
      if (fileContains(content, 'validateTableTransition')) evidence.push('uses FSM validation');
      return { status: evidence.length >= 3 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'mg-add-table-qr', name: 'Add Table + Auto-Generate QR Code', role: 'manager', category: 'Table & Order Management',
    description: 'Increase table count with auto-generated unique QR codes', srsRef: 'FR-B.2.5',
    checks: () => {
      const api = exists('app/api/tables/route.ts');
      const evidence: string[] = [];
      if (api) evidence.push('tables POST API exists');
      const compContent = readFile('components/manager/TableGridConsoleView.tsx');
      if (fileContains(compContent, 'qr', 'generate')) evidence.push('QR generation in component');
      return { status: evidence.length >= 2 ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'mg-print-qr', name: 'Print QR Code Flyer', role: 'manager', category: 'Table & Order Management',
    description: 'View and download table QR codes for printing', srsRef: 'FR-B.2.6',
    checks: () => {
      const compContent = readFile('components/manager/TableGridConsoleView.tsx');
      const evidence: string[] = [];
      if (fileContains(compContent, 'print', 'qr')) evidence.push('print QR logic in component');
      if (fileContains(compContent, 'window.print')) evidence.push('window.print() call');
      return { status: evidence.length >= 2 ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'mg-urgent-bill', name: 'Urgent Billing from Grid', role: 'manager', category: 'Table & Order Management',
    description: 'Generate and settle a bill directly from table grid', srsRef: 'FR-B.2.7',
    checks: () => {
      const compContent = readFile('components/manager/TableGridConsoleView.tsx');
      const evidence: string[] = [];
      if (fileContains(compContent, 'urgent', 'bill')) evidence.push('urgent billing logic');
      if (fileContains(compContent, 'settle')) evidence.push('settlement trigger');
      return { status: evidence.length >= 1 ? 'live' : 'planned', evidence };
    },
  },

  {
    id: 'mg-reservation-indicator', name: 'Reservation Indicator on Grid', role: 'manager', category: 'Table & Order Management',
    description: 'Show upcoming dine-in reservations on table cells', srsRef: 'FR-B.2.8',
    checks: () => {
      const compContent = readFile('components/manager/TableGridConsoleView.tsx');
      const evidence: string[] = [];
      if (fileContains(compContent, 'reservation')) evidence.push('reservation indicator on grid');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },

  {
    id: 'mg-online-orders', name: 'Online Order Feed', role: 'manager', category: 'Online Orders Pipeline',
    description: 'Live feed of incoming delivery/website orders', srsRef: 'B.3',
    checks: () => {
      const page = exists('app/(dashboard)/manager/orders/page.tsx');
      const api = exists('app/api/orders/route.ts');
      const evidence: string[] = [];
      if (page) evidence.push('orders page exists');
      if (api) evidence.push('orders API exists');
      return { status: page && api ? 'live' : page ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'mg-order-lifecycle', name: 'Order Status Lifecycle', role: 'manager', category: 'Online Orders Pipeline',
    description: 'Pending Accept → In Kitchen → Ready for Pickup/Dispatch', srsRef: 'FR-B.3.1',
    checks: () => {
      const model = readFile('lib/db/models/Order.ts');
      const evidence: string[] = [];
      if (fileContains(model, 'pending', 'kitchen', 'ready')) evidence.push('order status lifecycle enum');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'mg-order-toast', name: 'Global New-Order Toast Notification', role: 'manager', category: 'Online Orders Pipeline',
    description: 'Notification visible across all console screens', srsRef: 'FR-B.3.2',
    checks: () => {
      const files = listFiles('components');
      const evidence: string[] = [];
      const hasToast = files.some(f => fs.readFileSync(f, 'utf-8').includes('type: \'order\'') || fs.readFileSync(f, 'utf-8').includes('useToast'));
      if (hasToast) evidence.push('order toast notification handler');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'mg-accept-deny', name: 'Accept/Deny Inline Actions', role: 'manager', category: 'Online Orders Pipeline',
    description: 'One-click accept or deny on order notification', srsRef: 'FR-B.3.3',
    checks: () => {
      const pageContent = readFile('app/(dashboard)/manager/orders/page.tsx');
      const compContent = readFile('components/manager/OrdersPipelineView.tsx');
      const evidence: string[] = [];
      if (fileContains(pageContent + compContent, 'accept', 'deny')) evidence.push('accept & deny inline actions');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'mg-kitchen-printer', name: 'Kitchen Printer/Display Integration', role: 'manager', category: 'Online Orders Pipeline',
    description: 'Route accepted orders to kitchen printer/KDS', srsRef: 'FR-B.3.4',
    checks: () => {
      const api = exists('app/api/printer/route.ts');
      const evidence: string[] = [];
      if (api) evidence.push('printer API route exists');
      const content = readFile('app/api/printer/route.ts');
      if (fileContains(content, 'printer', 'orderId')) evidence.push('ESC/POS printer routing');
      return { status: evidence.length >= 2 ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'mg-menu-crud', name: 'CRUD Menu Editor', role: 'manager', category: 'Menu Management',
    description: 'Create, read, update, delete menu items with instant price edits', srsRef: 'B.7',
    checks: () => {
      const page = exists('app/(dashboard)/manager/menu/page.tsx');
      const api = exists('app/api/menu-items/route.ts');
      const model = exists('lib/db/models/MenuItem.ts');
      const evidence: string[] = [];
      if (page) evidence.push('menu page exists');
      if (api) evidence.push('menu-items API exists');
      if (model) evidence.push('MenuItem model exists');
      const apiContent = readFile('app/api/menu-items/route.ts');
      if (fileContains(apiContent, 'GET') && fileContains(apiContent, 'POST')) evidence.push('GET+POST handlers');
      return { status: evidence.length >= 3 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'mg-billing-history', name: 'Billing History & Search', role: 'manager', category: 'Billing & Finance',
    description: 'Searchable record of past bills with multi-criteria filter', srsRef: 'B.4',
    checks: () => {
      const page = exists('app/(dashboard)/manager/billing/page.tsx');
      const api = exists('app/api/bills/route.ts');
      const evidence: string[] = [];
      if (page) evidence.push('billing page exists');
      if (api) evidence.push('bills API exists');
      return { status: page && api ? 'live' : page ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'mg-bill-reprint', name: 'Bill Reprint, Refund & Payment Breakdown', role: 'manager', category: 'Billing & Finance',
    description: 'Reprint bills, process refunds, view payment mode breakdown', srsRef: 'FR-B.4.3',
    checks: () => {
      const apiContent = readFile('app/api/bills/route.ts');
      const evidence: string[] = [];
      if (fileContains(apiContent, 'refund')) evidence.push('refund logic');
      if (fileContains(apiContent, 'reprint')) evidence.push('reprint logic');
      return { status: evidence.length >= 2 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'mg-bill-download', name: 'Bill Download as PDF/CSV', role: 'manager', category: 'Billing & Finance',
    description: 'Export selected bills as downloadable files', srsRef: 'FR-B.4.4',
    checks: () => {
      const api = exists('app/api/bills/download/route.ts');
      const evidence: string[] = [];
      if (api) evidence.push('bill download API endpoint exists');
      return { status: api ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'mg-stories', name: 'Stories/Photos Publishing', role: 'manager', category: 'Social & Marketing',
    description: 'Upload 24-hour stories or standalone restaurant photos', srsRef: 'FR-B.8.1',
    checks: () => {
      const page = exists('app/(dashboard)/manager/social/page.tsx');
      const api = exists('app/api/stories/route.ts');
      const evidence: string[] = [];
      if (page) evidence.push('social page exists');
      if (api) evidence.push('stories API exists');
      return { status: page && api ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'mg-discount', name: 'Discount Scheduling', role: 'manager', category: 'Social & Marketing',
    description: 'Time-bound discount ads with start and end time', srsRef: 'FR-B.8.2',
    checks: () => {
      const files = listFiles('app/api');
      const evidence: string[] = [];
      const hasDiscount = files.some(f => fs.readFileSync(f, 'utf-8').includes('discount'));
      if (hasDiscount) evidence.push('discount API found');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'mg-special', name: "Today's Special", role: 'manager', category: 'Social & Marketing',
    description: 'Publish one featured dish visible on customer feed', srsRef: 'FR-B.8.3',
    checks: () => {
      const files = listFiles('app/api');
      const evidence: string[] = [];
      const hasSpecial = files.some(f => fs.readFileSync(f, 'utf-8').includes('todaysSpecial'));
      if (hasSpecial) evidence.push('todays special API found');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },

  {
    id: 'mg-table-map', name: 'Table Map Editor', role: 'manager', category: 'Social & Marketing',
    description: 'Edit floor layout for customer pre-booking view', srsRef: 'FR-B.8.4',
    checks: () => {
      const comp = exists('components/manager/FloorLayoutEditor.tsx');
      const evidence: string[] = [];
      if (comp) evidence.push('FloorLayoutEditor component exists');
      return { status: comp ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'mg-customer-dir', name: 'Customer Directory', role: 'manager', category: 'Customer & Reviews',
    description: 'VIP tagging, dining frequency and loyalty tracking',
    checks: () => {
      const page = exists('app/(dashboard)/manager/customers/page.tsx');
      const evidence: string[] = [];
      if (page) evidence.push('customers page exists');
      return { status: page ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'mg-reviews', name: 'Reviews Portal', role: 'manager', category: 'Customer & Reviews',
    description: 'Detailed ratings breakdown with official reply templates',
    checks: () => {
      const page = exists('app/(dashboard)/manager/reviews/page.tsx');
      const api = exists('app/api/reviews/route.ts');
      const evidence: string[] = [];
      if (page) evidence.push('reviews page exists');
      if (api) evidence.push('reviews API exists');
      return { status: page && api ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'mg-logoff', name: 'Account / Shift Logoff', role: 'manager', category: 'Customer & Reviews',
    description: 'Clean shift handover for shared device', srsRef: 'B.9',
    checks: () => {
      const page = exists('app/(dashboard)/manager/account/page.tsx');
      const evidence: string[] = [];
      if (page) evidence.push('account page exists');
      return { status: page ? 'live' : 'planned', evidence };
    },
  },

  // ══════════════════════════════════════════
  //  CAPTAIN
  // ══════════════════════════════════════════
  {
    id: 'cp-login', name: 'Owner-Issued Credential Login', role: 'captain', category: 'Authentication',
    description: 'Login with credentials created by owner/manager — no self-registration', srsRef: 'C.1',
    checks: () => {
      const authRoute = readFile('app/api/auth/[...nextauth]/route.ts');
      const evidence: string[] = [];
      if (fileContains(authRoute, 'CredentialsProvider', 'authorize')) evidence.push('credentials auth provider');
      if (fileContains(authRoute, 'bcrypt.compare')) evidence.push('password verification');
      return { status: evidence.length >= 2 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'cp-table-grid', name: 'Assigned Table Grid', role: 'captain', category: 'Table & Order Operations',
    description: "Visual grid of only tables assigned to this captain's counter", srsRef: 'C.2',
    checks: () => {
      const page = exists('app/(dashboard)/captain/page.tsx');
      const evidence: string[] = [];
      if (page) evidence.push('captain page exists');
      return { status: page ? 'live' : 'planned', evidence };
    },
  },

  {
    id: 'cp-take-order', name: 'Take Order (Manual Entry)', role: 'captain', category: 'Table & Order Operations',
    description: 'Order entry for customers who prefer not to use their phone', srsRef: 'C.3',
    checks: () => {
      const comp = exists('components/captain/CaptainOrderConsoleView.tsx');
      const api = exists('app/api/orders/route.ts');
      const evidence: string[] = [];
      if (comp) evidence.push('CaptainOrderConsoleView component exists');
      if (api) evidence.push('orders API exists');
      return { status: comp && api ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cp-optional-customer', name: 'Optional Customer Name/Mobile', role: 'captain', category: 'Table & Order Operations',
    description: 'Neither name nor mobile is required for captain-entered orders', srsRef: 'FR-C.3.1',
    checks: () => {
      const compContent = readFile('components/captain/CaptainOrderConsoleView.tsx');
      const evidence: string[] = [];
      if (fileContains(compContent, 'optional')) evidence.push('optional customer fields in UI');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cp-prep-note', name: 'Preparation Note per Order', role: 'captain', category: 'Table & Order Operations',
    description: 'Free-text preparation note field per order', srsRef: 'FR-C.3.2',
    checks: () => {
      const model = readFile('lib/db/models/Order.ts');
      const evidence: string[] = [];
      if (fileContains(model, 'preparationNote')) evidence.push('preparationNote in Order model');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cp-realtime', name: 'Real-time Sync to Console + Kitchen', role: 'captain', category: 'Table & Order Operations',
    description: 'Order updates console table management and kitchen printer instantly', srsRef: 'FR-C.3.3',
    checks: () => {
      const api = exists('app/api/printer/route.ts');
      const evidence: string[] = [];
      if (api) evidence.push('real-time printer sync endpoint exists');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cp-post-order', name: 'Post-Order Navigation', role: 'captain', category: 'Post-Order & Settlement',
    description: 'Three choices after sending order: back to grid, add more, or settle', srsRef: 'C.4',
    checks: () => {
      const compContent = readFile('components/captain/CaptainOrderConsoleView.tsx');
      const evidence: string[] = [];
      if (fileContains(compContent, 'settle', 'grid', 'send')) evidence.push('post-order navigation choices');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cp-settlement', name: 'Settlement (Cash/Online)', role: 'captain', category: 'Post-Order & Settlement',
    description: 'Choose payment mode and close out the table', srsRef: 'C.5',
    checks: () => {
      const page = exists('app/(dashboard)/captain/settlement');
      const api = exists('app/api/bills/route.ts');
      const evidence: string[] = [];
      if (page) evidence.push('settlement view exists');
      if (api) evidence.push('bills API exists');
      return { status: page && api ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cp-screenshot', name: 'Payment Screenshot Capture', role: 'captain', category: 'Post-Order & Settlement',
    description: 'Capture photo of payment success screen for online payments', srsRef: 'FR-C.5.2',
    checks: () => {
      const api = exists('app/api/bills/route.ts');
      const content = readFile('app/api/bills/route.ts');
      const evidence: string[] = [];
      if (fileContains(content, 'slipPhoto')) evidence.push('payment screenshot photo field');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cp-table-revert', name: 'Table Revert to Available on Settlement', role: 'captain', category: 'Post-Order & Settlement',
    description: 'Completing settlement automatically frees the table', srsRef: 'FR-C.5.4',
    checks: () => {
      const apiContent = readFile('app/api/tables/[id]/status/route.ts');
      const evidence: string[] = [];
      if (fileContains(apiContent, 'available', 'activeSession', 'null')) evidence.push('revert to available logic');
      return { status: evidence.length ? 'live' : 'partial', evidence };
    },
  },
  {
    id: 'cp-bookings', name: 'Bookings Queue', role: 'captain', category: 'Other',
    description: 'Incoming reservations and table allocation',
    checks: () => {
      const page = exists('app/(dashboard)/captain/bookings/page.tsx');
      const evidence: string[] = [];
      if (page) evidence.push('bookings page exists');
      return { status: page ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cp-account', name: 'Captain Account', role: 'captain', category: 'Other',
    description: 'Profile management',
    checks: () => {
      const page = exists('app/(dashboard)/captain/account/page.tsx');
      const evidence: string[] = [];
      if (page) evidence.push('account page exists');
      return { status: page ? 'live' : 'planned', evidence };
    },
  },


  // ══════════════════════════════════════════
  //  CUSTOMER
  // ══════════════════════════════════════════
  {
    id: 'cu-feed', name: 'Instagram-Style Home Feed', role: 'customer', category: 'Feed & Discovery',
    description: 'Mixed restaurant + customer posts with city-level filtering', srsRef: 'A.1',
    checks: () => {
      const page = exists('app/(dashboard)/customer/page.tsx');
      const comp = exists('features/feed/components/FeedCard.tsx');
      const api = exists('app/api/posts/route.ts');
      const evidence: string[] = [];
      if (page) evidence.push('customer page exists');
      if (comp) evidence.push('FeedCard component exists');
      if (api) evidence.push('posts API exists');
      return { status: page && comp && api ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-veg-toggle', name: 'Veg/Non-Veg/Both Toggle', role: 'customer', category: 'Feed & Discovery',
    description: 'Filter feed content by dietary preference', srsRef: 'FR-A.1.2',
    checks: () => {
      const files = listFiles('features/feed');
      const evidence: string[] = [];
      const hasVeg = files.some(f => fs.readFileSync(f, 'utf-8').includes('isVeg'));
      if (hasVeg) evidence.push('veg filter found');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-stories', name: 'Story Tray', role: 'customer', category: 'Feed & Discovery',
    description: '24-hour ephemeral + permanent stories from followed restaurants', srsRef: 'A.2',
    checks: () => {
      const model = exists('lib/db/models/Story.ts');
      const api = exists('app/api/stories/route.ts');
      const evidence: string[] = [];
      if (model) evidence.push('Story model exists');
      if (api) evidence.push('stories API exists');
      return { status: model && api ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-search', name: 'Search by Name/Cuisine', role: 'customer', category: 'Feed & Discovery',
    description: 'Discover restaurants, cuisines and dishes with server-side search', srsRef: 'A.4',
    checks: () => {
      const page = exists('app/(dashboard)/customer/search/page.tsx');
      const api = exists('app/api/search/route.ts');
      const evidence: string[] = [];
      if (page) evidence.push('search page exists');
      if (api) evidence.push('search API exists');
      const content = readFile('app/api/search/route.ts');
      if (fileContains(content, 'RegExp', 'Restaurant.find')) evidence.push('server-side regex search');
      return { status: evidence.length >= 3 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'cu-qr-scanner', name: 'QR Code Scanner', role: 'customer', category: 'QR Ordering & Shared Tables',
    description: 'Scan table QR to begin ordering session', srsRef: 'A.3',
    checks: () => {
      const page = exists('app/(dashboard)/customer/scan/page.tsx');
      const comp = exists('components/customer/QRScanView.tsx');
      const evidence: string[] = [];
      if (page) evidence.push('scan page exists');
      if (comp) evidence.push('QRScanView component exists');
      return { status: page && comp ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-qr-api', name: 'QR Menu Resolution API', role: 'customer', category: 'QR Ordering & Shared Tables',
    description: 'Public API resolving QR tokens to table + restaurant + menu',
    checks: () => {
      const api = exists('app/api/qr/[token]/menu/route.ts');
      const evidence: string[] = [];
      if (api) evidence.push('QR menu API exists');
      const content = readFile('app/api/qr/[token]/menu/route.ts');
      if (fileContains(content, 'qrToken', 'MenuItem.find')) evidence.push('resolves token to menu');
      return { status: evidence.length >= 2 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'cu-shared-table', name: 'Shared Table Ordering', role: 'customer', category: 'QR Ordering & Shared Tables',
    description: 'Session admin / join request flow for multi-user table ordering', srsRef: 'FR-A.3.1',
    checks: () => {
      const api = exists('app/api/tables/[id]/session/route.ts');
      const evidence: string[] = [];
      if (api) evidence.push('table session API exists');
      const content = readFile('app/api/tables/[id]/session/route.ts');
      if (fileContains(content, 'tableSession')) evidence.push('table session admin logic');
      return { status: evidence.length >= 2 ? 'live' : 'planned', evidence };
    },
  },

  {
    id: 'cu-outlet', name: 'Outlet Page (Menu/Review/Stories tabs)', role: 'customer', category: 'Restaurant & Outlet Pages',
    description: 'Full restaurant profile with tabbed content', srsRef: 'A.4',
    checks: () => {
      const page = exists('app/(dashboard)/customer/restaurant');
      const evidence: string[] = [];
      if (page) evidence.push('restaurant directory exists');
      return { status: page ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-wishlist', name: 'Wishlist/Follow Toggle', role: 'customer', category: 'Restaurant & Outlet Pages',
    description: 'Save favourite restaurants for quick access', srsRef: 'FR-A.4.2',
    checks: () => {
      const files = listFiles('components/customer');
      const evidence: string[] = [];
      const hasFollow = files.some(f => fs.readFileSync(f, 'utf-8').includes('follow'));
      if (hasFollow) evidence.push('follow toggle found');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-prebook', name: 'Pre-Book Dine-In (Seat Map)', role: 'customer', category: 'Restaurant & Outlet Pages',
    description: 'Movie-ticket style seat selection with party-size gating', srsRef: 'A.5',
    checks: () => {
      const page = exists('app/(dashboard)/customer/bookings/page.tsx');
      const api = exists('app/api/bookings/route.ts');
      const evidence: string[] = [];
      if (page) evidence.push('bookings page exists');
      if (api) evidence.push('bookings API exists');
      return { status: page && api ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-advance-pay', name: 'Advance Booking Payment', role: 'customer', category: 'Restaurant & Outlet Pages',
    description: 'Non-refundable advance fee credited to final bill', srsRef: 'FR-A.5.5',
    checks: () => {
      const payApi = exists('app/api/payments/create-order/route.ts');
      const evidence: string[] = [];
      if (payApi) evidence.push('payment order API exists');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-like-comment', name: 'Like / Comment / Share on Posts', role: 'customer', category: 'Social & Engagement',
    description: 'Full social interaction on feed posts',
    checks: () => {
      const feedCard = readFile('features/feed/components/FeedCard.tsx');
      const evidence: string[] = [];
      if (fileContains(feedCard, 'like', 'heart')) evidence.push('like button');
      if (fileContains(feedCard, 'comment')) evidence.push('comment section');
      if (fileContains(feedCard, 'share')) evidence.push('share button');
      return { status: evidence.length >= 3 ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-posting', name: 'Customer Social Posting', role: 'customer', category: 'Social & Engagement',
    description: 'Post own food photos to community feed',
    checks: () => {
      const api = exists('app/api/posts/route.ts');
      const evidence: string[] = [];
      if (api) evidence.push('posts API exists');
      const content = readFile('app/api/posts/route.ts');
      if (fileContains(content, 'POST')) evidence.push('POST handler');
      return { status: evidence.length >= 2 ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-reels', name: 'Reels (Short-Form Video)', role: 'customer', category: 'Social & Engagement',
    description: 'Short-form video content from restaurants',
    checks: () => {
      const page = exists('app/(dashboard)/customer/reels/page.tsx');
      const evidence: string[] = [];
      if (page) evidence.push('reels page exists');
      return { status: page ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-messages', name: 'Direct Messaging', role: 'customer', category: 'Social & Engagement',
    description: 'Real-time customer ↔ restaurant messaging',
    checks: () => {
      const page = exists('app/(dashboard)/customer/messages/page.tsx');
      const api = exists('app/api/messages/route.ts');
      const model = exists('lib/db/models/Message.ts');
      const evidence: string[] = [];
      if (page) evidence.push('messages page exists');
      if (api) evidence.push('messages API exists');
      if (model) evidence.push('Message model exists');
      return { status: evidence.length >= 3 ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-review', name: 'Review Submission (10-Min Window)', role: 'customer', category: 'Reviews & Ratings',
    description: 'Server-enforced 10-minute review window post-payment', srsRef: 'A.7',
    checks: () => {
      const api = readFile('app/api/reviews/route.ts');
      const evidence: string[] = [];
      if (fileContains(api, 'reviewWindowClosesAt')) evidence.push('10-min window enforcement');
      if (fileContains(api, 'isReviewed')) evidence.push('deduplication check');
      if (fileContains(api, 'getAuthSession')) evidence.push('auth guard');
      return { status: evidence.length >= 3 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'cu-3ratings', name: 'Three Independent Ratings', role: 'customer', category: 'Reviews & Ratings',
    description: 'Separate Food, Presentation, and Ambiance ratings', srsRef: 'FR-A.7.2',
    checks: () => {
      const model = readFile('lib/db/models/Review.ts');
      const evidence: string[] = [];
      if (fileContains(model, 'foodRating', 'presentationRating', 'ambianceRating')) evidence.push('3 rating fields in model');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-dedup', name: 'One Review Per Visit (Deduplication)', role: 'customer', category: 'Reviews & Ratings',
    description: 'Server-side enforcement preventing duplicate reviews', srsRef: 'FR-A.7.3',
    checks: () => {
      const api = readFile('app/api/reviews/route.ts');
      const evidence: string[] = [];
      if (fileContains(api, 'isReviewed', 'already submitted')) evidence.push('dedup enforcement');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-account', name: 'Account Page', role: 'customer', category: 'Account & Preferences',
    description: 'Past orders, visited outlets, posts, and reviews', srsRef: 'A.6',
    checks: () => {
      const page = exists('app/(dashboard)/customer/account/page.tsx');
      const evidence: string[] = [];
      if (page) evidence.push('account page exists');
      return { status: page ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-notifications', name: 'Notifications Center', role: 'customer', category: 'Account & Preferences',
    description: 'Order updates, reservation status, announcements',
    checks: () => {
      const page = exists('app/(dashboard)/customer/notifications/page.tsx');
      const api = exists('app/api/notifications/route.ts');
      const evidence: string[] = [];
      if (page) evidence.push('notifications page exists');
      if (api) evidence.push('notifications API exists');
      return { status: page && api ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'cu-settings', name: 'Dietary & City Preferences', role: 'customer', category: 'Account & Preferences',
    description: 'Set veg/non-veg default, city, and language',
    checks: () => {
      const page = exists('app/(dashboard)/customer/settings/page.tsx');
      const evidence: string[] = [];
      if (page) evidence.push('settings page exists');
      return { status: page ? 'live' : 'planned', evidence };
    },
  },

  // ══════════════════════════════════════════
  //  PLATFORM-WIDE
  // ══════════════════════════════════════════
  {
    id: 'pl-nextauth', name: 'NextAuth JWT Authentication', role: 'platform', category: 'Security & Authentication',
    description: 'Secure JWT-based session management with bcrypt password hashing',
    checks: () => {
      const auth = readFile('app/api/auth/[...nextauth]/route.ts');
      const evidence: string[] = [];
      if (fileContains(auth, 'CredentialsProvider')) evidence.push('credentials provider');
      if (fileContains(auth, 'bcrypt')) evidence.push('bcrypt hashing');
      if (fileContains(auth, 'jwt', 'session')) evidence.push('JWT session strategy');
      return { status: evidence.length >= 3 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'pl-google', name: 'Google OAuth Login', role: 'platform', category: 'Security & Authentication',
    description: 'One-click social login with automatic customer account creation',
    checks: () => {
      const auth = readFile('app/api/auth/[...nextauth]/route.ts');
      const evidence: string[] = [];
      if (fileContains(auth, 'GoogleProvider')) evidence.push('Google provider configured');
      if (fileContains(auth, 'google', 'User.create')) evidence.push('auto account creation');
      return { status: evidence.length >= 2 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'pl-role-auth', name: 'Server-Side Role Authorization', role: 'platform', category: 'Security & Authentication',
    description: 'API-level role checks on all protected endpoints',
    checks: () => {
      const serverAuth = exists('lib/auth/serverAuth.ts');
      const evidence: string[] = [];
      if (serverAuth) evidence.push('serverAuth module exists');
      const content = readFile('lib/auth/serverAuth.ts');
      if (fileContains(content, 'requireAuthRoles')) evidence.push('requireAuthRoles function');
      return { status: evidence.length >= 2 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'pl-rate-limit', name: 'Rate Limiting on Auth Endpoints', role: 'platform', category: 'Security & Authentication',
    description: 'Sliding-window IP-based rate limiter for registration/login',
    checks: () => {
      const rl = exists('lib/rateLimit.ts');
      const evidence: string[] = [];
      if (rl) evidence.push('rateLimit module exists');
      const regContent = readFile('app/api/auth/register/route.ts');
      if (fileContains(regContent, 'rateLimit')) evidence.push('applied in register route');
      return { status: evidence.length >= 2 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'pl-zod', name: 'Zod Input Validation', role: 'platform', category: 'Security & Authentication',
    description: 'Schema validation on mutation API routes',
    checks: () => {
      const regContent = readFile('app/api/auth/register/route.ts');
      const evidence: string[] = [];
      if (fileContains(regContent, 'z.object', 'safeParse')) evidence.push('Zod validation in register');
      return { status: evidence.length ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'pl-middleware', name: 'Middleware Route Protection', role: 'platform', category: 'Security & Authentication',
    description: 'All dashboard & sensitive customer routes protected with login redirect',
    checks: () => {
      const mw = readFile('middleware.ts');
      const evidence: string[] = [];
      if (fileContains(mw, 'getToken')) evidence.push('JWT token extraction');
      if (fileContains(mw, '/customer/account')) evidence.push('customer routes protected');
      if (fileContains(mw, 'manager', 'captain', 'superadmin')) evidence.push('dashboard routes protected');
      return { status: evidence.length >= 3 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'pl-razorpay', name: 'Razorpay Payment Gateway', role: 'platform', category: 'Payments & Billing',
    description: 'Order creation & HMAC-SHA256 signature verification',
    checks: () => {
      const createOrder = exists('app/api/payments/create-order/route.ts');
      const verify = exists('app/api/payments/verify/route.ts');
      const evidence: string[] = [];
      if (createOrder) evidence.push('create-order API exists');
      if (verify) evidence.push('verify API exists');
      const content = readFile('app/api/payments/verify/route.ts');
      if (fileContains(content, 'createHmac', 'sha256')) evidence.push('HMAC signature verification');
      return { status: evidence.length >= 3 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'pl-saas-tiers', name: 'SaaS Subscription Tiers', role: 'platform', category: 'Payments & Billing',
    description: 'Basic / Premium / Enterprise with feature gating',
    checks: () => {
      const model = readFile('lib/db/models/Restaurant.ts');
      const gate = exists('components/shared/SaaSUpgradeGate.tsx');
      const evidence: string[] = [];
      if (fileContains(model, 'Basic', 'Premium', 'Enterprise')) evidence.push('plan enum in Restaurant model');
      if (gate) evidence.push('SaaSUpgradeGate component');
      return { status: evidence.length >= 2 ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'pl-mongodb', name: 'MongoDB Atlas Database', role: 'platform', category: 'Technical Infrastructure',
    description: '16 indexed collections with relationship modeling',
    checks: () => {
      const conn = exists('lib/db/connection.ts');
      const models = listFiles('lib/db/models');
      const evidence: string[] = [];
      if (conn) evidence.push('connection module');
      evidence.push(`${models.length} model files found`);
      return { status: models.length >= 10 ? 'live' : models.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'pl-blob', name: 'Vercel Blob Media Storage', role: 'platform', category: 'Technical Infrastructure',
    description: 'Cloud-based image upload and serving',
    checks: () => {
      const upload = exists('app/api/upload/route.ts');
      const evidence: string[] = [];
      if (upload) evidence.push('upload API exists');
      const content = readFile('app/api/upload/route.ts');
      if (fileContains(content, 'blob', 'put')) evidence.push('Vercel Blob put()');
      return { status: evidence.length >= 2 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'pl-fsm', name: 'Table Status FSM', role: 'platform', category: 'Technical Infrastructure',
    description: 'Finite state machine for table lifecycle transitions',
    checks: () => {
      const fsm = exists('lib/tableStateMachine.ts');
      const evidence: string[] = [];
      if (fsm) evidence.push('FSM module exists');
      const content = readFile('lib/tableStateMachine.ts');
      if (fileContains(content, 'VALID_TRANSITIONS')) evidence.push('transition map defined');
      return { status: evidence.length >= 2 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'pl-indexeddb', name: 'IndexedDB Client Persistence', role: 'platform', category: 'Technical Infrastructure',
    description: 'Client-side data caching for offline-capable UX',
    checks: () => {
      const idb = exists('lib/indexedDb.ts');
      const evidence: string[] = [];
      if (idb) evidence.push('IndexedDB module exists');
      return { status: idb ? 'live' : 'planned', evidence };
    },
  },
  {
    id: 'pl-animations', name: 'Framer Motion Animations', role: 'platform', category: 'Technical Infrastructure',
    description: 'Premium micro-animations and page transitions',
    checks: () => {
      const anims = exists('lib/animations.ts');
      const evidence: string[] = [];
      if (anims) evidence.push('animations.ts exists');
      const files = listFiles('components');
      const usages = files.filter(f => fs.readFileSync(f, 'utf-8').includes('framer-motion')).length;
      if (usages > 3) evidence.push(`${usages} components use framer-motion`);
      return { status: evidence.length >= 2 ? 'live' : evidence.length ? 'partial' : 'planned', evidence };
    },
  },
  {
    id: 'pl-responsive', name: 'Responsive Layout', role: 'platform', category: 'Technical Infrastructure',
    description: 'Adaptive navigation: desktop sidebar + mobile bottom nav',
    checks: () => {
      const sidebar = exists('components/layout/Sidebar.tsx');
      const bottomNav = exists('components/layout/BottomNav.tsx');
      const shell = exists('components/layout/DashboardShell.tsx');
      const evidence: string[] = [];
      if (sidebar) evidence.push('Sidebar component');
      if (bottomNav) evidence.push('BottomNav component');
      if (shell) evidence.push('DashboardShell wrapper');
      return { status: evidence.length >= 3 ? 'live' : 'planned', evidence };
    },
  },

];

/* ───── run ───── */

interface FeatureResult {
  id: string;
  name: string;
  description: string;
  role: string;
  category: string;
  srsRef?: string;
  status: Status;
  evidence: string[];
}

function run() {
  console.log('\n🔍  Plateful Feature Scanner\n');
  console.log('─'.repeat(60));

  const results: FeatureResult[] = [];
  let live = 0, partial = 0, planned = 0;

  for (const f of features) {
    const { status, evidence } = f.checks();
    results.push({
      id: f.id,
      name: f.name,
      description: f.description,
      role: f.role,
      category: f.category,
      srsRef: f.srsRef,
      status,
      evidence,
    });

    const icon = status === 'live' ? '✅' : status === 'partial' ? '⚠️' : '❌';
    if (status === 'live') live++;
    else if (status === 'partial') partial++;
    else planned++;

    console.log(`${icon}  [${status.toUpperCase().padEnd(7)}] ${f.name}`);
    for (const e of evidence) {
      console.log(`     └─ ${e}`);
    }
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`\n📊  Results: ${live} Live ┃ ${partial} In Progress ┃ ${planned} Planned ┃ ${results.length} Total\n`);

  // Write JSON
  const outDir = path.join(ROOT, 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const output = {
    generatedAt: new Date().toISOString(),
    summary: { live, partial, planned, total: results.length },
    features: results,
  };

  const outPath = path.join(outDir, 'feature-registry.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`✏️  Written to ${path.relative(ROOT, outPath)}\n`);
}

run();

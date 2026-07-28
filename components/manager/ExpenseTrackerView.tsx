'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { SaaSUpgradeGate } from '@/components/shared/SaaSUpgradeGate';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Wallet, Plus, ClipboardList, Check, Calendar } from 'lucide-react';

export const ExpenseTrackerView: React.FC = () => {
  const { user } = useAuth();
  const { expenses, forecast, restaurants, addExpense, markForecastPurchased } = useApp();
  const { toast } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [expenseItem, setExpenseItem] = useState('');
  const [expenseQuantity, setExpenseQuantity] = useState('');
  const [expenseCost, setExpenseCost] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Raw Material');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseItem || !expenseCost) {
      toast({
        type: 'error',
        title: 'Fields Required',
        description: 'Please enter item name and cost.'
      });
      return;
    }

    const newExpense = {
      id: `e_dyn_${Date.now()}`,
      restaurantId: user?.restaurantId || 'r1',
      itemName: expenseItem,
      quantity: expenseQuantity || '1 unit',
      cost: parseFloat(expenseCost),
      category: expenseCategory,
      date: new Date().toISOString().split('T')[0],
      notes: 'Manually logged expense'
    };

    addExpense(newExpense);
    setShowAddModal(false);

    setExpenseItem('');
    setExpenseQuantity('');
    setExpenseCost('');

    toast({
      type: 'success',
      title: 'Expense Logged',
      description: `Logged ₹${newExpense.cost} for ${newExpense.itemName}.`
    });
  };

  const handleMarkPurchased = (forecastId: string, name: string) => {
    markForecastPurchased(forecastId);
    toast({
      type: 'success',
      title: 'Material Purchased',
      description: `${name} has been moved to the Logged Expenses.`
    });
  };

  const userRestaurant = restaurants.find(r => r.id === user?.restaurantId);
  const currentPlan = (userRestaurant?.subscriptionPlan || 'Basic') as 'Basic' | 'Premium' | 'Enterprise';

  const tenantExpenses = expenses.filter(e => e.restaurantId === user?.restaurantId);
  const tenantForecast = forecast.filter(f => f.restaurantId === user?.restaurantId);

  const activeForecasts = tenantForecast.filter(f => !f.isPurchased);
  const totalLoggedCost = tenantExpenses.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-serif font-bold text-ink">Inventory & expenses</h1>
          <p className="text-xs text-ink-soft font-medium mt-0.5">Log kitchen raw material costs and check forecast requirements.</p>
        </div>
        
        <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)} className="flex gap-1.5 items-center">
          <Plus className="w-4 h-4" />
          <span>Add expense</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecasted requirements */}
        <div className="lg:col-span-1">
          <SaaSUpgradeGate
            currentPlan={currentPlan}
            requiredPlan="Enterprise"
            featureName="Kitchen Material Forecasting"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 border-b border-line pb-2">
                <ClipboardList className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Needs for tomorrow
                </h3>
              </div>

              <div className="space-y-3">
                {activeForecasts.length > 0 ? (
                  activeForecasts.map(f => (
                    <Card key={f.id} className="!p-3.5 space-y-3 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-ink">{f.itemName}</h4>
                        <p className="text-[10px] text-ink-soft mt-0.5">
                          {f.quantityNeeded} needed · est. ₹{f.estimatedCost}
                        </p>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        className="py-1.5 flex gap-1.5 items-center justify-center text-xs"
                        onClick={() => handleMarkPurchased(f.id, f.itemName)}
                      >
                        <Check className="w-3.5 h-3.5 text-success" />
                        <span>Mark purchased</span>
                      </Button>
                    </Card>
                  ))
                ) : (
                  <Card className="text-center py-6 bg-success-bg/10 border-success/20">
                    <Check className="w-6 h-6 text-success mx-auto mb-2" />
                    <h4 className="text-xs font-bold text-success">All Items Purchased</h4>
                    <p className="text-[10px] text-ink-soft mt-0.5">No pending raw material forecasted.</p>
                  </Card>
                )}
              </div>
            </div>
          </SaaSUpgradeGate>
        </div>

        {/* Historical logged expenses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <div className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Logged expenses history
              </h3>
            </div>
            <span className="text-xs font-bold text-primary">Total: ₹{totalLoggedCost.toLocaleString()}</span>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {expenses.map(e => (
              <Card key={e.id} className="!p-3.5 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-ink">{e.itemName} · {e.quantity}</span>
                  <div className="flex items-center gap-1.5 text-[9px] text-ink-soft">
                    <Calendar className="w-3 h-3" />
                    <span>{e.date}</span>
                    <span>·</span>
                    <span className="font-semibold text-primary">{e.category}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-ink">₹{e.cost}</span>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Add custom Expense Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Expense Record"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <Input
            label="Item name"
            type="text"
            value={expenseItem}
            onChange={e => setExpenseItem(e.target.value)}
            required
            placeholder="e.g. Mutton, LPG refill..."
          />

          <Input
            label="Quantity / details"
            type="text"
            value={expenseQuantity}
            onChange={e => setExpenseQuantity(e.target.value)}
            placeholder="e.g. 12 kg, 1 cylinder"
          />

          <Input
            label="Cost (₹)"
            type="number"
            value={expenseCost}
            onChange={e => setExpenseCost(e.target.value)}
            required
            placeholder="e.g. 4500"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
              Category
            </label>
            <select
              value={expenseCategory}
              onChange={e => setExpenseCategory(e.target.value)}
              className="text-xs"
            >
              <option value="Raw Material">Raw Kitchen Material</option>
              <option value="Utilities">Kitchen Utilities (Gas, Water)</option>
              <option value="Salaries">Staff Salaries</option>
              <option value="Miscellaneous">Other expenses</option>
            </select>
          </div>

          <Button type="submit" variant="primary" fullWidth className="py-2.5 flex justify-center items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Log Expense Record</span>
          </Button>
        </form>
      </Modal>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { Users, Search, ShieldAlert, Sparkles, UserPlus, RefreshCw, KeyRound } from 'lucide-react';

export const OwnersConsoleView: React.FC = () => {
  const { users, restaurants, updateUserProfile, toggleUserBan } = useApp();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newRestaurantId, setNewRestaurantId] = useState('r1');

  const owners = users.filter(u => u.role === 'owner');

  const filteredOwners = owners.filter(owner => {
    const restaurant = restaurants.find(r => r.id === owner.restaurantId);
    const searchLower = searchTerm.toLowerCase();
    return (
      owner.name.toLowerCase().includes(searchLower) ||
      owner.username.toLowerCase().includes(searchLower) ||
      (restaurant?.name || '').toLowerCase().includes(searchLower)
    );
  });

  const handleResetPassword = (ownerName: string) => {
    toast({
      type: 'success',
      title: 'Credentials Reset',
      description: `Temporary password has been sent to ${ownerName}'s registered email.`
    });
  };

  const handleToggleStatus = (ownerId: string, ownerName: string, isBanned: boolean) => {
    toggleUserBan(ownerId);
    toast({
      type: isBanned ? 'success' : 'warning',
      title: isBanned ? 'Access Restored' : 'Access Suspended',
      description: `Security clearance for ${ownerName} has been ${isBanned ? 'reactivated' : 'revoked'}.`
    });
  };

  const handleOpenAssign = (ownerId: string, currentRestId?: string) => {
    setSelectedOwnerId(ownerId);
    setNewRestaurantId(currentRestId || 'r1');
    setShowAssignModal(true);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOwnerId) return;

    updateUserProfile(selectedOwnerId, { restaurantId: newRestaurantId });
    setShowAssignModal(false);
    setSelectedOwnerId(null);
    toast({
      type: 'success',
      title: 'Restaurant Reassigned',
      description: 'The owner has been successfully mapped to the new tenant outlet.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink">Merchant Owner Directory</h1>
          <p className="text-xs text-ink-soft mt-0.5 font-medium">Verify credentials, adjust subscription mapping, and suspend security clearance.</p>
        </div>
        <Button variant="primary" size="sm" className="flex gap-1.5 items-center">
          <UserPlus className="w-4 h-4" />
          <span>Provision Owner Account</span>
        </Button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary p-3 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Total Active Owners</span>
            <h3 className="text-lg font-bold text-ink mt-0.5">{owners.filter(o => !o.isBanned).length}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="bg-danger-bg text-danger p-3 rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Suspended Clearance</span>
            <h3 className="text-lg font-bold text-ink mt-0.5">{owners.filter(o => o.isBanned).length}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="bg-secondary/10 text-secondary p-3 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Coverage Rate</span>
            <h3 className="text-lg font-bold text-ink mt-0.5">100% Mapped</h3>
          </div>
        </Card>
      </div>

      {/* Search Filter bar */}
      <Card className="space-y-4">
        <div className="flex gap-3 max-w-md items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by owner name, email, or restaurant..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-line rounded-lg text-ink"
            />
          </div>
        </div>

        {/* Owners Table */}
        <div className="overflow-x-auto border border-line rounded-lg">
          <table className="min-w-full divide-y divide-line text-left text-xs bg-bg-card">
            <thead className="bg-bg-alt/30 text-ink font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Owner Account</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Linked Outlet</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Clearance Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-ink-soft font-medium">
              {filteredOwners.map(owner => {
                const rest = restaurants.find(r => r.id === owner.restaurantId);
                return (
                  <tr key={owner.id} className="hover:bg-bg-alt/10">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/5">
                          {owner.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-ink">{owner.name}</p>
                          <p className="text-[10px] text-ink-soft">{owner.email || 'no-email@plateful.com'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono">@{owner.username}</td>
                    <td className="px-4 py-3 font-bold text-ink">
                      {rest ? rest.name : <span className="text-danger italic">Unassigned</span>}
                    </td>
                    <td className="px-4 py-3">
                      {rest ? (
                        <Badge variant="primary">{rest.subscriptionPlan}</Badge>
                      ) : (
                        <span className="text-ink-soft">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={owner.isBanned ? 'danger' : 'success'}>
                        {owner.isBanned ? 'Suspended' : 'Cleared'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenAssign(owner.id, owner.restaurantId)}
                        className="scale-90 bg-bg border-line hover:bg-bg-alt"
                        title="Reassign Restaurant"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetPassword(owner.name)}
                        className="scale-90 bg-bg border-line hover:bg-bg-alt"
                        title="Reset Credentials"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(owner.id, owner.name, !!owner.isBanned)}
                        className={`scale-90 ${owner.isBanned ? 'border-success/30 text-success hover:bg-success-bg/25' : 'border-danger/30 text-danger hover:bg-danger-bg/25'}`}
                      >
                        {owner.isBanned ? 'Restore' : 'Suspend'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredOwners.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-ink-soft italic">
                    No merchant owner accounts found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reassign Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Reassign Merchant Outlet"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Select Restaurant</label>
            <select
              value={newRestaurantId}
              onChange={e => setNewRestaurantId(e.target.value)}
              className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
            >
              {restaurants.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.city}) - Plan: {r.subscriptionPlan}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="primary" fullWidth className="py-2.5">
            <span>Confirm Reassignment</span>
          </Button>
        </form>
      </Modal>
    </div>
  );
};

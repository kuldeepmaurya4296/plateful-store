'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Users, Search, Ban, CheckCircle, AlertTriangle } from 'lucide-react';

export const CustomersConsoleView: React.FC = () => {
  const { users, reviews, posts, toggleUserBan } = useApp();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const customers = users.filter(u => u.role === 'customer');

  const filteredCustomers = customers.filter(c => {
    const searchLower = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(searchLower) ||
      c.username.toLowerCase().includes(searchLower) ||
      (c.phone || '').toLowerCase().includes(searchLower) ||
      (c.email || '').toLowerCase().includes(searchLower)
    );
  });

  const getStats = (customerId: string) => {
    const userReviews = reviews.filter(r => r.userId === customerId);
    const userPosts = posts.filter(p => p.authorId === customerId);
    const isSpammy = userReviews.length > 5 || userPosts.length > 5;
    
    return {
      reviewsCount: userReviews.length,
      postsCount: userPosts.length,
      isSpammy
    };
  };

  const handleToggleStatus = (customerId: string, name: string, isBanned: boolean) => {
    toggleUserBan(customerId);
    toast({
      type: isBanned ? 'success' : 'warning',
      title: isBanned ? 'User Reactivated' : 'User Suspended',
      description: `${name}'s platform access has been ${isBanned ? 'reactivated' : 'revoked'}.`
    });
  };

  const handleBulkSuspend = () => {
    selectedUserIds.forEach(id => {
      const user = users.find(u => u.id === id);
      if (user && !user.isBanned) {
        toggleUserBan(id);
      }
    });
    toast({
      type: 'warning',
      title: 'Bulk Action Complete',
      description: `Suspended access for ${selectedUserIds.length} users.`
    });
    setSelectedUserIds([]);
  };

  const handleSelectUser = (id: string) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(uId => uId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(filteredCustomers.map(c => c.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink">Plateful Customer Directory</h1>
          <p className="text-xs text-ink-soft mt-0.5 font-medium">Monitor user profiles, check preferences, track activity counts, and enforce platform guidelines.</p>
        </div>
        {selectedUserIds.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleBulkSuspend} className="border-danger/30 text-danger hover:bg-danger-bg/25 flex gap-1.5 items-center">
            <Ban className="w-4 h-4" />
            <span>Suspend Selected ({selectedUserIds.length})</span>
          </Button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary p-3 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Total Registered Customers</span>
            <h3 className="text-lg font-bold text-ink mt-0.5">{customers.length}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="bg-success-bg text-success p-3 rounded-lg">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Active & Cleared</span>
            <h3 className="text-lg font-bold text-ink mt-0.5">{customers.filter(c => !c.isBanned).length}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="bg-warning-bg text-warning p-3 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Flagged for Spam</span>
            <h3 className="text-lg font-bold text-ink mt-0.5">
              {customers.filter(c => getStats(c.id).isSpammy).length}
            </h3>
          </div>
        </Card>
      </div>

      {/* Filter and Table */}
      <Card className="space-y-4">
        <div className="flex gap-3 max-w-md items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, username, email, phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-line rounded-lg text-ink"
            />
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto border border-line rounded-lg">
          <table className="min-w-full divide-y divide-line text-left text-xs bg-bg-card">
            <thead className="bg-bg-alt/30 text-ink font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={handleSelectAll}
                    className="cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3">Customer Profile</th>
                <th className="px-4 py-3">diet Filter</th>
                <th className="px-4 py-3">City Location</th>
                <th className="px-4 py-3">Reviews</th>
                <th className="px-4 py-3">Posts</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3 text-right">Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-ink-soft font-medium">
              {filteredCustomers.map(customer => {
                const isSelected = selectedUserIds.includes(customer.id);
                const stats = getStats(customer.id);
                return (
                  <tr key={customer.id} className={`hover:bg-bg-alt/10 ${isSelected ? 'bg-primary-soft/10' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectUser(customer.id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary-soft text-secondary font-bold text-xs flex items-center justify-center border border-secondary/5">
                          {customer.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-ink">{customer.name}</p>
                          <p className="text-[10px] text-ink-soft">@{customer.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{customer.preferences?.dietFilter || 'Veg & Non-Veg'}</td>
                    <td className="px-4 py-3 font-semibold text-ink">{customer.preferences?.city || 'Mumbai'}</td>
                    <td className="px-4 py-3 font-bold text-ink">{stats.reviewsCount}</td>
                    <td className="px-4 py-3 font-bold text-ink">{stats.postsCount}</td>
                    <td className="px-4 py-3">
                      {stats.isSpammy ? (
                        <Badge variant="warning" className="flex items-center gap-0.5 w-fit">
                          <AlertTriangle className="w-3 h-3 text-warning" />
                          <span>Spam Alert</span>
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-success font-semibold">Clean</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(customer.id, customer.name, !!customer.isBanned)}
                        className={`scale-90 ${customer.isBanned ? 'border-success/30 text-success hover:bg-success-bg/25' : 'border-danger/30 text-danger hover:bg-danger-bg/25'}`}
                      >
                        {customer.isBanned ? 'Unban Account' : 'Ban Account'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-ink-soft italic">
                    No customer accounts found matching the search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

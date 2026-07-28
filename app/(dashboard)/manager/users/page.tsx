'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Users, Plus, Shield, ShieldCheck, Trash2, Key } from 'lucide-react';

export default function ManagerUsersPage() {
  const { toast: fullToast } = useToast();
  const { user } = useAuth();
  const { counters: mockCounters, users: allUsers } = useApp();

  const [captains, setCaptains] = useState<Array<{ id: string; name: string; username: string; counter: string; status: string }>>([]);

  useEffect(() => {
    const list = allUsers.filter(u => u.role === 'captain' && (u.restaurantId === user?.restaurantId || !u.restaurantId || u.restaurantId === 'r1'));
    setCaptains(list.map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      counter: u.counterId === 'c1' ? 'Counter 1' : 'Counter 2',
      status: u.id === 'u4' ? 'Active' : 'Off Shift'
    })));
  }, [allUsers, user?.restaurantId]);

  const tenantCounters = mockCounters.filter(c => c.restaurantId === user?.restaurantId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCaptainName, setNewCaptainName] = useState('');
  const [newCaptainUsername, setNewCaptainUsername] = useState('');
  const [newCaptainPassword, setNewCaptainPassword] = useState('123456');
  const [newCaptainCounter, setNewCaptainCounter] = useState('Counter 1');

  const handleAddCaptain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaptainName || !newCaptainUsername) {
      fullToast({
        type: 'error',
        title: 'Fields Required',
        description: 'Please enter captain name and username.'
      });
      return;
    }

    const newCap = {
      id: `u_dyn_${Date.now()}`,
      name: newCaptainName,
      username: newCaptainUsername.toLowerCase().replace(/\s+/g, '.'),
      counter: newCaptainCounter,
      status: 'Active'
    };

    setCaptains(prev => [...prev, newCap]);
    setShowAddModal(false);
    
    // Clear inputs
    setNewCaptainName('');
    setNewCaptainUsername('');
    
    fullToast({
      type: 'success',
      title: 'Captain Credentials Issued',
      description: `@${newCap.username} has been added. They can now log in.`
    });
  };

  const handleDeleteCaptain = (id: string, name: string) => {
    setCaptains(prev => prev.filter(c => c.id !== id));
    fullToast({
      type: 'warning',
      title: 'Credentials Revoked',
      description: `${name}'s terminal access has been disabled.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-serif font-bold text-ink">User & captain management</h1>
          <p className="text-xs text-ink-soft font-medium mt-0.5">Manage staff, define billing counters, and issue credentials.</p>
        </div>
        
        <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)} className="flex gap-1.5 items-center">
          <Plus className="w-4 h-4" />
          <span>Add Captain</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Billing Counters setup */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-line pb-2">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              Billing Counters
            </h3>
          </div>
          
          <div className="space-y-3">
            {tenantCounters.map(c => (
              <Card key={c.id} className="!p-3.5 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-ink">{c.name}</h4>
                    <p className="text-[10px] text-ink-soft mt-0.5">{c.tableRange}</p>
                  </div>
                  <Badge variant="primary">Counter</Badge>
                </div>
                <div className="text-[11px] text-ink-soft font-medium leading-none pt-1 border-t border-line/60">
                  Staffed by: <span className="font-semibold text-ink">{c.captainName}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Captain list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-line pb-2">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              Staff Credentials
            </h3>
          </div>

          <div className="space-y-3">
            {captains.map(c => (
              <Card key={c.id} className="!p-3.5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary-soft text-secondary font-bold text-xs flex items-center justify-center border border-secondary/15">
                    {c.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink">{c.name}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-ink-soft mt-1">
                      <span className="font-mono text-primary">@{c.username}</span>
                      <span>·</span>
                      <span>{c.counter}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={c.status === 'Active' ? 'success' : 'neutral'}>
                    {c.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="!p-1 rounded text-ink-soft hover:text-danger hover:bg-danger-bg/25"
                    onClick={() => handleDeleteCaptain(c.id, c.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Add Captain Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Captain Credentials"
      >
        <form onSubmit={handleAddCaptain} className="space-y-4">
          <Input
            label="Captain Name"
            type="text"
            value={newCaptainName}
            onChange={e => setNewCaptainName(e.target.value)}
            required
            placeholder="e.g. Aman Joshi"
          />

          <Input
            label="Username prefix"
            type="text"
            value={newCaptainUsername}
            onChange={e => setNewCaptainUsername(e.target.value)}
            required
            placeholder="e.g. aman.captain"
          />

          <Input
            label="Terminal Password"
            type="password"
            value={newCaptainPassword}
            onChange={e => setNewCaptainPassword(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
              Assigned Counter
            </label>
            <select
              value={newCaptainCounter}
              onChange={e => setNewCaptainCounter(e.target.value)}
              className="text-xs"
            >
              <option value="Counter 1">Counter 1 (Tables 1-8)</option>
              <option value="Counter 2">Counter 2 (Tables 9-12)</option>
            </select>
          </div>

          <Button type="submit" variant="primary" fullWidth className="py-2.5 flex items-center justify-center gap-1.5">
            <Key className="w-4 h-4" />
            <span>Generate Login Credentials</span>
          </Button>
        </form>
      </Modal>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Users, Shield, Calendar, Clock, Edit2 } from 'lucide-react';

export const StaffRosterView: React.FC = () => {
  const { user } = useAuth();
  const { users, counters, updateUserProfile } = useApp();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'managers' | 'captains' | 'shifts'>('managers');

  const restaurantStaff = users.filter(u => u.restaurantId === user?.restaurantId);
  const managers = restaurantStaff.filter(u => u.role === 'manager');
  const captains = restaurantStaff.filter(u => u.role === 'captain');
  const restaurantCounters = counters.filter(c => c.restaurantId === user?.restaurantId);

  const handleTogglePermission = (mgrId: string, name: string) => {
    toast({
      type: 'success',
      title: 'Permissions Updated',
      description: `Access flags for manager "${name}" have been updated.`
    });
  };

  const handleAssignCounter = (captainId: string, counterId: string) => {
    const matchedCounter = counters.find(c => c.id === counterId);
    if (!matchedCounter) return;

    let assignedTables: string[] = [];
    if (counterId === 'c1') assignedTables = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'];
    else if (counterId === 'c2') assignedTables = ['t9', 't10', 't11', 't12'];

    updateUserProfile(captainId, { 
      counterId,
      assignedTables
    });

    toast({
      type: 'success',
      title: 'Counter Assigned',
      description: `Assigned counter "${matchedCounter.name}" to captain.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-ink">Staff Roster & Permissions</h1>
        <p className="text-xs text-ink-soft mt-0.5 font-medium">Control credentials, shift assignments, table coverage, and permission gates.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line gap-2">
        {[
          { id: 'managers', name: 'Managers', icon: Shield },
          { id: 'captains', name: 'Captains Terminal', icon: Users },
          { id: 'shifts', name: 'Shift Assignments', icon: Calendar }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                isActive 
                  ? 'border-primary text-primary font-bold' 
                  : 'border-transparent text-ink-soft hover:text-ink'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <Card className="p-6">
        {activeTab === 'managers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <h3 className="text-sm font-serif font-bold text-ink">Active Managers</h3>
              <Button variant="primary" size="sm" className="text-xs">Add Manager</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {managers.map(mgr => (
                <div key={mgr.id} className="border border-line rounded-xl p-4 bg-bg/25 flex flex-col justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center border border-primary/10">
                      {mgr.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-ink text-sm">{mgr.name}</h4>
                      <p className="text-[10px] text-ink-soft font-mono">@{mgr.username}</p>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-line/60 pt-3">
                    <span className="text-[9px] font-bold text-ink-soft uppercase tracking-wider block">Access Permissions</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <label className="flex items-center gap-1.5 cursor-pointer text-ink font-medium">
                        <input type="checkbox" defaultChecked onChange={() => handleTogglePermission(mgr.id, mgr.name)} className="cursor-pointer" />
                        <span>Manage Menu</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-ink font-medium">
                        <input type="checkbox" defaultChecked onChange={() => handleTogglePermission(mgr.id, mgr.name)} className="cursor-pointer" />
                        <span>Manage Billing</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-ink font-medium">
                        <input type="checkbox" defaultChecked={mgr.username !== 'priya.manager'} onChange={() => handleTogglePermission(mgr.id, mgr.name)} className="cursor-pointer" />
                        <span>View Expenses</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-ink font-medium">
                        <input type="checkbox" defaultChecked onChange={() => handleTogglePermission(mgr.id, mgr.name)} className="cursor-pointer" />
                        <span>Social Marketing</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'captains' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <h3 className="text-sm font-serif font-bold text-ink">Captains shifting coverage</h3>
              <Button variant="primary" size="sm" className="text-xs">Add Captain</Button>
            </div>

            <div className="overflow-x-auto border border-line rounded-lg">
              <table className="min-w-full divide-y divide-line text-left text-xs bg-bg-card">
                <thead className="bg-bg-alt/30 text-ink font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Captain</th>
                    <th className="px-4 py-3">Username</th>
                    <th className="px-4 py-3">Assigned Counter</th>
                    <th className="px-4 py-3">Table Coverage</th>
                    <th className="px-4 py-3">Shift Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-ink-soft font-medium">
                  {captains.map(capt => {
                    return (
                      <tr key={capt.id} className="hover:bg-bg-alt/10">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-secondary-soft text-secondary font-bold text-xs flex items-center justify-center border border-secondary/5">
                              {capt.avatar}
                            </div>
                            <span className="font-bold text-ink">{capt.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono">@{capt.username}</td>
                        <td className="px-4 py-3">
                          <select
                            value={capt.counterId || ''}
                            onChange={e => handleAssignCounter(capt.id, e.target.value)}
                            className="text-xs border border-line rounded px-2 py-1 bg-bg text-ink"
                          >
                            <option value="">Unassigned</option>
                            {restaurantCounters.map(c => (
                              <option key={c.id} value={c.id}>{c.name} ({c.tableRange})</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-ink">
                            {capt.assignedTables ? `${capt.assignedTables.length} Tables` : 'None'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="success">Active Shift</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="outline" size="sm" className="scale-90 bg-bg border-line hover:bg-bg-alt">
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'shifts' && (
          <div className="space-y-4">
            <div className="border-b border-line pb-3">
              <h3 className="text-sm font-serif font-bold text-ink">Weekly Shift Assignments</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {restaurantCounters.map(counter => {
                const captain = captains.find(c => c.counterId === counter.id);
                return (
                  <div key={counter.id} className="border border-line rounded-xl p-4 space-y-3 bg-bg/25">
                    <div className="flex justify-between items-center border-b border-line pb-2">
                      <h4 className="font-serif font-bold text-sm text-ink">{counter.name}</h4>
                      <Badge variant="primary">{counter.tableRange}</Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-ink-soft">Assigned Captain</span>
                        <span className="font-bold text-ink">{captain ? captain.name : 'None'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-soft">Shift Hours</span>
                        <span className="font-semibold text-ink flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          12:00 PM - 10:00 PM
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

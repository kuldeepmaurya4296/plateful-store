'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Grid, Plus, Save, Move } from 'lucide-react';

export const FloorLayoutEditor: React.FC = () => {
  const [tables, setTables] = useState([
    { id: 't1', number: 1, capacity: 4, x: 20, y: 30 },
    { id: 't2', number: 2, capacity: 2, x: 150, y: 30 },
    { id: 't3', number: 3, capacity: 6, x: 280, y: 30 },
    { id: 't4', number: 4, capacity: 4, x: 20, y: 160 }
  ]);

  const handleAddTable = () => {
    const nextNum = tables.length + 1;
    setTables(prev => [...prev, {
      id: `t${nextNum}`,
      number: nextNum,
      capacity: 4,
      x: 150,
      y: 160
    }]);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-line pb-3">
        <div>
          <h3 className="font-serif font-bold text-lg text-ink">Interactive Floor Layout Editor</h3>
          <p className="text-xs text-ink-soft">Drag & drop tables to design floor seating layout for pre-booking.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleAddTable} className="flex gap-1 items-center">
            <Plus className="w-4 h-4" />
            <span>Add Table</span>
          </Button>
          <Button variant="primary" size="sm" className="flex gap-1 items-center">
            <Save className="w-4 h-4" />
            <span>Save Layout</span>
          </Button>
        </div>
      </div>

      <div className="w-full h-80 bg-bg-alt border-2 border-dashed border-line rounded-xl relative overflow-hidden p-4">
        {tables.map(t => (
          <div
            key={t.id}
            style={{ left: `${t.x}px`, top: `${t.y}px` }}
            className="absolute w-24 h-24 bg-white border-2 border-primary rounded-xl p-2 flex flex-col justify-between cursor-move shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-ink">T-{t.number}</span>
              <Move className="w-3.5 h-3.5 text-ink-soft" />
            </div>
            <span className="text-[10px] text-ink-soft text-center font-medium">{t.capacity} Seats</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FloorLayoutEditor;

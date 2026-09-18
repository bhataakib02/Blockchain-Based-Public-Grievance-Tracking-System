import React from 'react';
import { Tag } from 'lucide-react';

export const CategoryManagement = () => {
  const categories = [
    { name: 'Potholes & Road Repairs', code: '0x524f414453000000000000000000000000000000000000000000000000000000' },
    { name: 'Streetlights Fault', code: '0x53545245525f5354524545540000000000000000000000000000000000000000' },
    { name: 'Water Pipeline Leakage', code: '0x57415445525f4c45414b00000000000000000000000000000000000000000000' },
    { name: 'Sanitation & Sewage Overflow', code: '0x53414e49544154494f4e00000000000000000000000000000000000000000000' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Grievance Category Management</h1>
        <p className="text-xs text-slate-400">Manage categories and on-chain byte32 keys.</p>
      </div>

      <div className="space-y-3">
        {categories.map((c) => (
          <div key={c.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <Tag className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-white">{c.name}</span>
            </div>
            <code className="text-[10px] text-emerald-400 font-mono">{c.code}</code>
          </div>
        ))}
      </div>
    </div>
  );
};

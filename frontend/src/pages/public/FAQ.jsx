import React from 'react';

export const FAQ = () => {
  const faqs = [
    { q: "Is my personal data stored on the public blockchain?", a: "No. All personal identifiable information (PII), names, email addresses, and detailed text descriptions are stored off-chain in Supabase. Only cryptographic SHA-256 hashes are recorded on the Ethereum blockchain." },
    { q: "What happens if an officer closes a grievance without resolving it?", a: "Citizens have the exclusive right to Accept or Reject resolution proposals. Rejecting a resolution reopens the grievance on-chain, incrementing the reopenCount." },
    { q: "How are SLA deadlines enforced?", a: "The EscalationManager smart contract records exact timestamps for each priority level. If an officer exceeds the deadline, the grievance status turns OVERDUE / ESCALATED." }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold text-white text-center">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
            <h3 className="text-base font-bold text-white">{f.q}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

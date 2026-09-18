import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Contact System Support</h1>
        <p className="text-xs text-slate-400">Reach public grievance administration or report technical portal issues.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Your Email</label>
            <input type="email" placeholder="you@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Subject</label>
            <input type="text" placeholder="Inquiry / Support Request" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
          </div>
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Message</label>
            <textarea rows={4} placeholder="Your message..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" />
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2">
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

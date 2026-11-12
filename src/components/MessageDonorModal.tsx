import React, { useState } from 'react';
import { Donor, User } from '../types';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle,
  Share2,
  Clock
} from 'lucide-react';

interface MessageDonorModalProps {
  donor: Donor | null;
  onClose: () => void;
  currentUser: User | null;
}

export const MessageDonorModal: React.FC<MessageDonorModalProps> = ({
  donor,
  onClose,
  currentUser,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);

  if (!donor) return null;

  const templates = [
    `Hi ${donor.name}, I found your contact on Blood Buddy Connect. We are in urgent need of ${donor.bloodGroup} blood in ${donor.city}. Are you currently available to donate? Thank you so much!`,
    `Hello ${donor.name}, urgent hospital emergency request for blood group ${donor.bloodGroup}. Please reply if you are available to donate today. Thank you for being a registered donor!`,
    `Hi ${donor.name}, we have a scheduled patient transfusion upcoming in ${donor.city}. We would deeply appreciate your support with a ${donor.bloodGroup} donation. Can we connect?`,
  ];

  const [customMessage, setCustomMessage] = useState(templates[0]);

  const handleSelectTemplate = (index: number) => {
    setSelectedTemplate(index);
    setCustomMessage(templates[index]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Contact: ${donor.name} (${donor.phone}) - Blood Type: ${donor.bloodGroup}\nMessage:\n${customMessage}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Clean phone number for links
  const cleanPhone = donor.phone.replace(/[^0-9+]/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white text-red-600 font-black text-xl flex items-center justify-center shadow-lg">
              {donor.bloodGroup}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{donor.name}</h3>
                {donor.isAvailable ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                    ● Available Now
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white/80">
                    Temporarily Resting
                  </span>
                )}
              </div>
              <p className="text-xs text-rose-100 mt-1 flex items-center gap-1.5">
                <span>📍 {donor.city}</span>
                <span>•</span>
                <span>📞 {donor.phone}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Direct Calling & Messaging Action Row */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Direct Contact Options
            </label>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-98"
              >
                <Phone className="w-4 h-4" />
                <span>Call Directly</span>
              </a>

              <a
                href={`sms:${cleanPhone}?body=${encodeURIComponent(customMessage)}`}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all active:scale-98"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send SMS</span>
              </a>
            </div>
          </div>

          {/* Quick WhatsApp / Direct Web Link */}
          <div className="flex gap-2">
            <a
              href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(customMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>WhatsApp Message</span>
            </a>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-xs text-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Details!' : 'Copy Info'}</span>
            </button>
          </div>

          {/* Templates selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Choose Message Template
              </label>
              <span className="text-[11px] text-slate-600">Click to load</span>
            </div>
            <div className="space-y-1.5">
              {['🚨 Urgent Hospital Emergency', '🩸 Availability Inquiry', '🏥 Scheduled Surgery Coordination'].map((title, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectTemplate(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium border transition-all ${
                    selectedTemplate === idx
                      ? 'border-red-500 bg-rose-50 text-red-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Message Content (can be edited)
            </label>
            <textarea
              rows={4}
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Medical & safety notice */}
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Emergency Tip:</strong> Always verify with hospital staff beforehand. Whole blood donations are completely voluntary and organized in authorized medical centers.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

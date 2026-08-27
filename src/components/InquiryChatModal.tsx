import React, { useState } from 'react';
import { 
  X, 
  Send, 
  PhoneCall, 
  MessageSquare, 
  CheckCheck, 
  Building2, 
  FileText,
  Clock
} from 'lucide-react';
import { InquiryMessage, RequirementItem, SellerProfile } from '../types';

interface InquiryChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement?: RequirementItem;
  seller?: SellerProfile;
  messages: InquiryMessage[];
  onSendMessage: (text: string) => void;
  currentUserRole: 'buyer' | 'seller';
}

export const InquiryChatModal: React.FC<InquiryChatModalProps> = ({
  isOpen,
  onClose,
  requirement,
  seller,
  messages,
  onSendMessage,
  currentUserRole
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const relevantMessages = messages.filter(m => 
    !requirement || m.requirementId === requirement.id
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full h-[540px] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Chat Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {seller ? seller.businessName : 'B2B Supplier Communication'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {requirement ? `Ref: RFQ #${requirement.id} (${requirement.productName})` : 'Direct Inquiry'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {seller && (
              <a
                href={`tel:${seller.phone}`}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 cursor-pointer"
                title="Call Seller"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* RFQ Context Banner */}
        {requirement && (
          <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 text-xs text-blue-900 flex items-center justify-between shrink-0">
            <span className="font-semibold truncate">
              {requirement.productName} ({requirement.quantity} {requirement.unit})
            </span>
            <span className="text-[11px] text-blue-700 font-mono">
              📍 {requirement.deliveryLocation.city}
            </span>
          </div>
        )}

        {/* Message Bubble Feed */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-50 text-xs">
          {relevantMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No previous messages. Start discussion regarding delivery, test certificate or pricing.
            </div>
          ) : (
            relevantMessages.map((msg) => {
              const isMine = msg.senderRole === currentUserRole;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-1 px-1">
                    {msg.senderName}
                  </span>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <div
                      className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${
                        isMine ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      <Clock className="w-2.5 h-2.5" />
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMine && <CheckCheck className="w-3 h-3 text-blue-300" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Chat Input Footer */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question or clarification here..."
            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

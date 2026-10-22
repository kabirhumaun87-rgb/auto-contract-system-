import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  Maximize2, 
  RotateCcw,
  Minimize2,
  Trash2,
  Brain,
  Zap
} from 'lucide-react';
import { 
  GeminiChatService, 
  ChatMessage, 
  CHATBOT_ROLES, 
  GEMINI_MODELS, 
  GeminiModelId 
} from '../services/geminiChatService';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ContractProject } from '../types/contract';

interface GeminiQuickChatWidgetProps {
  onOpenFullChat: () => void;
  activeProject?: ContractProject | null;
}

export const GeminiQuickChatWidget: React.FC<GeminiQuickChatWidgetProps> = ({ 
  onOpenFullChat,
  activeProject 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<GeminiModelId>('gemini-3.8-flash');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('mes_contract_advisor');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedRole = CHATBOT_ROLES.find(r => r.id === selectedRoleId) || CHATBOT_ROLES[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `qw_${Date.now()}_u`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newThread = [...messages, userMsg];
    setMessages(newThread);
    setIsLoading(true);

    let context = '';
    if (activeProject) {
      context = `Current Active Project: ${activeProject.nameOfWork || activeProject.projectName} (Contract No: ${activeProject.contractNo || 'N/A'}, Contractor: ${activeProject.contractorName || 'N/A'}, Amount: Tk. ${activeProject.totalContractPrice || 0})`;
    }

    try {
      const reply = await GeminiChatService.sendChatMessage(
        newThread,
        selectedModel,
        selectedRole.systemInstruction,
        context
      );

      const assistantMsg: ChatMessage = {
        id: `qw_${Date.now()}_a`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
        modelUsed: selectedModel,
      };

      setMessages([...newThread, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `qw_${Date.now()}_err`,
        role: 'assistant',
        content: err.message || 'Error communicating with Gemini.',
        timestamp: new Date().toISOString(),
        isError: true,
        modelUsed: selectedModel,
      };
      setMessages([...newThread, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 select-none group"
          title="Open Gemini Contract Assistant"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span className="text-xs font-semibold tracking-tight">Ask Gemini AI</span>
        </button>
      )}

      {/* Floating Drawer / Popup Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-96 sm:w-[440px] h-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5 leading-tight">
                  Gemini Chatbot
                  <span className="text-[10px] font-mono bg-blue-700/80 px-1.5 py-0.2 rounded text-blue-100">
                    {selectedModel.replace('gemini-', '')}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                  {selectedRole.title}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullChat();
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="Expand to Full Workspace Tab"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model & Persona Toolbar */}
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-[11px]">
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-0.5 text-[11px] font-medium text-slate-700 max-w-[220px] truncate"
            >
              {CHATBOT_ROLES.map(r => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>

            <div className="flex items-center gap-1">
              {GEMINI_MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                    selectedModel === m.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                  title={m.bestFor}
                >
                  {m.id === 'gemini-4-argon' ? 'argon' : m.id === 'gemini-3.1-flash-lite' ? 'lite' : '3.8'}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 bg-slate-50/50 space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                  <Bot className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">How can I help with your contract?</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                  Ask about PW-2 tender clauses, Schedule of Rates, BOQ measurements, or delay notices.
                </p>

                <div className="space-y-1.5 mt-4 w-full">
                  <button
                    onClick={() => handleSend('What is the standard defect liability period and security deposit deduction in MES PW-2 contracts?')}
                    className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-[11px] text-slate-700 hover:text-blue-600 transition-colors shadow-2xs"
                  >
                    • Defect Liability & Security Deposit rules
                  </button>
                  <button
                    onClick={() => handleSend('What documents must be attached with PW-2 works contract schedule?')}
                    className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-[11px] text-slate-700 hover:text-blue-600 transition-colors shadow-2xs"
                  >
                    • Required PW-2 schedule attachments
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {messages.map(m => (
                  <ChatMessageBubble
                    key={m.id}
                    message={m}
                    onRetry={() => {
                      const lastUser = [...messages].reverse().find(msg => msg.role === 'user');
                      if (lastUser) handleSend(lastUser.content);
                    }}
                    roleTitle={selectedRole.badge}
                  />
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs text-slate-500">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                    <span>Gemini is thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Bottom Composer */}
          <div className="p-2.5 bg-white border-t border-slate-200">
            <div className="flex items-center gap-1.5">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Gemini a question..."
                disabled={isLoading}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white rounded-lg transition-colors shadow-xs"
                title="Send"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-slate-400">
              <span>Enter to send</span>
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="hover:text-rose-600 transition-colors"
                >
                  Clear thread
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Plus, 
  Trash2, 
  Download, 
  Settings2, 
  Check, 
  Building2, 
  Calculator, 
  ShieldAlert, 
  RotateCcw,
  MessageSquare,
  FileText,
  HelpCircle,
  ChevronDown,
  Info,
  Sliders,
  Cpu,
  Layers,
  Zap,
  Flame,
  Brain
} from 'lucide-react';
import { 
  GeminiChatService, 
  ChatSession, 
  ChatMessage, 
  GEMINI_MODELS, 
  CHATBOT_ROLES, 
  GeminiModelId,
  ChatbotRole
} from '../services/geminiChatService';
import { ChatMessageBubble } from './ChatMessageBubble';
import { ContractProject } from '../types/contract';

interface GeminiChatViewProps {
  projects?: ContractProject[];
  initialActiveProjectId?: string;
}

export const GeminiChatView: React.FC<GeminiChatViewProps> = ({ 
  projects = [],
  initialActiveProjectId 
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Customization & Controls
  const [selectedRole, setSelectedRole] = useState<ChatbotRole>(CHATBOT_ROLES[0]);
  const [selectedModel, setSelectedModel] = useState<GeminiModelId>('gemini-3.8-flash');
  const [attachProjectContext, setAttachProjectContext] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialActiveProjectId || (projects[0]?.id || ''));
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [customSystemInstruction, setCustomSystemInstruction] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chat sessions on mount
  useEffect(() => {
    const loadedSessions = GeminiChatService.getSessions();
    setSessions(loadedSessions);

    const storedActiveId = GeminiChatService.getActiveSessionId();
    if (storedActiveId && loadedSessions.some(s => s.id === storedActiveId)) {
      setActiveSessionId(storedActiveId);
    } else if (loadedSessions.length > 0) {
      setActiveSessionId(loadedSessions[0].id);
    }
  }, []);

  // Sync active session role & model
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    if (activeSession) {
      const role = CHATBOT_ROLES.find(r => r.id === activeSession.roleId) || CHATBOT_ROLES[0];
      setSelectedRole(role);
      setSelectedModel(activeSession.model || 'gemini-3.8-flash');
      setCustomSystemInstruction(role.systemInstruction);
      if (activeSession.attachedProjectId) {
        setSelectedProjectId(activeSession.attachedProjectId);
        setAttachProjectContext(true);
      }
    }
  }, [activeSessionId]);

  // Save sessions to storage whenever they change
  const updateSessions = (updated: ChatSession[]) => {
    setSessions(updated);
    GeminiChatService.saveSessions(updated);
  };

  // Scroll to bottom of message thread
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, isLoading]);

  // Create new chat session
  const handleNewSession = (roleId?: string) => {
    const rId = roleId || selectedRole.id;
    const newSession = GeminiChatService.createNewSession(rId, selectedModel);
    const updated = [newSession, ...sessions];
    updateSessions(updated);
    setActiveSessionId(newSession.id);
    GeminiChatService.setActiveSessionId(newSession.id);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  // Switch session
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    GeminiChatService.setActiveSessionId(id);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  // Delete session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length === 1) {
      // If deleting the only session, replace with fresh one
      const fresh = GeminiChatService.createNewSession();
      updateSessions([fresh]);
      setActiveSessionId(fresh.id);
      return;
    }

    const filtered = sessions.filter(s => s.id !== id);
    updateSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered[0].id);
      GeminiChatService.setActiveSessionId(filtered[0].id);
    }
  };

  // Clear all sessions
  const handleClearAllSessions = () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      const fresh = GeminiChatService.createNewSession();
      updateSessions([fresh]);
      setActiveSessionId(fresh.id);
    }
  };

  // Export transcript as Markdown
  const handleExportTranscript = () => {
    if (!activeSession || activeSession.messages.length === 0) return;
    const lines = [
      `# Chat Transcript: ${activeSession.title}`,
      `**Model**: ${activeSession.model}`,
      `**Role**: ${selectedRole.title}`,
      `**Date**: ${new Date(activeSession.createdAt).toLocaleString()}`,
      `\n---\n`,
    ];

    activeSession.messages.forEach(m => {
      lines.push(`### ${m.role === 'user' ? 'User' : 'Gemini Assistant'} (${new Date(m.timestamp).toLocaleTimeString()}):`);
      lines.push(`${m.content}\n`);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Gemini_Chat_${activeSession.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputMessage).trim();
    if (!content || isLoading || !activeSession) return;

    setInputMessage('');

    // Format new user message
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    // Update active session title if it's the first message
    const isFirstMessage = activeSession.messages.length === 0;
    const newTitle = isFirstMessage 
      ? (content.slice(0, 36) + (content.length > 36 ? '...' : '')) 
      : activeSession.title;

    const currentMessages = [...activeSession.messages, userMsg];

    // Optimistically update UI
    const updatedSession: ChatSession = {
      ...activeSession,
      title: newTitle,
      model: selectedModel,
      roleId: selectedRole.id,
      attachedProjectId: attachProjectContext ? selectedProjectId : undefined,
      updatedAt: new Date().toISOString(),
      messages: currentMessages,
    };

    const nextSessions = sessions.map(s => s.id === activeSession.id ? updatedSession : s);
    updateSessions(nextSessions);
    setIsLoading(true);

    // Prepare contract context if toggled
    let contractContextString = '';
    if (attachProjectContext && selectedProjectId) {
      const proj = projects.find(p => p.id === selectedProjectId);
      if (proj) {
        contractContextString = `
Project Name: ${proj.nameOfWork || proj.projectName || 'N/A'}
Contract No / CA No: ${proj.contractNo || 'N/A'}
Contractor: ${proj.contractorName || 'N/A'}
Contract Value: Tk. ${proj.totalContractPrice || 0}
Completion Time: ${proj.completionTime || proj.pccCompletionPeriod || 'N/A'}
Date of Contract: ${proj.dateOfContract || 'N/A'}
Total BOQ Items: ${proj.boqItems?.length || 0}
BOQ Items Sample:
${(proj.boqItems || []).slice(0, 8).map((b, i) => `${i + 1}. ${b.description} | Unit: ${b.unit} | Qty: ${b.quantity} | Rate: Tk. ${b.unitRate || 0} | Total: Tk. ${b.amount || 0}`).join('\n')}
`.trim();
      }
    }

    try {
      const reply = await GeminiChatService.sendChatMessage(
        currentMessages,
        selectedModel,
        customSystemInstruction || selectedRole.systemInstruction,
        contractContextString
      );

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now()}_a`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
        modelUsed: selectedModel,
      };

      const finalSession: ChatSession = {
        ...updatedSession,
        updatedAt: new Date().toISOString(),
        messages: [...currentMessages, assistantMsg],
      };

      updateSessions(sessions.map(s => s.id === activeSession.id ? finalSession : s));
    } catch (err: any) {
      console.error('Chat generation error:', err);
      const errorMsg: ChatMessage = {
        id: `msg_${Date.now()}_err`,
        role: 'assistant',
        content: err.message || 'Failed to communicate with Gemini. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true,
        modelUsed: selectedModel,
      };

      const finalSession: ChatSession = {
        ...updatedSession,
        updatedAt: new Date().toISOString(),
        messages: [...currentMessages, errorMsg],
      };

      updateSessions(sessions.map(s => s.id === activeSession.id ? finalSession : s));
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Preset suggested prompts
  const SUGGESTED_PROMPTS = [
    {
      title: 'Tender Security & Earnest Money',
      prompt: 'How is Earnest Money (Tender Security) and Performance Security computed and managed in MES PW-2 contracts under PPR 2008 in Bangladesh?',
      roleId: 'mes_contract_advisor'
    },
    {
      title: 'RCC 1:2:4 Material Takeoff',
      prompt: 'Calculate the required bags of cement, cft of sand, and cft of stone chips for 100 Cum of 1:2:4 RCC work with 1.5 dry volume factor.',
      roleId: 'boq_estimator'
    },
    {
      title: 'Notice for Construction Delay',
      prompt: 'Draft a formal official notice to a contractor under MES PW-2 standard conditions regarding slow progress and failure to achieve targeted milestones within the scheduled completion period.',
      roleId: 'legal_auditor'
    },
    {
      title: 'Pre-Contract Signing Checklist',
      prompt: 'Provide a comprehensive checklist of all documents, stamps, and DGFI/tax verifications required before the signing and execution of an MES PW-2 works contract.',
      roleId: 'mes_contract_advisor'
    }
  ];

  return (
    <div className="flex h-[calc(100vh-7.5rem)] rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* ================= LEFT SIDEBAR: SESSIONS HISTORY ================= */}
      <aside className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 select-none">
        {/* Sidebar Header */}
        <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Gemini Chatbot</div>
              <div className="text-[10px] text-slate-500 font-medium">Multi-turn Assistant</div>
            </div>
          </div>
          <button
            onClick={() => handleNewSession()}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
            title="Start a new chat session"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Conversations</span>
            <span className="text-[10px] font-mono text-slate-400">{sessions.length}</span>
          </div>

          {sessions.map(s => {
            const isActive = s.id === activeSession?.id;
            const role = CHATBOT_ROLES.find(r => r.id === s.roleId) || CHATBOT_ROLES[0];
            return (
              <div
                key={s.id}
                onClick={() => handleSelectSession(s.id)}
                className={`group relative flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <MessageSquare className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate leading-snug">{s.title || 'New Conversation'}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-normal">
                      <span>{role.badge}</span>
                      <span>•</span>
                      <span>{s.messages.length} msg</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDeleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-600 text-slate-400 rounded transition-opacity"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Sessions Footer */}
        <div className="p-2 border-t border-slate-200 bg-white flex items-center justify-between text-[11px] text-slate-500">
          <button
            onClick={handleClearAllSessions}
            className="text-slate-500 hover:text-rose-600 px-2 py-1 rounded transition-colors text-[11px]"
          >
            Clear all chats
          </button>
          <span className="text-[10px] text-slate-400 font-mono">
            {activeSession?.messages.length || 0} active
          </span>
        </div>
      </aside>

      {/* ================= RIGHT MAIN: CHAT THREAD & CONTROLS ================= */}
      <section className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Control Bar */}
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          {/* Role & Model Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Role Dropdown */}
            <div className="relative">
              <select
                value={selectedRole.id}
                onChange={(e) => {
                  const role = CHATBOT_ROLES.find(r => r.id === e.target.value) || CHATBOT_ROLES[0];
                  setSelectedRole(role);
                  setCustomSystemInstruction(role.systemInstruction);
                  if (activeSession) {
                    updateSessions(sessions.map(s => s.id === activeSession.id ? { ...s, roleId: role.id } : s));
                  }
                }}
                className="bg-white border border-slate-300 rounded-md py-1 px-2.5 text-xs font-semibold text-slate-800 shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                {CHATBOT_ROLES.map(r => (
                  <option key={r.id} value={r.id}>
                    Role: {r.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Tier Selector (gemini-4-argon, gemini-3.8-flash, gemini-3.1-flash-lite) */}
            <div className="flex items-center bg-white border border-slate-300 rounded-md p-0.5 shadow-xs">
              {GEMINI_MODELS.map(m => {
                const isSelected = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModel(m.id);
                      if (activeSession) {
                        updateSessions(sessions.map(s => s.id === activeSession.id ? { ...s, model: m.id } : s));
                      }
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title={`${m.name}: ${m.bestFor}`}
                  >
                    {m.id === 'gemini-4-argon' && <Brain className="w-3 h-3" />}
                    {m.id === 'gemini-3.8-flash' && <Sparkles className="w-3 h-3" />}
                    {m.id === 'gemini-3.1-flash-lite' && <Zap className="w-3 h-3" />}
                    <span>{m.id.replace('gemini-', '')}</span>
                  </button>
                );
              })}
            </div>

            {/* System Instruction Inspector */}
            <button
              onClick={() => setShowRoleModal(true)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-md border border-transparent hover:border-slate-300 transition-colors text-xs flex items-center gap-1"
              title="Inspect or customize system instruction"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">System Prompt</span>
            </button>
          </div>

          {/* Right actions: Project Context & Export */}
          <div className="flex items-center gap-2">
            {/* Attach Project Context Toggle */}
            {projects.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-md text-xs">
                <input
                  type="checkbox"
                  id="attachContext"
                  checked={attachProjectContext}
                  onChange={(e) => setAttachProjectContext(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                />
                <label htmlFor="attachContext" className="text-[11px] font-medium text-slate-700 cursor-pointer select-none">
                  Attach Project
                </label>
                {attachProjectContext && (
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="ml-1 text-[11px] py-0.5 px-1.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-800 max-w-[140px] truncate"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.contractNo || p.nameOfWork?.slice(0, 20) || p.id}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Export Transcript */}
            <button
              onClick={handleExportTranscript}
              disabled={!activeSession || activeSession.messages.length === 0}
              className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 border border-slate-300 rounded-md transition-colors"
              title="Download chat transcript as Markdown"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Model & Role Info Strip */}
        <div className="px-4 py-2 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between text-[11px] text-blue-900">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{selectedRole.title}</span>
            <span className="text-blue-400">•</span>
            <span className="text-blue-700">{selectedRole.shortDesc}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded">
            <span>Model:</span>
            <strong className="font-bold">{selectedModel}</strong>
          </div>
        </div>

        {/* ================= SCROLLABLE MESSAGES THREAD ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/30">
          {(!activeSession || activeSession.messages.length === 0) ? (
            /* Welcome / Starter View */
            <div className="max-w-2xl mx-auto py-8">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  MES Works & Contract AI Advisor
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Ask questions about Military Engineer Services PW-2 contracts, Schedule of Rates, tender specifications, BOQ calculations, or drafting official notices.
                </p>
              </div>

              {/* Quick Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {SUGGESTED_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const role = CHATBOT_ROLES.find(r => r.id === item.roleId) || selectedRole;
                      setSelectedRole(role);
                      handleSendMessage(item.prompt);
                    }}
                    className="p-3 text-left bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs rounded-xl transition-all group cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 flex items-center justify-between">
                      <span>{item.title}</span>
                      <Send className="w-3 h-3 text-slate-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                      {item.prompt}
                    </p>
                  </button>
                ))}
              </div>

              {/* Model Capability Note */}
              <div className="p-3 bg-slate-100 rounded-lg text-[11px] text-slate-600 flex items-start gap-2 border border-slate-200">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Intelligence Tiers:</span>
                  <span className="ml-1">
                    Use <strong>gemini-3.8-flash</strong> for general contract tasks (Default), <strong>gemini-3.1-flash-lite</strong> for fast calculations and definitions, and <strong>gemini-4-argon</strong> for in-depth legal reasoning and audits.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Message List */
            <div className="max-w-4xl mx-auto">
              {activeSession.messages.map(msg => (
                <ChatMessageBubble
                  key={msg.id}
                  message={msg}
                  onRetry={() => {
                    // Retry last user message
                    const lastUserMsg = [...activeSession.messages].reverse().find(m => m.role === 'user');
                    if (lastUserMsg) {
                      handleSendMessage(lastUserMsg.content);
                    }
                  }}
                  roleTitle={selectedRole.badge}
                />
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-sm shadow-xs flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-slate-500 font-medium ml-1">
                      Gemini is generating response with {selectedModel}...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ================= BOTTOM INPUT COMPOSER ================= */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto">
            <div className="relative border border-slate-300 rounded-xl bg-white shadow-xs focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${selectedRole.title} a question, request a clause review, or paste specifications...`}
                rows={2}
                disabled={isLoading}
                className="w-full p-3 pr-12 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent resize-none focus:outline-hidden max-h-36"
              />

              {/* Send Button */}
              <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-xs"
                  title="Send message (Enter)"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 px-1">
              <span>Press <strong>Enter</strong> to send, <strong>Shift+Enter</strong> for newline</span>
              <span className="font-mono text-[10px]">
                {inputMessage.length} characters
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MODAL: SYSTEM INSTRUCTION CUSTOMIZATION ================= */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Custom System Instruction</h3>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-600">
                You can fine-tune the instructions given to the Gemini chatbot for this conversation. The model will adhere strictly to this persona.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Persona: {selectedRole.title}
                </label>
                <textarea
                  value={customSystemInstruction}
                  onChange={(e) => setCustomSystemInstruction(e.target.value)}
                  rows={8}
                  className="w-full text-xs font-mono p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCustomSystemInstruction(selectedRole.systemInstruction)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Reset to Role Default
                </button>
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium shadow-xs"
                >
                  Apply Instructions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

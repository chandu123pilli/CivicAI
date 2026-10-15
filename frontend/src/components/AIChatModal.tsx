import React, { useState, useRef, useEffect } from 'react';
import { aiService, ChatMessage } from '../services/aiService';
import { Sparkles, X, Send, Bot, User, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm CivicAI Assistant. I can help you report civic issues, track your complaint progress, check department routing, or find recent community issues. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [relatedIssues, setRelatedIssues] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText: string = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.chat(textToSend, messages);
      setMessages((prev) => [...prev, { role: 'assistant', content: response.reply }]);
      if (response.related_issues && response.related_issues.length > 0) {
        setRelatedIssues(response.related_issues);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm temporarily having trouble connecting to the civic intelligence service. You can still file complaints using the 'Report Issue' page or track existing ones by their Tracking ID.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const quickPrompts = [
    'How do I report a civic issue?',
    'How does complaint status work?',
    'What are recent community issues?',
    'Check CIVIC-2026-A10101',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200 h-[560px]">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5 font-heading">
              CivicAI Virtual Assistant
            </h3>
            <p className="text-[11px] text-cyan-300 font-medium">Real-time civic assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Close Assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed shadow-xs whitespace-pre-line ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs font-medium'
                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
              }`}
            >
              {m.content}
            </div>
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-500 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 max-w-[60%]">
            <Bot className="w-4 h-4 text-blue-600 animate-bounce" />
            <span className="text-xs">Analyzing civic records...</span>
          </div>
        )}

        {/* Related Issues Card Preview */}
        {relatedIssues.length > 0 && (
          <div className="mt-2 p-3 bg-blue-50/80 rounded-xl border border-blue-200 space-y-2">
            <span className="text-[11px] font-bold text-blue-900 block uppercase tracking-wider">
              Relevant Community Complaints:
            </span>
            {relatedIssues.map((ri, i) => (
              <div
                key={i}
                className="bg-white p-2.5 rounded-lg border border-blue-100 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{ri.tracking_id}</div>
                  <div className="text-slate-600 truncate max-w-[200px]">{ri.title}</div>
                  <div className="text-[10px] text-blue-600">{ri.status} • {ri.category}</div>
                </div>
                <Link
                  to={`/issues/${ri.id}`}
                  onClick={onClose}
                  className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Pills */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p)}
            className="flex-shrink-0 text-[11px] font-medium bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or enter tracking ID..."
          className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white disabled:opacity-50 hover:from-blue-700 hover:to-cyan-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

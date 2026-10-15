import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { ToastContainer } from '../components/ToastContainer';
import { AIChatModal } from '../components/AIChatModal';
import { Sparkles, MessageSquare } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50 w-64 h-full">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main App Window */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onOpenAIChat={() => setChatOpen(true)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating AI Assistant Trigger Button (Bottom Right) */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-semibold text-xs shadow-xl shadow-blue-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          aria-label="Open AI Civic Assistant"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 group-hover:rotate-12 transition-transform" />
          </div>
          <span>Ask CivicAI</span>
        </button>
      )}

      {/* AI Chat Modal */}
      <AIChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

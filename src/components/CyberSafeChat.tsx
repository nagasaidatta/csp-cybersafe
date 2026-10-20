import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  ArrowUp,
  X,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  Link2,
  MessageSquareWarning,
  KeyRound,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  User
} from 'lucide-react';
import { ViewState } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  redirects?: Array<{ hash: string; view: ViewState; label: string }>;
}

interface CyberSafeChatProps {
  onNavigate: (view: ViewState, redirectTo?: ViewState) => void;
  currentView?: ViewState;
}

const STORAGE_KEY_POS = 'csp_ai_logo_pos';

export const CyberSafeChat: React.FC<CyberSafeChatProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  // Floating Logo Position State
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_POS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
            const screenWidth = window.innerWidth;
            const buttonWidth = 48;
            const edgeMargin = 16;
            const targetX = parsed.x < screenWidth / 2 ? edgeMargin : screenWidth - buttonWidth - edgeMargin;
            const targetY = Math.min(Math.max(edgeMargin, parsed.y), window.innerHeight - buttonWidth - edgeMargin);
            return { x: targetX, y: targetY };
          }
        }
      } catch {
        // ignore
      }
      return {
        x: Math.max(16, window.innerWidth - 64),
        y: Math.max(16, window.innerHeight - 80)
      };
    }
    return { x: 500, y: 500 };
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am **CyberSafe AI**.

Ask any question about **cybersecurity**, **spotting scams**, or using our **portal tools** in English, తెలుగు, or हिन्दी.`
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Dragging state references
  const isDraggingRef = useRef(false);
  const latestPosRef = useRef<{ x: number; y: number }>({ x: position.x, y: position.y });
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: position.x,
    initialY: position.y
  });

  // Keep button snapped within window on resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const screenWidth = window.innerWidth;
        const buttonWidth = 48;
        const edgeMargin = 16;
        const targetX = prev.x < screenWidth / 2 ? edgeMargin : screenWidth - buttonWidth - edgeMargin;
        const targetY = Math.min(Math.max(edgeMargin, prev.y), window.innerHeight - buttonWidth - edgeMargin);
        return { x: targetX, y: targetY };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => chatInputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Close chat when clicking/touching outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    // Small delay so opening tap/click does not immediately close the window
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    }, 100);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Pointer drag start handler
  const handlePointerDown = (clientX: number, clientY: number) => {
    isDraggingRef.current = false;
    setIsDragging(false);
    latestPosRef.current = { x: position.x, y: position.y };
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: position.x,
      initialY: position.y
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = currentX - dragStartRef.current.startX;
      const dy = currentY - dragStartRef.current.startY;

      if (!isDraggingRef.current && Math.hypot(dx, dy) > 5) {
        isDraggingRef.current = true;
        setIsDragging(true);
      }

      if (isDraggingRef.current) {
        const nextX = Math.min(Math.max(12, dragStartRef.current.initialX + dx), window.innerWidth - 60);
        const nextY = Math.min(Math.max(12, dragStartRef.current.initialY + dy), window.innerHeight - 60);
        latestPosRef.current = { x: nextX, y: nextY };
        setPosition({ x: nextX, y: nextY });
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      if (isDraggingRef.current) {
        setIsDragging(false);
        // Snap smoothly to nearest side (left or right)
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
        const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 600;
        const buttonWidth = 48; // w-12 is 48px
        const edgeMargin = 16;

        const currentCenterX = latestPosRef.current.x + buttonWidth / 2;
        const snapLeftX = edgeMargin;
        const snapRightX = screenWidth - buttonWidth - edgeMargin;
        const targetX = currentCenterX < screenWidth / 2 ? snapLeftX : snapRightX;
        const targetY = Math.min(Math.max(edgeMargin, latestPosRef.current.y), screenHeight - buttonWidth - edgeMargin);

        const snapped = { x: targetX, y: targetY };
        latestPosRef.current = snapped;
        setPosition(snapped);

        try {
          localStorage.setItem(STORAGE_KEY_POS, JSON.stringify(snapped));
        } catch {
          // ignore
        }
      } else {
        setIsDragging(false);
        setIsOpen((prev) => !prev);
      }
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
  };

  // Send message
  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          userLanguage: language
        })
      });

      const data = await res.json();

      if (data?.success && data?.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: data.message.content,
            redirects: data.redirects || []
          }
        ]);
      } else if (data?.fallbackResponse) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: data.fallbackResponse.content,
            redirects: data.fallbackResponse.redirects || []
          }
        ]);
      } else {
        const fallback = getFallback(query, language);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: fallback.content,
            redirects: fallback.redirects
          }
        ]);
      }
    } catch {
      const fallback = getFallback(query, language);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: fallback.content,
          redirects: fallback.redirects
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Conversation restarted. Ask any cybersecurity or scam related question in English, Telugu, or Hindi.`
      }
    ]);
  };

  const handleNavigateTo = (view: ViewState) => {
    onNavigate(view);
  };

  // Dynamically compute chat window position relative to the floating AI button
  const getChatWindowPosition = (): React.CSSProperties => {
    if (typeof window === 'undefined') {
      return { bottom: '16px', right: '16px' };
    }

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isMobile = screenWidth < 640;

    const buttonSize = 48;
    const edgeMargin = isMobile ? 12 : 20;

    const chatWidth = isMobile ? Math.min(320, screenWidth * 0.82) : 410;
    const chatHeight = isMobile ? Math.min(390, screenHeight * 0.65) : 520;

    const isLeft = position.x < screenWidth / 2;
    const isTop = position.y < screenHeight / 2;

    const style: React.CSSProperties = {};

    // Horizontal placement
    if (isLeft) {
      if (!isMobile && position.x + buttonSize + 12 + chatWidth <= screenWidth - edgeMargin) {
        style.left = `${position.x + buttonSize + 12}px`;
      } else {
        style.left = `${Math.max(edgeMargin, Math.min(position.x, screenWidth - chatWidth - edgeMargin))}px`;
      }
      style.right = 'auto';
    } else {
      // Right side (default side)
      const distFromRight = screenWidth - (position.x + buttonSize);
      if (distFromRight <= 36 || isMobile) {
        // Default place or near right edge
        style.right = `${edgeMargin}px`;
      } else if (!isMobile && position.x - 12 - chatWidth >= edgeMargin) {
        style.right = `${Math.max(edgeMargin, distFromRight + buttonSize + 12)}px`;
      } else {
        style.right = `${edgeMargin}px`;
      }
      style.left = 'auto';
    }

    // Vertical placement
    if (isTop) {
      // Near top: position window below or aligned with the logo
      const idealTop = position.y + buttonSize + 8;
      if (idealTop + chatHeight <= screenHeight - edgeMargin) {
        style.top = `${idealTop}px`;
        style.bottom = 'auto';
      } else {
        style.top = `${Math.max(edgeMargin, Math.min(position.y, screenHeight - chatHeight - edgeMargin))}px`;
        style.bottom = 'auto';
      }
    } else {
      // Near bottom (default place): position window at the bottom edge or above button
      const distFromBottom = screenHeight - (position.y + buttonSize);
      if (distFromBottom <= 40 || isMobile) {
        // Default place is at the bottom margin
        style.bottom = `${edgeMargin}px`;
        style.top = 'auto';
      } else {
        const idealBottom = distFromBottom + buttonSize + 8;
        if (idealBottom + chatHeight <= screenHeight - edgeMargin) {
          style.bottom = `${idealBottom}px`;
          style.top = 'auto';
        } else {
          style.bottom = `${Math.max(edgeMargin, Math.min(distFromBottom, screenHeight - chatHeight - edgeMargin))}px`;
          style.top = 'auto';
        }
      }
    }

    return style;
  };

  const renderContent = (text: string) => {
    const lines = text.split('\n');

    return (
      <div className="space-y-1.5 leading-relaxed text-[13px] sm:text-sm text-slate-800">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }

          if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
            return (
              <h4 key={idx} className="font-semibold text-slate-900 text-xs sm:text-sm mt-2 mb-0.5">
                {line.replace(/^#+\s*/, '')}
              </h4>
            );
          }

          const isBullet = line.startsWith('- ') || line.startsWith('* ');
          const formattedLine = isBullet ? line.slice(2) : line;

          return (
            <div key={idx} className={isBullet ? 'flex items-start gap-1.5 pl-0.5' : ''}>
              {isBullet && <span className="text-slate-400 font-bold shrink-0 mt-0.5">•</span>}
              <div className="flex-1">
                {parseFormattedText(formattedLine, handleNavigateTo)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MINIMAL MOVABLE AI / BOT LAUNCHER BUTTON                               */}
      {/* ========================================================================= */}
      <div
        ref={buttonRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 99999,
          touchAction: 'none',
          transition: isDragging
            ? 'none'
            : 'left 0.35s cubic-bezier(0.2, 0.9, 0.3, 1), top 0.35s ease-out, opacity 0.2s ease, transform 0.2s ease'
        }}
        className={`select-none transition-all duration-200 ${
          isOpen ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100 scale-100 pointer-events-auto'
        }`}
        aria-hidden={isOpen}
      >
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handlePointerDown(e.clientX, e.clientY);
          }}
          onTouchStart={(e) => {
            if (e.touches.length > 0) {
              handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          aria-label="Open CyberSafe AI Chat"
          title="CyberSafe AI (Drag to move)"
          className={`w-12 h-12 rounded-full aspect-square bg-slate-900 hover:bg-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all cursor-grab active:cursor-grabbing border border-slate-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
            isOpen ? 'ring-2 ring-slate-900 ring-offset-2' : ''
          }`}
        >
          <div className="flex flex-col items-center justify-center select-none leading-none">
            <Bot className="w-4.5 h-4.5 text-white" />
            <span className="text-[9px] font-black tracking-widest text-white mt-0.5">AI</span>
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHATGPT / GEMINI MINIMAL CHAT WINDOW & BACKDROP                        */}
      {/* ========================================================================= */}
      {/* Backdrop overlay: touching/clicking anywhere outside closes chat */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[99998] bg-black/20 sm:bg-black/5 backdrop-blur-[0.5px] transition-opacity cursor-pointer animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
          onTouchEnd={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {isOpen && (
        <div
          ref={chatWindowRef}
          role="dialog"
          aria-label="CyberSafe AI"
          style={getChatWindowPosition()}
          className="fixed z-[99999] flex flex-col w-[82vw] max-w-[320px] sm:max-w-none sm:w-[410px] md:w-[420px] h-[390px] sm:h-[520px] max-h-[65dvh] sm:max-h-[calc(100vh-80px)] bg-white border border-slate-200/90 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.22)] overflow-hidden transition-all duration-150 animate-in fade-in"
        >
          {/* Minimal Header */}
          <div className="h-11 sm:h-14 px-3 sm:px-5 bg-white border-b border-slate-100 flex items-center justify-between gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0 select-none">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center">
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-900 leading-none">CyberSafe AI</h3>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5 sm:mt-1">
                  Cybersecurity Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Restart chat"
                aria-label="Restart chat"
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2.5 sm:space-y-4 bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'user' ? (
                  /* ChatGPT / Gemini style user pill */
                  <div className="bg-[#f4f4f5] text-slate-900 rounded-2xl sm:rounded-3xl rounded-br-xs px-3 py-2 sm:px-4 sm:py-2.5 max-w-[88%] sm:max-w-[85%] text-xs sm:text-sm leading-relaxed">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ) : (
                  /* Assistant message */
                  <div className="flex items-start gap-2 sm:gap-3 max-w-[95%] sm:max-w-[92%]">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-2xs shrink-0 mt-0.5 select-none">
                      <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                    </div>

                    <div className="flex-1 space-y-1.5 sm:space-y-2">
                      <div className="text-slate-800 text-xs sm:text-sm leading-relaxed">
                        {renderContent(msg.content)}
                      </div>

                      {/* Action Redirection Buttons */}
                      {msg.redirects && msg.redirects.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                          {msg.redirects.map((redir, rIdx) => (
                            <button
                              key={rIdx}
                              type="button"
                              onClick={() => handleNavigateTo(redir.view)}
                              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-800 bg-[#f4f4f5] hover:bg-slate-200/80 rounded-xl transition-colors group cursor-pointer"
                            >
                              <span>{redir.label}</span>
                              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-2xs shrink-0 mt-0.5 select-none">
                  <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </div>
                <div className="flex items-center gap-1.5 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ChatGPT Style Minimal Input Bar */}
          <div className="p-2 sm:p-3 sm:px-4 bg-white border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5 sm:gap-2 bg-[#f4f4f5] focus-within:bg-[#f0f0f2] rounded-3xl px-3 sm:px-4 py-1 sm:py-1.5 transition-all"
            >
              <input
                ref={chatInputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message CyberSafe AI..."
                className="flex-1 bg-transparent py-1 sm:py-1.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white disabled:text-slate-400 flex items-center justify-center transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
              >
                <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Parses markdown links, bold, code, and renders clean redirects.
 */
function parseFormattedText(text: string, onNavigate: (view: ViewState) => void) {
  const regex = /(\[.*?\]\(#?[a-z0-9\-_./:]+\)|\*\*.*?\*\*|`.*?`)/gi;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const target = linkMatch[2];

      if (target.startsWith('#')) {
        const viewName = target.replace('#', '') as ViewState;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onNavigate(viewName)}
            className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-800 underline underline-offset-2 mx-0.5 cursor-pointer"
          >
            {getViewIcon(viewName)}
            <span>{label}</span>
          </button>
        );
      }

      return (
        <a
          key={index}
          href={target}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-semibold text-blue-700 hover:underline mx-0.5"
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 inline text-blue-700" />
        </a>
      );
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-xs">
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

function getViewIcon(view: ViewState) {
  switch (view) {
    case 'link-safety':
      return <Link2 className="w-3 h-3 text-blue-600 inline" />;
    case 'message-safety':
      return <MessageSquareWarning className="w-3 h-3 text-amber-600 inline" />;
    case 'password-checker':
      return <KeyRound className="w-3 h-3 text-emerald-600 inline" />;
    case 'modules':
      return <GraduationCap className="w-3 h-3 text-indigo-600 inline" />;
    case 'quiz':
      return <HelpCircle className="w-3 h-3 text-purple-600 inline" />;
    case 'dashboard':
      return <LayoutDashboard className="w-3 h-3 text-slate-600 inline" />;
    case 'profile':
      return <User className="w-3 h-3 text-slate-600 inline" />;
    default:
      return <ArrowRight className="w-3 h-3 text-blue-600 inline" />;
  }
}

function getFallback(query: string, lang: string) {
  const lower = query.toLowerCase();

  // Questions about creators / who developed you / history
  if (
    lower.includes('who developed') ||
    lower.includes('who made') ||
    lower.includes('who created') ||
    lower.includes('developer') ||
    lower.includes('history') ||
    lower.includes('ఎవరు తయారు') ||
    lower.includes('ఎవరు డెవలప్') ||
    lower.includes('किसने बनाया')
  ) {
    if (lang === 'te') {
      return {
        content: `నన్ను మరియు ఈ CyberSafe వెబ్‌సైట్‌ను **శ్రీ వాసవి ఇంజనీరింగ్ కాలేజీ (SVEC)** ఇంజనీరింగ్ విద్యార్థుల బృందం ప్రజలను ఆన్‌లైన్ మోసాల నుండి రక్షించడానికి అభివృద్ధి చేశారు.`,
        redirects: [{ hash: '#modules', view: 'modules' as ViewState, label: '🎓 Start Learning Modules' }]
      };
    }
    if (lang === 'hi') {
      return {
        content: `मुझे और इस CyberSafe पोर्टल को **श्री वास्वी इंजीनियरिंग कॉलेज (SVEC)** के इंजीनियरिंग छात्रों के दल ने नागरिकों को डिजिटल फ्रॉड से बचाने के लिए बनाया है।`,
        redirects: [{ hash: '#modules', view: 'modules' as ViewState, label: '🎓 Start Learning Modules' }]
      };
    }
    return {
      content: `I and the CyberSafe portal were created by engineering students of **Sri Vasavi Engineering College (SVEC)** to protect citizens from digital fraud and online scams.`,
      redirects: [{ hash: '#modules', view: 'modules' as ViewState, label: '🎓 Start Learning Modules' }]
    };
  }

  const isIrrelevant = [
    'recipe', 'cook', 'food', 'movie', 'actor', 'cricket', 'song',
    'weather', 'politics', 'joke', 'math', 'homework', 'python code to', 'write an essay'
  ].some((k) => lower.includes(k));

  if (isIrrelevant) {
    if (lang === 'te') {
      return {
        content: `నేను కేవలం సైబర్ సెక్యూరిటీ, ఆన్‌లైన్ మోసాలు మరియు మన సైబర్‌సేఫ్ పోర్టల్ సేవలపై మాత్రమే సమాధానాలు ఇవ్వగలను. దయచేసి సైబర్ భద్రత గురించి అడగండి.`,
        redirects: []
      };
    }
    if (lang === 'hi') {
      return {
        content: `मैं केवल साइबर सुरक्षा, ऑनलाइन धोखाधड़ी और हमारे साइबरसेफ पोर्टल के बारे में ही जानकारी दे सकता हूँ। कृपया केवल साइबर सुरक्षा से संबंधित प्रश्न ही पूछें।`,
        redirects: []
      };
    }
    return {
      content: `I specialize exclusively in cybersecurity and the CyberSafe portal. Please ask about cybersecurity topics, scams, or portal tools.`,
      redirects: []
    };
  }

  if (lower.includes('link') || lower.includes('url') || lower.includes('లింక్') || lower.includes('लिंक')) {
    return {
      content: `You can check any suspicious link for phishing and scams using our AI scanner: [Open Link Safety Checker](#link-safety).`,
      redirects: [{ hash: '#link-safety', view: 'link-safety' as ViewState, label: '🔗 Open Link Safety Checker' }]
    };
  }

  if (lower.includes('message') || lower.includes('sms') || lower.includes('whatsapp') || lower.includes('సందేశం') || lower.includes('संदेश')) {
    return {
      content: `To verify if an SMS or WhatsApp alert is fraudulent, test it here: [Open Message Safety Checker](#message-safety).`,
      redirects: [{ hash: '#message-safety', view: 'message-safety' as ViewState, label: '💬 Open Message Safety Checker' }]
    };
  }

  if (lower.includes('module') || lower.includes('learn') || lower.includes('course') || lower.includes('పాఠం')) {
    return {
      content: `CyberSafe features 4 video modules on Phishing, Passwords, OTP Scams, and UPI Fraud. Start here: [Start Learning Modules](#modules).`,
      redirects: [{ hash: '#modules', view: 'modules' as ViewState, label: '🎓 Start Learning Modules' }]
    };
  }

  return {
    content: `I am **CyberSafe AI**. You can ask me how to check links, verify messages, or explore our [Learning Modules](#modules).`,
    redirects: [
      { hash: '#link-safety', view: 'link-safety' as ViewState, label: '🔗 Link Safety' },
      { hash: '#message-safety', view: 'message-safety' as ViewState, label: '💬 Message Safety' }
    ]
  };
}

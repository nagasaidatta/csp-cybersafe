import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  ArrowUp,
  X,
  RotateCcw,
  ArrowRight,
  Maximize2,
  Minimize2,
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

const computeInitialWindowPos = (buttonPos: { x: number; y: number }): { x: number; y: number } => {
  if (typeof window === 'undefined') {
    return { x: 100, y: 100 };
  }

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth < 640;

  const buttonSize = 48;
  const edgeMargin = isMobile ? 12 : 20;

  const chatWidth = isMobile ? Math.min(360, screenWidth - 24) : 410;
  const chatHeight = isMobile ? Math.min(460, screenHeight * 0.72) : 520;

  const isLeft = buttonPos.x < screenWidth / 2;
  const isTop = buttonPos.y < screenHeight / 2;

  let x: number;
  let y: number;

  // Horizontal placement
  if (isLeft) {
    if (!isMobile && buttonPos.x + buttonSize + 12 + chatWidth <= screenWidth - edgeMargin) {
      x = buttonPos.x + buttonSize + 12;
    } else {
      x = Math.max(edgeMargin, Math.min(buttonPos.x, screenWidth - chatWidth - edgeMargin));
    }
  } else {
    const distFromRight = screenWidth - (buttonPos.x + buttonSize);
    if (distFromRight <= 36 || isMobile) {
      x = screenWidth - chatWidth - edgeMargin;
    } else if (!isMobile && buttonPos.x - 12 - chatWidth >= edgeMargin) {
      x = buttonPos.x - 12 - chatWidth;
    } else {
      x = screenWidth - chatWidth - edgeMargin;
    }
  }

  // Vertical placement
  if (isTop) {
    const idealTop = buttonPos.y + buttonSize + 8;
    if (idealTop + chatHeight <= screenHeight - edgeMargin) {
      y = idealTop;
    } else {
      y = Math.max(edgeMargin, Math.min(buttonPos.y, screenHeight - chatHeight - edgeMargin));
    }
  } else {
    const distFromBottom = screenHeight - (buttonPos.y + buttonSize);
    if (distFromBottom <= 40 || isMobile) {
      y = screenHeight - chatHeight - edgeMargin;
    } else {
      const idealBottom = distFromBottom + buttonSize + 8;
      if (idealBottom + chatHeight <= screenHeight - edgeMargin) {
        y = screenHeight - chatHeight - idealBottom;
      } else {
        y = Math.max(edgeMargin, Math.min(screenHeight - chatHeight - distFromBottom, screenHeight - chatHeight - edgeMargin));
      }
    }
  }

  return {
    x: Math.max(8, Math.min(x, screenWidth - chatWidth - 8)),
    y: Math.max(8, Math.min(y, screenHeight - chatHeight - 8))
  };
};

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

  // Fullscreen & Draggable Window States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [windowPos, setWindowPos] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' ? window.innerWidth < 640 : false);
  const [viewportData, setViewportData] = useState<{ height: number; offsetTop: number; keyboardHeight: number }>(() => {
    if (typeof window !== 'undefined' && window.visualViewport) {
      const vh = window.visualViewport.height;
      const kh = Math.max(0, window.innerHeight - vh);
      return { height: vh, offsetTop: window.visualViewport.offsetTop, keyboardHeight: kh > 80 ? kh : 0 };
    }
    return {
      height: typeof window !== 'undefined' ? window.innerHeight : 800,
      offsetTop: 0,
      keyboardHeight: 0
    };
  });
  const isWindowDraggingRef = useRef(false);
  const windowActivePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const windowRafRef = useRef<number | null>(null);
  const lastOpenTimeRef = useRef<number>(0);
  const dragStartTimeRef = useRef<number>(0);
  const windowDragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0
  });

  // Dragging state references for floating button
  const isDraggingRef = useRef(false);
  const buttonRafRef = useRef<number | null>(null);
  const latestPosRef = useRef<{ x: number; y: number }>({ x: position.x, y: position.y });
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: position.x,
    initialY: position.y
  });

  // Calculate and sync position whenever window is opened
  useEffect(() => {
    if (isOpen) {
      setWindowPos(computeInitialWindowPos(position));
    } else {
      setIsFullscreen(false);
    }
  }, [isOpen]);

  // Keep button and window within screen boundaries on resize
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isMobileNow = screenWidth < 640;
      setIsMobile(isMobileNow);

      setPosition((prev) => {
        const buttonWidth = 48;
        const edgeMargin = 16;
        const targetX = prev.x < screenWidth / 2 ? edgeMargin : screenWidth - buttonWidth - edgeMargin;
        const targetY = Math.min(Math.max(edgeMargin, prev.y), screenHeight - buttonWidth - edgeMargin);
        return { x: targetX, y: targetY };
      });

      setWindowPos((prev) => {
        if (!prev) return null;
        const chatWidth = isMobileNow ? Math.min(360, screenWidth - 24) : 410;
        const chatHeight = isMobileNow ? Math.min(460, screenHeight * 0.72) : 520;
        return {
          x: Math.max(0, Math.min(prev.x, screenWidth - chatWidth)),
          y: Math.max(0, Math.min(prev.y, screenHeight - chatHeight))
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mobile visual viewport resize (keyboard open/close)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateViewport = () => {
      if (window.visualViewport) {
        const vh = window.visualViewport.height;
        const offsetTop = window.visualViewport.offsetTop;
        const kh = Math.max(0, window.innerHeight - vh);
        setViewportData({
          height: vh,
          offsetTop,
          keyboardHeight: kh > 80 ? kh : 0
        });
      } else {
        setViewportData({
          height: window.innerHeight,
          offsetTop: 0,
          keyboardHeight: 0
        });
      }

      if (isOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewport);
      window.visualViewport.addEventListener('scroll', updateViewport);
    }
    window.addEventListener('resize', updateViewport);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewport);
        window.visualViewport.removeEventListener('scroll', updateViewport);
      }
      window.removeEventListener('resize', updateViewport);
    };
  }, [isOpen]);

  // Prevent background page from scrolling on mobile while chat is open
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === 'undefined' || window.innerWidth >= 640) return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const originalOverflow = document.body.style.overflow;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.body.style.overflow = originalOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

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
      if (isWindowDraggingRef.current) return;
      if (Date.now() - lastOpenTimeRef.current < 450) return;
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
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          setIsOpen(false);
        }
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
  }, [isOpen, isFullscreen]);

  // Chat Window Drag Handlers (60-120fps hardware accelerated via requestAnimationFrame)
  const handleWindowDragStart = (e: React.MouseEvent) => {
    if (isFullscreen) return;
    if ((e.target as HTMLElement).closest('button, input, a, textarea')) return;

    e.preventDefault();
    isWindowDraggingRef.current = true;
    document.body.style.userSelect = 'none';

    const currentX = windowPos ? windowPos.x : computeInitialWindowPos(position).x;
    const currentY = windowPos ? windowPos.y : computeInitialWindowPos(position).y;
    windowActivePosRef.current = { x: currentX, y: currentY };

    windowDragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: currentX,
      initialY: currentY
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isWindowDraggingRef.current) return;
      const dx = moveEvent.clientX - windowDragStartRef.current.startX;
      const dy = moveEvent.clientY - windowDragStartRef.current.startY;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isMobile = screenWidth < 640;
      const chatWidth = isMobile ? Math.min(360, screenWidth - 24) : 410;
      const chatHeight = isMobile ? Math.min(460, screenHeight * 0.72) : 520;

      const nextX = Math.max(0, Math.min(windowDragStartRef.current.initialX + dx, screenWidth - chatWidth));
      const nextY = Math.max(0, Math.min(windowDragStartRef.current.initialY + dy, screenHeight - chatHeight));

      windowActivePosRef.current = { x: nextX, y: nextY };

      if (!windowRafRef.current) {
        windowRafRef.current = requestAnimationFrame(() => {
          if (chatWindowRef.current) {
            chatWindowRef.current.style.left = `${windowActivePosRef.current.x}px`;
            chatWindowRef.current.style.top = `${windowActivePosRef.current.y}px`;
          }
          windowRafRef.current = null;
        });
      }
    };

    const handleMouseUp = () => {
      if (windowRafRef.current) {
        cancelAnimationFrame(windowRafRef.current);
        windowRafRef.current = null;
      }
      isWindowDraggingRef.current = false;
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setWindowPos(windowActivePosRef.current);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleWindowTouchStart = (e: React.TouchEvent) => {
    if (isFullscreen || e.touches.length === 0) return;
    if ((e.target as HTMLElement).closest('button, input, a, textarea')) return;

    const isMobileNow = window.innerWidth < 640;
    isWindowDraggingRef.current = true;
    document.body.style.userSelect = 'none';

    const touch = e.touches[0];
    const startTouchY = touch.clientY;
    const currentX = windowPos ? windowPos.x : computeInitialWindowPos(position).x;
    const currentY = windowPos ? windowPos.y : computeInitialWindowPos(position).y;
    windowActivePosRef.current = { x: currentX, y: currentY };

    windowDragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: currentX,
      initialY: currentY
    };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!isWindowDraggingRef.current || moveEvent.touches.length === 0) return;
      const moveTouch = moveEvent.touches[0];
      const dy = moveTouch.clientY - startTouchY;

      if (isMobileNow) {
        // On mobile, dragging the header down pulls the sheet down
        if (dy > 0 && chatWindowRef.current) {
          chatWindowRef.current.style.transform = `translateY(${dy}px)`;
        }
      } else {
        const dx = moveTouch.clientX - windowDragStartRef.current.startX;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const chatWidth = 410;
        const chatHeight = 520;

        const nextX = Math.max(0, Math.min(windowDragStartRef.current.initialX + dx, screenWidth - chatWidth));
        const nextY = Math.max(0, Math.min(windowDragStartRef.current.initialY + dy, screenHeight - chatHeight));

        windowActivePosRef.current = { x: nextX, y: nextY };

        if (!windowRafRef.current) {
          windowRafRef.current = requestAnimationFrame(() => {
            if (chatWindowRef.current) {
              chatWindowRef.current.style.left = `${windowActivePosRef.current.x}px`;
              chatWindowRef.current.style.top = `${windowActivePosRef.current.y}px`;
            }
            windowRafRef.current = null;
          });
        }
      }
    };

    const handleTouchEnd = (endEvent: TouchEvent) => {
      isWindowDraggingRef.current = false;
      document.body.style.userSelect = '';
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      if (isMobileNow) {
        const endTouchY = endEvent.changedTouches[0]?.clientY ?? startTouchY;
        const dy = endTouchY - startTouchY;
        if (dy > 70) {
          // Pulled down by more than 70px -> close chat
          if (chatWindowRef.current) {
            chatWindowRef.current.style.transform = '';
          }
          setIsOpen(false);
        } else {
          // Spring back
          if (chatWindowRef.current) {
            chatWindowRef.current.style.transition = 'transform 0.2s ease-out';
            chatWindowRef.current.style.transform = 'translateY(0)';
            setTimeout(() => {
              if (chatWindowRef.current) {
                chatWindowRef.current.style.transition = '';
              }
            }, 200);
          }
        }
      } else {
        if (windowRafRef.current) {
          cancelAnimationFrame(windowRafRef.current);
          windowRafRef.current = null;
        }
        setWindowPos(windowActivePosRef.current);
      }
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
  };

  // Pointer drag start handler for floating button
  const handlePointerDown = (clientX: number, clientY: number) => {
    isDraggingRef.current = false;
    setIsDragging(false);
    dragStartTimeRef.current = Date.now();
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

      // On touch devices, use a 15px threshold to prevent natural finger rolling from being detected as a drag
      const isTouch = 'touches' in e;
      const threshold = isTouch ? 15 : 6;

      if (!isDraggingRef.current && Math.hypot(dx, dy) > threshold) {
        isDraggingRef.current = true;
        setIsDragging(true);
        if (buttonRef.current) {
          buttonRef.current.style.transition = 'none';
        }
        document.body.style.userSelect = 'none';
      }

      if (isDraggingRef.current) {
        const nextX = Math.min(Math.max(12, dragStartRef.current.initialX + dx), window.innerWidth - 60);
        const nextY = Math.min(Math.max(12, dragStartRef.current.initialY + dy), window.innerHeight - 60);
        latestPosRef.current = { x: nextX, y: nextY };

        if (!buttonRafRef.current) {
          buttonRafRef.current = requestAnimationFrame(() => {
            if (buttonRef.current) {
              buttonRef.current.style.left = `${latestPosRef.current.x}px`;
              buttonRef.current.style.top = `${latestPosRef.current.y}px`;
            }
            buttonRafRef.current = null;
          });
        }
      }
    };

    const handlePointerUp = () => {
      if (buttonRafRef.current) {
        cancelAnimationFrame(buttonRafRef.current);
        buttonRafRef.current = null;
      }
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      const elapsed = Date.now() - dragStartTimeRef.current;
      const dx = latestPosRef.current.x - dragStartRef.current.initialX;
      const dy = latestPosRef.current.y - dragStartRef.current.initialY;
      const isTap = elapsed < 350 && Math.hypot(dx, dy) < 20;

      if (isDraggingRef.current && !isTap) {
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
        if (buttonRef.current) {
          buttonRef.current.style.transition = 'left 0.35s cubic-bezier(0.2, 0.9, 0.3, 1), top 0.35s ease-out';
          buttonRef.current.style.left = `${snapped.x}px`;
          buttonRef.current.style.top = `${snapped.y}px`;
        }
        setPosition(snapped);

        try {
          localStorage.setItem(STORAGE_KEY_POS, JSON.stringify(snapped));
        } catch {
          // ignore
        }
      } else {
        setIsDragging(false);
        lastOpenTimeRef.current = Date.now();
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Open CyberSafe AI Chat"
          title="CyberSafe AI"
          className={`w-12 h-12 rounded-full aspect-square bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-[0_8px_25px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.5)] flex items-center justify-center transition-all cursor-grab active:cursor-grabbing border-2 border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
            isOpen ? 'ring-2 ring-blue-600 ring-offset-2' : ''
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
      {/* Backdrop overlay: touching/clicking anywhere outside closes chat (only when not fullscreen) */}
      {isOpen && !isFullscreen && (
        <div
          className="fixed inset-0 z-[99998] bg-black/25 sm:bg-black/5 backdrop-blur-[0.5px] cursor-pointer touch-none select-none animate-in fade-in duration-150"
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (Date.now() - lastOpenTimeRef.current < 450) return;
            setIsOpen(false);
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (Date.now() - lastOpenTimeRef.current < 450) return;
            setIsOpen(false);
          }}
          aria-hidden="true"
        />
      )}

      {isOpen && (
        <div
          ref={chatWindowRef}
          role="dialog"
          aria-label="CyberSafe AI"
          style={
            isFullscreen
              ? isMobile
                ? {
                    position: 'fixed',
                    top: `${viewportData.offsetTop}px`,
                    left: 0,
                    right: 0,
                    width: '100%',
                    height: `${viewportData.height}px`,
                    zIndex: 99999
                  }
                : { position: 'fixed', inset: 0, zIndex: 99999 }
              : isMobile
              ? {
                  position: 'fixed',
                  bottom: `${viewportData.keyboardHeight > 0 ? viewportData.keyboardHeight + 8 : 12}px`,
                  left: '12px',
                  right: '12px',
                  margin: '0 auto',
                  maxWidth: '360px',
                  height: `${Math.min(460, Math.max(260, viewportData.height - 24))}px`,
                  maxHeight: `${Math.max(260, viewportData.height - 24)}px`,
                  zIndex: 99999,
                  transition: isWindowDraggingRef.current
                    ? 'none'
                    : 'bottom 0.25s cubic-bezier(0.2, 0.9, 0.3, 1), height 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)'
                }
              : {
                  position: 'fixed',
                  left: `${(windowPos ?? computeInitialWindowPos(position)).x}px`,
                  top: `${(windowPos ?? computeInitialWindowPos(position)).y}px`,
                  zIndex: 99999
                }
          }
          className={`flex flex-col bg-white overflow-hidden ${
            isFullscreen
              ? 'fixed inset-0 w-full rounded-none shadow-none z-[99999]'
              : 'fixed z-[99999] w-[92vw] max-w-[360px] sm:max-w-none sm:w-[410px] md:w-[420px] border border-slate-200/90 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.22)]'
          }`}
        >
          {/* Header - Acts as drag handle when not fullscreen */}
          <div
            onMouseDown={handleWindowDragStart}
            onTouchStart={handleWindowTouchStart}
            style={{ touchAction: isFullscreen ? 'auto' : 'none' }}
            className={`relative h-12 sm:h-14 px-3.5 sm:px-5 bg-white border-b border-slate-100 flex items-center justify-between gap-2 sm:gap-3 shrink-0 select-none ${
              isFullscreen ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
            }`}
          >
            {/* Visual drag pull indicator for mobile */}
            {!isFullscreen && (
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-300 rounded-full sm:hidden pointer-events-none" />
            )}

            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0 select-none">
                <Bot className="w-4 h-4 text-white" />
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
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                title="Restart chat"
                aria-label="Restart chat"
                className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 active:scale-95 rounded-full transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen((prev) => !prev);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                title={isFullscreen ? 'Exit full screen' : 'Full screen'}
                aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
                className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 active:scale-95 rounded-full transition-all cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                title="Close chat"
                aria-label="Close chat"
                className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 active:scale-95 rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-5 space-y-3 sm:space-y-4 bg-white">
            <div className={`space-y-3 sm:space-y-4 ${isFullscreen ? 'max-w-3xl mx-auto w-full' : ''}`}>
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
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xs shrink-0 mt-0.5 select-none">
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
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-[#f4f4f5] hover:bg-slate-200/80 active:scale-95 rounded-xl transition-all group cursor-pointer"
                              >
                                <span>{redir.label}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
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
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xs shrink-0 mt-0.5 select-none">
                    <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  </div>
                  <div className="flex items-center gap-1.5 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* ChatGPT Style Minimal Input Bar */}
          <div className="p-2.5 sm:p-3 sm:px-4 bg-white border-t border-slate-100">
            <div className={isFullscreen ? 'max-w-3xl mx-auto w-full' : ''}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 bg-[#f4f4f5] focus-within:bg-[#f0f0f2] focus-within:ring-2 focus-within:ring-blue-600/25 rounded-3xl px-3.5 sm:px-4 py-1.5 transition-all"
              >
                <input
                  ref={chatInputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => {
                    setTimeout(() => {
                      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                  }}
                  placeholder="Message CyberSafe AI..."
                  className="flex-1 bg-transparent py-1 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send"
                  className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-90 disabled:bg-slate-300 text-white disabled:text-slate-400 flex items-center justify-center transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                >
                  <ArrowUp className="w-4 h-4 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </button>
              </form>
            </div>
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

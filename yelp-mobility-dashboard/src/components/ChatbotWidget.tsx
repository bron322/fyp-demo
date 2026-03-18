import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import RestaurantDetailsSheet, {
  type EvidenceItem,
  type RecommendedRestaurant,
} from '@/components/RestaurantDetailsSheet';
// import TravelModeToggle from '@/components/TravelModeToggle';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recommended?: RecommendedRestaurant;
  evidence?: EvidenceItem[];
  isGrounded?: boolean;
  travelMode?: 'local' | 'explorer';
  locationMode?: 'city' | 'state' | 'global';
  inferredLocation?: { city?: string; state?: string } | null;
}

const ChatbotWidget: React.FC = () => {
  const [activeUserId, setActiveUserId] = useState<string | null>(
    localStorage.getItem("rag_user_id")
  );
  const [awaitingUserId, setAwaitingUserId] = useState<boolean>(
    !localStorage.getItem("rag_user_id")
  );
  // const [travelMode, setTravelMode] = useState<'local' | 'explorer'>('local');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: localStorage.getItem("rag_user_id")
        ? "Hi! 👋 Tell me what you're in the mood for, and I'll recommend a restaurant."
        : "Hi! 👋 Before I recommend, please paste your user_id (demo mode).",
      timestamp: new Date(),
    },
  ]);  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RecommendedRestaurant | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  // const travelModeRef = useRef<'local' | 'explorer'>(travelMode);

  // useEffect(() => {
  //   travelModeRef.current = travelMode;
  // }, [travelMode]);

  const handleRestaurantClick = (msg: Message) => {
    if (!msg.recommended) return;
    setSelectedRestaurant(msg.recommended);
    setSelectedEvidence(msg.evidence || []);
    setSheetOpen(true);
  };

  const renderAssistantMessage = (message: Message) => {
    // If backend returned a structured recommendation, render clickable title
    if (message.recommended) {
      return (
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => handleRestaurantClick(message)}
            className="flex items-center gap-1.5 group text-left cursor-pointer pointer-events-auto"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span
              className="font-bold underline decoration-primary/40 underline-offset-2 group-hover:decoration-primary transition-colors"
              style={{ color: 'hsl(270 70% 55%)' }}
            >
              {message.recommended.name}
            </span>
          </button>
  
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      );
    }
  
    // Normal assistant message (welcome/error): support **bold** formatting
    return (
      <>
        {String(message.content).split('**').map((part, i) =>
          i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
        )}
      </>
    );
  };  
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const text = inputValue.trim();
    // const modeAtSend = travelModeRef.current;
    // console.log("travel ref:", modeAtSend);

    // 1. Add User Message to UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // 2. Call your Python Backend
      // const response = await fetch('http://localhost:8000/chat', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ 
      //       message: userMessage.content,
      //       user_id: "---zemaUC8WeJeWKqS6p9Q" // <--- Replace with dynamic ID or one from your CSV
      //   }),
      // });
      // ✅ Step 0: if we still need user_id, treat message as user_id
      if (awaitingUserId || !activeUserId) {
        const res = await fetch("http://localhost:8000/validate_user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: text }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: `I can't find that user_id. Try again.\n\nTip: copy the exact ID from your dataset.`,
              timestamp: new Date(),
            },
          ]);
          return;
        }

        const data = await res.json();
        const uid = String(data.user_id);

        setActiveUserId(uid);
        localStorage.setItem("rag_user_id", uid);
        setAwaitingUserId(false);

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `✅ Loaded profile: ${uid}\nNow tell me what kind of food you want (e.g., "dinner", "steakhouse", "italian").`,
            timestamp: new Date(),
          },
        ]);
        return;
      }

      // ✅ Step 1: normal chat
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          user_id: activeUserId,
        }),
      });
      const data = await response.json();

      // 3. Add AI Response to UI
      const recommended: RecommendedRestaurant | undefined =
      typeof data.reply === "string"
        ? undefined
        : {
            business_id: String(data.reply.business_id),
            name: String(data.reply.name),
            reason: String(data.reply.reason ?? ""),
          };

      // optional: ensure evidence fields are consistent types
      const evidence: EvidenceItem[] = Array.isArray(data.evidence)
      ? data.evidence.map((e: any) => ({
          business_id: String(e.business_id),
          name_meta: String(e.name_meta ?? e.name ?? ""),
          categories: String(e.categories ?? ""),
          city: String(e.city ?? ""),
          state: String(e.state ?? ""),
          rating: Number(e.rating ?? 0),                 // ✅ number
          review_count: Number(e.review_count ?? 0),     // ✅ number
          score: Number(e.score ?? 0),                   // ✅ number
        }))
      : [];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        // content becomes the explanation text shown under the clickable title
        content: recommended ? recommended.reason : String(data.reply),
        recommended,
        evidence,
        isGrounded: Boolean(data.is_grounded),
        timestamp: new Date(),
        locationMode: data.location_mode,             // "city" | "state" | "global"
        inferredLocation: data.inferred_location ?? null, // { city, state } or null
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error chatting with backend:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting to the restaurant database right now.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100'
        }`}
        style={{
          background: 'linear-gradient(135deg, hsl(270 70% 55%), hsl(290 65% 60%))',
          boxShadow: '0 4px 20px hsl(270 70% 55% / 0.4)',
        }}
        aria-label="Open Restaurant Recommender"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[380px] h-[520px] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
        style={{
          boxShadow: '0 16px 48px hsl(270 30% 30% / 0.25), 0 8px 24px hsl(270 30% 30% / 0.15)',
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, hsl(270 70% 55%), hsl(290 65% 60%))',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Restaurant Recommender</h3>
              <p className="text-white/80 text-xs">Powered by AI</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem("rag_user_id");
              setActiveUserId(null);
              setAwaitingUserId(true);
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  role: "assistant",
                  content: "Paste your user_id to continue (demo mode).",
                  timestamp: new Date(),
                },
              ]);
            }}
            className="text-white/90 hover:bg-white/20 rounded-full"
          >
            Change user
          </Button>
        </div>

        {/* Travel Mode Toggle
        <div className="px-4 py-3 bg-card border-b border-border flex justify-between items-end">
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Travel Preference</p>
            <TravelModeToggle value={travelMode} onChange={setTravelMode} />
          </div>
        </div> */}

        {/* Messages */}
        <ScrollArea className="flex-1 bg-card" ref={scrollRef}>
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.role === 'user'
                      ? 'bg-secondary'
                      : ''
                  }`}
                  style={message.role === 'assistant' ? {
                    background: 'linear-gradient(135deg, hsl(270 70% 55%), hsl(290 65% 60%))',
                  } : {}}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary text-foreground rounded-bl-md'
                  }`}
                >
                  {message.role === "assistant"
                  ? renderAssistantMessage(message)
                  : message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, hsl(270 70% 55%), hsl(290 65% 60%))',
                  }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-3 bg-card border-t border-border">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask for a recommendation..."
              className="flex-1 rounded-full bg-secondary border-0 focus-visible:ring-primary"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="rounded-full shrink-0"
              style={{
                background: inputValue.trim() && !isTyping
                  ? 'linear-gradient(135deg, hsl(270 70% 55%), hsl(290 65% 60%))'
                  : undefined,
              }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <RestaurantDetailsSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        restaurant={selectedRestaurant}
        evidence={selectedEvidence}
      />

    </>
  );
};

export default ChatbotWidget;

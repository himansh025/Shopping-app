import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  X,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../services/apiClient';
import quickResponses from '../data/quickResponses';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const INITIAL_MESSAGE = {
  id: 'welcome',
  type: 'bot',
  content:
    "Hello! 👋 I'm your **MyShop AI Assistant**.\n\nI can help you discover products, track active orders, explain return policies, check sizes, or find trending items across MyShop. How can I help you today?",
};

export function Chatbot() {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const role = user?.role || 'guest';
  const quickQuestions = quickResponses[role] || quickResponses.guest;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        };
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition setup error:', err);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!isSpeechSupported) {
      alert('Voice input is not supported in this browser. Try Chrome or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error('Error starting voice input:', err);
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMsg = { id: Date.now(), type: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axiosInstance.post('/chatbot/chat', { message: query });
      const botReply =
        data?.response ||
        "I'm here to help! You can check our latest arrivals or browse categories.";
      const botMsg = { id: Date.now() + 1, type: 'bot', content: botReply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Chatbot API request fallback:', err.message);

      // Intelligent Client Fallback
      let fallback =
        "I'm here to assist you with products, orders, returns, and payment details! How can I help?";
      const q = query.toLowerCase();
      if (q.includes('work') || q.includes('how')) {
        fallback =
          "### How It Works 🛍️\n\n1. **Browse**: Explore Men's, Women's, and Electronics collections.\n2. **Select**: Choose your size and add items to your Bag.\n3. **Checkout**: Pay via UPI, Razorpay card, or Cash on Delivery.\n4. **Delivery**: Fast express shipping with 7-day doorstep return guarantee!";
      } else if (q.includes('order') || q.includes('track')) {
        fallback =
          'You can track all your active deliveries and past orders on your [Orders Page](/orders).';
      } else if (q.includes('pay') || q.includes('cod')) {
        fallback =
          'We support **UPI (Google Pay, PhonePe, Paytm)**, **Razorpay (Cards & Net Banking)**, and **Cash on Delivery (COD)** on eligible pincodes!';
      } else if (q.includes('return') || q.includes('refund')) {
        fallback =
          'We offer a **7-Day Hassle-Free Return & Exchange** guarantee with doorstep pickup on eligible items!';
      }

      const botMsg = { id: Date.now() + 1, type: 'bot', content: fallback };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {/* Floating Launcher Pill / Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open MyShop AI Assistant"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-2xl hover:shadow-blue-600/30 border border-slate-700/80 hover:scale-105 transition-all duration-300 group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block pr-1">
            <p className="text-xs font-bold leading-tight">MyShop AI</p>
            <p className="text-[10px] text-slate-300">Ask anything</p>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[410px] h-[560px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">MyShop Assistant</h3>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-300 border border-blue-400/30">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Online • Styling, Sizing & Orders
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Reset conversation"
                className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70 text-slate-800 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.type === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl leading-relaxed shadow-xs ${
                    msg.type === 'user'
                      ? 'bg-slate-900 text-white rounded-br-xs font-medium'
                      : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80'
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                      h1: ({ children }) => (
                        <h4 className="text-sm font-bold text-slate-900 mt-2 mb-1 border-b pb-1">{children}</h4>
                      ),
                      h2: ({ children }) => (
                        <h4 className="text-sm font-bold text-slate-900 mt-2 mb-1">{children}</h4>
                      ),
                      h3: ({ children }) => (
                        <h5 className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-2 mb-1">{children}</h5>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-4 mb-2 space-y-1 text-slate-700">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-4 mb-2 space-y-1 text-slate-700">{children}</ol>
                      ),
                      li: ({ children }) => <li className="leading-snug">{children}</li>,
                      strong: ({ children }) => (
                        <strong className="font-semibold text-slate-900">{children}</strong>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-blue-500 pl-2.5 py-0.5 my-2 text-slate-600 italic bg-blue-50/50 rounded-r">
                          {children}
                        </blockquote>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-2 rounded-xl border border-slate-200 shadow-xs">
                          <table className="min-w-full divide-y divide-slate-200 text-xs text-left bg-white">{children}</table>
                        </div>
                      ),
                      thead: ({ children }) => <thead className="bg-slate-100 font-bold text-slate-900">{children}</thead>,
                      tbody: ({ children }) => <tbody className="divide-y divide-slate-100">{children}</tbody>,
                      tr: ({ children }) => <tr className="hover:bg-slate-50 transition-colors">{children}</tr>,
                      th: ({ children }) => <th className="px-3 py-2 font-semibold text-slate-800">{children}</th>,
                      td: ({ children }) => <td className="px-3 py-2 text-slate-700 align-top">{children}</td>,
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="text-blue-600 font-semibold underline hover:text-blue-800 transition-colors"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {/* Typing Loader Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white px-3.5 py-2.5 rounded-2xl rounded-bl-xs border border-slate-200 flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 transition-all shrink-0 active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input & Voice Controls */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200/70"
          >
            <div className="flex items-center gap-2 bg-slate-100/90 rounded-full px-3 py-1.5 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-xs">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening... Speak now' : 'Ask about sizes, orders, styles...'}
                className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />

              {/* Voice recognition button */}
              {isSpeechSupported && (
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  title={isListening ? 'Stop recording' : 'Voice search'}
                  className={`p-1.5 rounded-full transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim() || loading}
                title="Send message"
                className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-xs active:scale-90 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-1.5">
              AI assistant for shopping guidance & support
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;

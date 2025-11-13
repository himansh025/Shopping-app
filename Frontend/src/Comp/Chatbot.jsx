import { useState, useRef, useEffect } from 'react';
import { Send, Bot, MessageCircle, X, Mic, MicOff } from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosInstance from '../Config/apiConfig';
import quickResponses from '../data';

export default function Chatbot() {
    const { user } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', content: 'Hi! Ask me about your tickets or events 🎟️' }
    ]);

    const [quickQuestions, setQuickQuestions] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeechSupported, setIsSpeechSupported] = useState(false);
    const messagesEnd = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        setQuickQuestions(quickResponses[user?.role]);
    }, [user?.role]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            setIsSpeechSupported(true);
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsListening(true);
            };

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev + (prev ? ' ' : '') + transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                
                if (event.error === 'not-allowed') {
                    alert('Microphone access denied. Please allow microphone permissions.');
                } else if (event.error === 'audio-capture') {
                    alert('No microphone found. Please check your microphone connection.');
                }
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            setIsSpeechSupported(false);
            console.warn('Speech recognition not supported in this browser');
        }

        // Cleanup function
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleVoiceInput = () => {
        if (!isSpeechSupported) {
            alert('Voice input is not supported in your browser. Try Chrome, Edge, or Safari.');
            return;
        }

        if (isListening) {
            stopVoiceInput();
        } else {
            startVoiceInput();
        }
    };

    const startVoiceInput = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
            } catch (error) {
                console.error('Error starting voice input:', error);
                setIsListening(false);
            }
        }
    };

    const stopVoiceInput = () => {
        if (recognitionRef.current && isListening) {
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error('Error stopping voice input:', error);
            } finally {
                setIsListening(false);
            }
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        
        // Stop voice input if active
        if (isListening) {
            stopVoiceInput();
        }

        const userMsg = { id: Date.now(), type: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        
        try {
            const { data } = await axiosInstance.post('/chatbot/chat', { message: input });
            const botMsg = {
                id: Date.now() + 1,
                type: 'bot',
                content: data.response || 'Sorry, something went wrong!'
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg = {
                id: Date.now() + 1,
                type: 'bot',
                content: 'Unable to connect. Please try again.'
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        user && (
            <div className="fixed bottom-4 right-4 z-50">
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full p-3 shadow-2xl transition-all duration-300 hover:scale-110"
                    >
                        <MessageCircle size={24} />
                    </button>
                )}

                {/* Chat Window */}
                {isOpen && (
                    <div className="backdrop-blur-xl bg-white/95 rounded-2xl shadow-2xl w-[320px] h-[450px] md:w-[360px] md:h-[500px] flex flex-col border border-white/20">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-2.5 rounded-t-2xl flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-1 rounded-full backdrop-blur-sm">
                                    <Bot size={16} />
                                </div>
                                <div>
                                    <span className="font-semibold text-sm">Myshop Bot</span>
                                    <div className="flex items-center gap-1 text-[10px] text-white/80">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                        Online
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-gradient-to-b from-gray-50/50 to-white/50">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-2.5 rounded-xl text-sm shadow-sm ${
                                        msg.type === 'user'
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-sm'
                                            : 'bg-white/80 backdrop-blur-sm text-gray-800 rounded-bl-sm border border-gray-100'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-xl rounded-bl-sm border border-gray-100 shadow-sm">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEnd} />
                        </div>

                        {/* Quick Questions */}
                        {messages.length === 1 && (
                            <div className="p-2.5 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
                                <div className="text-[11px] font-medium text-gray-600 mb-1.5">Quick questions:</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {quickQuestions?.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setInput(q)}
                                            className="text-[11px] bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-2.5 py-1 rounded-full hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200/50 font-medium"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-3 border-t border-gray-200/50 bg-white/70 backdrop-blur-sm rounded-b-2xl">
                            <div className="flex gap-1.5 items-center">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Ask about tickets..."
                                        className="w-full border border-gray-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                                        disabled={loading}
                                    />
                                </div>
                                {isSpeechSupported && (
                                    <button
                                        onClick={toggleVoiceInput}
                                        className={`${
                                            isListening 
                                                ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                                                : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300'
                                        } text-gray-700 rounded-full p-2 transition-all duration-300 shadow-sm`}
                                        disabled={loading}
                                        type="button"
                                    >
                                        {isListening ? <MicOff size={16} className="text-white" /> : <Mic size={16} />}
                                    </button>
                                )}
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || loading}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full p-2 transition-all duration-300 shadow-sm disabled:cursor-not-allowed"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    );
}
import React, { useState, useRef, useEffect } from 'react';
import MosaicHeader from '../components/MosaicHeader';
import { Send, User as UserIcon, Bot, Sparkles } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: 'Salam! I am Aziz, your local guide. How can I help you plan your Moroccan adventure today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    try {
      const responseText = await sendMessageToGemini(userMsg.text, history);
      const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "3-day itinerary for Marrakech",
    "Is it safe for solo female travelers?",
    "Vegetarian food in Fes?",
    "Translate 'Where is the bathroom?'"
  ];

  return (
    <div className="flex flex-col h-screen bg-[#FDFBF7] pb-20">
      <MosaicHeader title="Ask Aziz" subtitle="Your Intelligent Guide" className="bg-white shadow-sm z-10" />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-stone-100 ${msg.role === 'user' ? 'bg-[#C19A6B]' : 'bg-[#0B1E3B]'}`}>
                {msg.role === 'user' ? <UserIcon size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#C19A6B] text-white rounded-tr-none' 
                  : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-2 items-center bg-white p-3 rounded-2xl rounded-tl-none border border-stone-100 shadow-sm ml-10">
                <Sparkles size={16} className="text-[#D4AF37] animate-pulse" />
                <span className="text-xs text-stone-500">Aziz is thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips (only show if few messages) */}
      {messages.length < 3 && (
        <div className="px-4 pb-2">
           <div className="flex gap-2 overflow-x-auto no-scrollbar">
             {suggestions.map((s, i) => (
               <button 
                 key={i} 
                 onClick={() => { setInput(s); }}
                 className="whitespace-nowrap px-3 py-1 bg-white border border-stone-200 text-stone-600 rounded-full text-xs hover:border-[#D4AF37] transition-colors"
               >
                 {s}
               </button>
             ))}
           </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-stone-100">
        <div className="flex items-center gap-2 bg-stone-50 rounded-full px-4 py-2 border border-stone-200 focus-within:border-[#D4AF37] transition-colors">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about travel, culture, or food..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-stone-800 placeholder-stone-400"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-full transition-colors ${input.trim() ? 'text-[#0B1E3B] hover:bg-stone-200' : 'text-stone-300'}`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
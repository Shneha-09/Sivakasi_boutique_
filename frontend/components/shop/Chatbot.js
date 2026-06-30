import { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';

const UPLOADS = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    content: "Hi! I'm **Priya** 🌸, your personal shopping assistant at Sivakasi Boutique! I can help you find the perfect kurti, nighty, or innerwear. What are you looking for today?",
    time: new Date()
  }
];

const QUICK_STARTERS = [
  "Show me kurtis 👗",
  "Nighties collection 🌙",
  "Size guide 📏",
  "Delivery info 🚚",
  "Return policy ↩️",
  "Best sellers ⭐"
];

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [unread, setUnread] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 300); }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setSuggestions([]);

    const userMsg = { role: 'user', content: msg, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setIsTyping(true);

    try {
      const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
      const { data } = await api.post('/chatbot/message', { message: msg, history });
      setIsTyping(false);

      if (data.success) {
        const assistantMsg = { role: 'assistant', content: data.reply, time: new Date() };
        setMessages(prev => [...prev, assistantMsg]);
        if (data.suggestions?.length) setSuggestions(data.suggestions);
        if (!isOpen) setUnread(prev => prev + 1);
      }
    } catch (err) {
      setIsTyping(false);
      const errMsg = { role: 'assistant', content: "I'm sorry, I'm having a little trouble right now. Please try again! 🙏", time: new Date() };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const clearChat = () => { setMessages(INITIAL_MESSAGES); setSuggestions([]); };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <style jsx global>{`
        .chatbot-fab {
          position: fixed; bottom: 28px; right: 28px; z-index: 1000;
          width: 64px; height: 64px; border-radius: 50%;
          background: linear-gradient(135deg, #E91E63 0%, #D4AF37 100%);
          border: none; cursor: pointer; box-shadow: 0 8px 30px rgba(233,30,99,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; transition: all 0.3s ease;
          animation: bounce 2s ease-in-out infinite;
        }
        .chatbot-fab:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(233,30,99,0.5); animation: none; }
        .chatbot-fab .unread-badge {
          position: absolute; top: -4px; right: -4px;
          background: #ff4757; color: white; border-radius: 50%;
          width: 22px; height: 22px; font-size: 11px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid white; font-family: 'Poppins', sans-serif;
        }

        .chatbot-window {
          position: fixed; bottom: 108px; right: 28px; z-index: 1000;
          width: 380px; max-height: 600px;
          background: rgba(255,249,245,0.97); backdrop-filter: blur(20px);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 24px; box-shadow: 0 20px 60px rgba(233,30,99,0.2);
          display: flex; flex-direction: column; overflow: hidden;
          animation: slideInRight 0.3s ease;
          transition: all 0.3s ease;
        }
        .chatbot-window.minimized { max-height: 70px; }

        .chat-header {
          background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%);
          padding: 16px 20px; display: flex; align-items: center; gap: 12px;
          flex-shrink: 0;
        }
        .chat-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
          border: 2px solid rgba(212,175,55,0.5);
        }
        .chat-header-info { flex: 1; }
        .chat-header-name { font-family: 'Playfair Display', serif; font-size: 1rem; color: white; font-weight: 700; }
        .chat-header-status { font-size: 11px; color: rgba(255,255,255,0.8); font-family: 'Poppins', sans-serif; display: flex; align-items: center; gap: 4px; }
        .online-dot { width: 7px; height: 7px; background: #4ade80; border-radius: 50%; animation: pulse-dot 2s infinite; }
        @keyframes pulse-dot { 0%,100%{opacity:1;}50%{opacity:0.4;} }
        .chat-header-actions { display: flex; gap: 8px; }
        .header-btn { background: rgba(255,255,255,0.15); border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .header-btn:hover { background: rgba(255,255,255,0.25); }

        .chat-messages {
          flex: 1; overflow-y: auto; padding: 16px;
          display: flex; flex-direction: column; gap: 12px;
          scroll-behavior: smooth;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(233,30,99,0.2); border-radius: 2px; }

        .message-row { display: flex; gap: 8px; max-width: 100%; }
        .message-row.user { flex-direction: row-reverse; }
        .msg-avatar { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .msg-avatar.bot { background: linear-gradient(135deg, #E91E63, #D4AF37); }
        .msg-avatar.user-av { background: linear-gradient(135deg, #3A2A2A, #5C2A2A); color: white; font-size: 11px; font-weight: 700; font-family: 'Poppins', sans-serif; }

        .message-bubble {
          max-width: 78%; padding: 10px 14px; border-radius: 18px;
          font-family: 'Poppins', sans-serif; font-size: 13px; line-height: 1.5;
        }
        .message-bubble.bot {
          background: white; color: #3A2A2A;
          border: 1px solid rgba(212,175,55,0.2);
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .message-bubble.user {
          background: linear-gradient(135deg, #E91E63, #C2185B);
          color: white; border-bottom-right-radius: 4px;
        }
        .msg-time { font-size: 10px; opacity: 0.5; margin-top: 4px; font-family: 'Poppins', sans-serif; text-align: right; }
        .msg-time.bot-time { text-align: left; }

        .typing-indicator {
          display: flex; gap: 8px; align-items: flex-end;
        }
        .typing-bubble {
          background: white; border: 1px solid rgba(212,175,55,0.2);
          border-radius: 18px; border-bottom-left-radius: 4px;
          padding: 12px 16px; display: flex; gap: 5px; align-items: center;
        }
        .typing-dot { width: 7px; height: 7px; border-radius: 50%; background: #E91E63; animation: typing 1.4s infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing { 0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-6px);} }

        .quick-starters {
          padding: 8px 16px; display: flex; gap: 8px; flex-wrap: wrap;
          border-top: 1px solid rgba(212,175,55,0.15);
          background: rgba(255,249,245,0.8);
          flex-shrink: 0;
        }
        .starter-btn {
          padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(233,30,99,0.2);
          background: rgba(233,30,99,0.05); color: #E91E63;
          font-size: 11px; font-family: 'Poppins', sans-serif; font-weight: 600;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .starter-btn:hover { background: #E91E63; color: white; }

        .suggestions-row {
          padding: 8px 16px; display: flex; gap: 8px; overflow-x: auto;
          border-top: 1px solid rgba(212,175,55,0.15);
          flex-shrink: 0; scrollbar-width: none;
        }
        .suggestions-row::-webkit-scrollbar { display: none; }
        .suggestion-chip {
          padding: 6px 12px; border-radius: 20px; border: 1px solid rgba(212,175,55,0.3);
          background: white; color: #3A2A2A;
          font-size: 11px; font-family: 'Poppins', sans-serif;
          cursor: pointer; transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
        }
        .suggestion-chip:hover { background: rgba(233,30,99,0.08); border-color: rgba(233,30,99,0.3); color: #E91E63; }

        .chat-input-area {
          padding: 12px 16px; border-top: 1px solid rgba(212,175,55,0.2);
          display: flex; gap: 8px; align-items: flex-end;
          background: white; flex-shrink: 0;
        }
        .chat-input {
          flex: 1; padding: 10px 14px; border: 1px solid rgba(212,175,55,0.3);
          border-radius: 20px; font-family: 'Poppins', sans-serif; font-size: 13px;
          color: #3A2A2A; outline: none; resize: none; background: rgba(255,249,245,0.8);
          transition: all 0.2s; max-height: 80px; line-height: 1.4;
        }
        .chat-input:focus { border-color: #E91E63; box-shadow: 0 0 0 3px rgba(233,30,99,0.1); }
        .send-btn {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, #E91E63, #D4AF37);
          border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 17px; transition: all 0.2s; flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(233,30,99,0.3);
        }
        .send-btn:hover:not(:disabled) { transform: scale(1.1); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .chat-branding { text-align: center; padding: 6px; font-size: 10px; color: #bbb; font-family: 'Poppins', sans-serif; background: white; flex-shrink: 0; }
        .chat-branding span { color: #E91E63; font-weight: 600; }

        @media (max-width: 480px) {
          .chatbot-window { width: calc(100vw - 32px); right: 16px; bottom: 96px; }
          .chatbot-fab { bottom: 20px; right: 16px; }
        }
        @keyframes slideInRight { from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);} }
        @keyframes bounce { 0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);} }
      `}</style>

      {/* FAB Button */}
      {!isOpen && (
        <button className="chatbot-fab" onClick={() => setIsOpen(true)} title="Chat with Priya">
          💬
          {unread > 0 && <span className="unread-badge">{unread}</span>}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`chatbot-window ${isMinimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div className="chat-header">
            <div className="chat-avatar">🌸</div>
            <div className="chat-header-info">
              <div className="chat-header-name">Priya — Shopping Assistant</div>
              {!isMinimized && (
                <div className="chat-header-status">
                  <span className="online-dot" />
                  Online · Sivakasi Boutique
                </div>
              )}
            </div>
            <div className="chat-header-actions">
              <button className="header-btn" onClick={clearChat} title="Clear chat">🗑️</button>
              <button className="header-btn" onClick={() => setIsMinimized(!isMinimized)} title={isMinimized ? 'Expand' : 'Minimize'}>
                {isMinimized ? '⬆️' : '⬇️'}
              </button>
              <button className="header-btn" onClick={() => setIsOpen(false)} title="Close">✕</button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`message-row ${msg.role === 'user' ? 'user' : ''}`}>
                    <div className={`msg-avatar ${msg.role === 'user' ? 'user-av' : 'bot'}`}>
                      {msg.role === 'user' ? '👤' : '🌸'}
                    </div>
                    <div>
                      <div className={`message-bubble ${msg.role === 'user' ? 'user' : 'bot'}`}
                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                      <div className={`msg-time ${msg.role !== 'user' ? 'bot-time' : ''}`}>{formatTime(msg.time)}</div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="typing-indicator">
                    <div className="msg-avatar bot">🌸</div>
                    <div className="typing-bubble">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Starters (shown only at start) */}
              {messages.length <= 1 && (
                <div className="quick-starters">
                  {QUICK_STARTERS.map((s, i) => (
                    <button key={i} className="starter-btn" onClick={() => sendMessage(s)}>{s}</button>
                  ))}
                </div>
              )}

              {/* AI Suggestions */}
              {suggestions.length > 0 && messages.length > 1 && (
                <div className="suggestions-row">
                  {suggestions.map((s, i) => (
                    <button key={i} className="suggestion-chip" onClick={() => { sendMessage(s); setSuggestions([]); }}>{s}</button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="chat-input-area">
                <textarea
                  ref={inputRef}
                  className="chat-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Priya anything..."
                  rows={1}
                  disabled={loading}
                />
                <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                  {loading ? '⏳' : '➤'}
                </button>
              </div>

              <div className="chat-branding">Powered by <span>Claude AI</span> · Sivakasi Boutique</div>
            </>
          )}
        </div>
      )}
    </>
  );
}

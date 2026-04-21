import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { MessageSquare, Send, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LiveChat({ requestId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!requestId) return;

    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join_request', requestId);

    socketRef.current.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [requestId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;

    const msgData = {
      requestId,
      senderId: user._id,
      senderName: user.username,
      text: input,
      timestamp: new Date().toISOString(),
    };

    socketRef.current.emit('send_message', msgData);
    setInput('');
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="chat-launcher">
        <MessageSquare size={22} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="chat-panel glass-card"
        >
          <div className="chat-header">
            <div>
              <h3>Live Chat</h3>
              <p>Stay aligned with the customer in real time.</p>
            </div>
            <button type="button" className="chat-close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="empty-chat-state">
                <MessageSquare size={18} />
                <span>No messages yet. Start the conversation.</span>
              </div>
            )}

            {messages.map((message, index) => {
              const isMine = message.senderId === user._id;
              return (
                <div key={index} className={isMine ? 'chat-message mine' : 'chat-message'}>
                  <span className="chat-sender">{message.senderName}</span>
                  <div className="chat-bubble">{message.text}</div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="chat-composer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit" className="btn-primary chat-send">
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      )}
    </>
  );
}

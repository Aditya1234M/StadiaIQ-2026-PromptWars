/**
 * @description Multilingual Generative AI assistant providing real-time answers for stadium amenities, food, and policies.
 */
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { generateCopilotResponse } from '../utils/aiEngine';
import { Send, Sparkles, Bot, User, ArrowRight, Globe } from 'lucide-react';

interface StadiaCopilotProps {
  setActiveTab: (tab: string) => void;
}

export const StadiaCopilot: React.FC<StadiaCopilotProps> = ({ setActiveTab }) => {
  const { currentStadium, state, t, addChatMessage } = useApp();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatHistory, isThinking]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    if (!textToSend) setInput('');

    // Add user message
    addChatMessage({
      sender: 'user',
      text: query,
      language: state.language,
    });

    setIsThinking(true);

    // Simulate GenAI thinking latency (300ms for zero lag feel)
    setTimeout(() => {
      const response = generateCopilotResponse(query, currentStadium, state.language);
      addChatMessage({
        sender: 'ai',
        text: response.text,
        language: state.language,
        suggestedAction: response.suggestedAction,
      });
      setIsThinking(false);
    }, 400);
  };

  const quickPrompts = [
    { label: 'Halal & Vegan Food', query: 'Where is halal and vegan food?' },
    { label: 'Fastest Restroom', query: 'Where is the fastest accessible restroom?' },
    { label: 'Metro Departure Times', query: 'When is the next metro leaving after match?' },
    { label: 'Bag & Security Policy', query: 'What is the stadium bag policy?' },
  ];

  return (
    <div className="page animate-fade-in" role="region" aria-label="StadiaCopilot Multilingual GenAI Assistant">
      <div className="page-header">
        <div>
          <div className="flex items-center gap-xs">
            <h1 className="page-title">{t('copilot')}</h1>
            <span className="badge" style={{ background: 'var(--accent)', color: '#000', fontWeight: 800 }}>GenAI 2.0</span>
          </div>
          <p className="page-subtitle">Multilingual NLP copilot answering queries in English, Spanish, French, Arabic, and German.</p>
        </div>
        <div className="flex items-center gap-xs text-secondary" style={{ fontSize: '0.8rem' }}>
          <Globe size={16} color="var(--accent)" />
          <span>Active Language: <strong style={{ color: '#fff', textTransform: 'uppercase' }}>{state.language}</strong></span>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-sm" style={{ flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Suggested Queries:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.query)}
            className="btn"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '6px 12px', fontSize: '0.75rem', color: '#fff', borderRadius: '99px' }}
          >
            <Sparkles size={12} color="var(--accent)" />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Box Container */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '520px', padding: '0', overflow: 'hidden' }}>
        {/* Messages Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }} aria-live="polite">
          {state.chatHistory.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}
            >
              {msg.sender === 'ai' && (
                <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={20} color="#080d14" />
                </div>
              )}
              <div
                style={{
                  background: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-tertiary)',
                  color: msg.sender === 'user' ? '#080d14' : '#fff',
                  padding: '14px 18px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  border: msg.sender === 'ai' ? '1px solid var(--border)' : 'none',
                  fontWeight: msg.sender === 'user' ? 600 : 400,
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                }}
              >
                <div>{msg.text}</div>
                {msg.suggestedAction && (
                  <button
                    onClick={() => msg.suggestedAction?.routeTab && setActiveTab(msg.suggestedAction.routeTab)}
                    className="btn btn-secondary"
                    style={{ marginTop: '12px', padding: '6px 12px', fontSize: '0.75rem', background: '#080d14', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                  >
                    <span>{msg.suggestedAction.label}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
                <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '6px', textAlign: 'right' }}>{msg.timestamp}</div>
              </div>
              {msg.sender === 'user' && (
                <div style={{ background: 'var(--bg-tertiary)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border)' }}>
                  <User size={18} color="#fff" />
                </div>
              )}
            </div>
          ))}
          {isThinking && (
            <div className="flex items-center gap-sm" style={{ color: 'var(--primary)', fontSize: '0.85rem', padding: '8px' }}>
              <Sparkles size={16} className="animate-pulse" />
              <span>StadiaCopilot AI is synthesizing telemetry...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('askCopilot')}
            style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '10px', color: '#fff' }}
            aria-label="Ask StadiaCopilot AI"
          />
          <button onClick={() => handleSend()} className="btn btn-primary" style={{ padding: '12px 24px' }}>
            <span>{t('send')}</span>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

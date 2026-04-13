import React, { useState } from 'react';
import { Send, Bot, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AiAssistant = () => {
    const { userProfile } = useAuth();
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            role: 'assistant', 
            content: `Olá! Sou seu assistente de estudos. Vi que você quer cursar ${userProfile?.curso || 'seu curso dos sonhos'}. Como posso ajudar você hoje com os estudos para o ENEM/SSA?` 
        }
    ]);

    const handleSend = async (e) => {
        e.preventDefault();
        if(!prompt.trim()) return;

        const newMsg = { id: Date.now(), role: 'user', content: prompt };
        setMessages(prev => [...prev, newMsg]);
        setPrompt('');
        setLoading(true);

        try {
            // TODO: Integrar com a API de IA real (OpenAI, Gemini, etc.)
            // const response = await fetch('/api/ia', { 
            //    method: 'POST', body: JSON.stringify({ message: prompt, curso: userProfile?.curso }) 
            // });
            
            // Simulação de chamada de API:
            setTimeout(() => {
                const botReply = { 
                    id: Date.now() + 1, 
                    role: 'assistant', 
                    content: 'A integração com a IA está quase pronta! Logo poderei responder suas dúvidas com explicações passo a passo.' 
                };
                setMessages(prev => [...prev, botReply]);
                setLoading(false);
            }, 1000);

        } catch(err) {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            <h1 className="page-title">I.A. Mentoria</h1>
            <p className="page-subtitle">Tire suas dúvidas e receba dicas de estudo personalizadas (Em Breve)</p>

            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
                    {messages.map(msg => (
                        <div key={msg.id} style={{ 
                            display: 'flex', gap: '1rem', 
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%'
                        }}>
                            {msg.role === 'assistant' && (
                                <div style={{ background: 'var(--accent)', color: 'white', padding: '0.6rem', borderRadius: '50%', height: 'fit-content' }}>
                                    <Bot size={20} />
                                </div>
                            )}
                            
                            <div style={{ 
                                background: msg.role === 'user' ? 'var(--accent)' : 'rgba(255,255,255,0.05)', 
                                padding: '1rem', borderRadius: 'var(--radius-md)'
                            }}>
                                <p style={{ margin: 0, lineHeight: 1.5, fontSize: '0.95rem' }}>{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-start' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                <div className="typing-indicator" style={{ display: 'flex', gap: '0.3rem' }}>
                                    <span style={{ width: 6, height: 6, background: 'var(--muted)', borderRadius: '50%', animation: 'pulse 1s infinite' }}/>
                                    <span style={{ width: 6, height: 6, background: 'var(--muted)', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }}/>
                                    <span style={{ width: 6, height: 6, background: 'var(--muted)', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }}/>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                    <div className="alert alert-info" style={{ marginBottom: '1rem', padding: '0.6rem', fontSize: '0.8rem' }}>
                        <ShieldAlert size={14} /> Integração da IA em desenvolvimento pela equipe técnica.
                    </div>
                    
                    <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                            type="text" 
                            style={{ flex: 1, margin: 0, padding: '0.875rem' }} 
                            placeholder="Faça uma pergunta sobre matemática, redação ou rotina..." 
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            disabled={loading}
                        />
                        <button type="submit" className="btn btn-primary" disabled={!prompt.trim() || loading} style={{ padding: '0 1.5rem' }}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Mail, Lock, Eye, EyeOff, GraduationCap, AlertCircle, User, ArrowRight, Sparkles } from 'lucide-react';
import Waves from './Waves';

const COURSES = [
    'Análise e Desenvolvimento de Sistemas',
    'Ciência da Computação',
    'Engenharia de Software',
    'Direito',
    'Medicina',
    'Engenharia Civil',
    'Administração',
    'Pedagogia',
    'Psicologia',
    'Enfermagem',
    'Arquitetura',
    'Economia',
    'Contabilidade',
    'Outro',
];

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

// Modal to collect course and name after Google first-time sign-in
const ProfileSetupModal = ({ onSave }) => {
    const [nome, setNome] = useState('');
    const [curso, setCurso] = useState(COURSES[0]);
    const [saving, setSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!nome.trim()) return;
        setSaving(true);
        await onSave({ nome: nome.trim(), curso });
        setSaving(false);
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal-card animate-fade">
                <div className="auth-modal-header">
                    <Sparkles size={24} className="auth-modal-icon" />
                    <h2>Bem-vindo(a)! 🎓</h2>
                    <p>Complete seu perfil para personalizar sua experiência</p>
                </div>
                <form onSubmit={handleSave} className="auth-form-body">
                    <div className="auth-field">
                        <User size={16} className="auth-field-icon" />
                        <input
                            type="text"
                            placeholder="Seu nome completo"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            required
                            autoFocus
                            autoComplete="name"
                        />
                    </div>
                    <div className="auth-field">
                        <BookOpen size={16} className="auth-field-icon" />
                        <select value={curso} onChange={e => setCurso(e.target.value)}>
                            {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="auth-btn-submit" disabled={saving || !nome.trim()}>
                        {saving ? <span className="auth-spinner" /> : (
                            <><ArrowRight size={16} /> Começar</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export const AuthScreen = () => {
    const { login, signup, loginWithGoogle, updateUserProfile } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nome, setNome] = useState('');
    const [curso, setCurso] = useState(COURSES[0]);
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showProfileSetup, setShowProfileSetup] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                if (!nome.trim()) {
                    setError('Por favor, informe seu nome.');
                    setLoading(false);
                    return;
                }
                await signup(email, password, curso, nome);
            }
        } catch (err) {
            console.error(err);
            const map = {
                'auth/invalid-credential': 'Email ou senha incorretos.',
                'auth/user-not-found': 'Email ou senha incorretos.',
                'auth/wrong-password': 'Email ou senha incorretos.',
                'auth/email-already-in-use': 'Este email já está cadastrado. Faça login.',
                'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
                'auth/invalid-email': 'Email inválido.',
                'auth/too-many-requests': 'Muitas tentativas. Aguarde e tente novamente.',
            };
            setError(map[err.code] || 'Ocorreu um erro. Tente novamente.');
        }
        setLoading(false);
    };

    const handleGoogle = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await loginWithGoogle();
            if (result.isNew) {
                setShowProfileSetup(true);
            }
        } catch (err) {
            console.error(err);
            if (err.code !== 'auth/popup-closed-by-user') {
                setError('Falha ao entrar com Google. Tente novamente.');
            }
        }
        setLoading(false);
    };

    const handleProfileSave = async (data) => {
        await updateUserProfile(data);
        setShowProfileSetup(false);
    };

    const switchMode = (loginMode) => {
        setIsLogin(loginMode);
        setError('');
        setEmail('');
        setPassword('');
        setNome('');
    };

    return (
        <div className="auth-scene">
            {/* Animated wave background */}
            <div className="auth-waves-bg">
                <div className="auth-waves-dark" />
                <Waves
                    lineColor="#770303"
                    backgroundColor="transparent"
                    waveSpeedX={0.02}
                    waveSpeedY={0.01}
                    waveAmpX={40}
                    waveAmpY={20}
                    friction={0.9}
                    tension={0.01}
                    maxCursorMove={120}
                    xGap={12}
                    yGap={36}
                />
            </div>

            {/* Fixed Top Navbar */}
            <nav className="auth-topnav">
                <div className="auth-topnav-logo">
                    <div className="auth-nav-logo-icon">
                        <GraduationCap size={18} />
                    </div>
                    <span>CronogramaLife</span>
                </div>
                <div className="auth-topnav-actions">
                    <button
                        className={`auth-nav-tab ${isLogin ? 'active' : ''}`}
                        onClick={() => switchMode(true)}
                    >
                        Entrar
                    </button>
                    <button
                        className={`auth-nav-tab ${!isLogin ? 'active' : ''}`}
                        onClick={() => switchMode(false)}
                    >
                        Cadastrar
                    </button>
                </div>
            </nav>

            {/* Glass Card */}
            <div className="auth-card-wrap">
                <div className="auth-glass-panel">
                    <div className="auth-panel-header">
                        <h2>{isLogin ? 'Bem-vindo de volta' : 'Criar sua conta'}</h2>
                        <p>
                            {isLogin ? 'Não tem conta? ' : 'Já é membro? '}
                            <button className="auth-switch-link" onClick={() => switchMode(!isLogin)}>
                                {isLogin ? 'Cadastre-se grátis' : 'Faça login'}
                            </button>
                        </p>
                    </div>

                    {error && (
                        <div className="auth-alert">
                            <AlertCircle size={15} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form-body" autoComplete="on">
                        {!isLogin && (
                            <div className="auth-field">
                                <User size={16} className="auth-field-icon" />
                                <input
                                    type="text"
                                    placeholder="Seu nome"
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    required={!isLogin}
                                    autoComplete="name"
                                    spellCheck={false}
                                />
                            </div>
                        )}

                        <div className="auth-field">
                            <Mail size={16} className="auth-field-icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="auth-field">
                            <Lock size={16} className="auth-field-icon" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                placeholder="Senha (mín. 6 caracteres)"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                            />
                            <button
                                type="button"
                                className="auth-field-eye"
                                onClick={() => setShowPass(s => !s)}
                                tabIndex={-1}
                            >
                                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>

                        {!isLogin && (
                            <div className="auth-field">
                                <BookOpen size={16} className="auth-field-icon" />
                                <select value={curso} onChange={e => setCurso(e.target.value)}>
                                    {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        )}

                        <button type="submit" className="auth-btn-submit" disabled={loading}>
                            {loading
                                ? <span className="auth-spinner" />
                                : isLogin ? 'Entrar' : 'Criar Conta'}
                        </button>
                    </form>

                    <div className="auth-separator"><span>ou continue com</span></div>

                    <div className="auth-socials">
                        <button className="auth-social-btn google" onClick={handleGoogle} disabled={loading}>
                            <GoogleIcon />
                            <span>Entrar com Google</span>
                        </button>
                    </div>

                    <p className="auth-footer-note">
                        Ao continuar, você concorda com nossos <a href="#">Termos de Uso</a>
                    </p>
                </div>
            </div>

            {/* Profile setup modal for first-time Google users */}
            {showProfileSetup && <ProfileSetupModal onSave={handleProfileSave} />}
        </div>
    );
};

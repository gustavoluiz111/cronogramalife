import React, { useState, useMemo } from 'react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import { CheckCircle, Circle, Layout as LayoutIcon, Percent, BookOpen } from 'lucide-react';

const SSA_DATA = {
  "Língua Portuguesa": {
    sections: [
      { name: "Campo jornalístico-midiático", items: [
        "Textos jornalísticos digitais: multimodalidade e hipertextualidade",
        "Fake news, checagem e confiabilidade da informação",
        "Interesses sociopolíticos no jornalismo",
        "Comparação de relatos em diferentes fontes e mídias",
        "Recursos linguísticos: modalizadores e operadores discursivos",
        "Graus de (im)parcialidade e escolhas linguístico-textuais"
      ]},
      { name: "Campo artístico-literário", items: [
        "Estéticas pré-modernista, modernista e pós-modernista",
        "Literatura contemporânea impressa e digital (ciberliteratura)",
        "Literatura feminina, indígena e afro-brasileira",
        "Diálogos entre textos de diferentes épocas",
        "Torto Arado — Itamar Vieira Jr.",
        "Ponciá Vicêncio — Conceição Evaristo",
        "A paixão segundo G.H. — Clarice Lispector",
        "Futuro ancestral — Ailton Krenak",
        "Quarto de despejo — Carolina Maria de Jesus",
        "Recado do morro — Guimarães Rosa",
        "Mensagem — Fernando Pessoa",
        "Vestida de preto e outros contos — Mário de Andrade",
        "Solo para vilarejo — Cida Pedrosa",
        "A visão das plantas — Djaimilia Pereira de Almeida"
      ]},
      { name: "Análise linguística transversal", items: [
        "Estratégias argumentativas e convencimento",
        "Relações de intertextualidade e interdiscursividade",
        "Relações lógico-semânticas e operadores argumentativos",
        "Coesão lexical, coerência e progressão textual",
        "Impessoalização e modalidade no português brasileiro",
        "Variação linguística e preconceito linguístico",
        "Formação sociolinguística do PB: contribuições africanas e indígenas"
      ]},
      { name: "Redação — Produção textual", items: [
        "Gênero dissertativo-argumentativo: estrutura e tipologia",
        "Competência A: fidelidade ao tema proposto",
        "Competência B: características textuais e discursivas do gênero",
        "Competência C: mobilização de conhecimento de mundo",
        "Competência D: mecanismos gramaticais e coesão",
        "Competência E: domínio da norma culta escrita",
        "Formato: mínimo 3 parágrafos, entre 20 e 30 linhas",
        "Situações de nota zero: fuga ao tema, cópia, fuga ao gênero"
      ]}
    ]
  },
  "Inglês": {
    sections: [
      { name: "Leitura e interpretação", items: [
        "Textos multissemióticos: elementos verbais e imagéticos",
        "Linguagem conotativa e denotativa em textos literários",
        "Análise crítica de gêneros digitais (redes sociais, blogs, notícias)",
        "Identificação e análise de fake news em inglês"
      ]},
      { name: "Gramática", items: [
        "Tempos compostos: Present Perfect e Past Perfect",
        "Linking words/connectors: yet, but, since, however, unless, such as",
        "Modal verbs: can, could, will, would, must, may, might",
        "Phrasal verbs e collocations",
        "Relative Clauses: who, which, that",
        "Passive voice",
        "Reflexive Pronouns",
        "Direct and Reported Speech; Indirect questions",
        "Reference words: pronouns relativos e advérbios",
        "Compound words e Determiners (some, any, no)",
        "Infinitive e -ing forms"
      ]},
      { name: "Léxico e formação de palavras", items: [
        "Prefixes e suffixes",
        "Cognates e False Cognates",
        "Idioms e expressões idiomáticas",
        "Variação linguística no inglês"
      ]}
    ]
  },
  "Espanhol": {
    sections: [
      { name: "Compreensão e análise", items: [
        "Textos dissertativos e expositivos em espanhol",
        "Gêneros digitais em ambiente virtual",
        "Falsos cognatos e formação de palavras",
        "Variação linguística do espanhol",
        "Universo cultural hispanofalante"
      ]},
      { name: "Gramática e recursos textuais", items: [
        "Tempos pretéritos: relações de temporalidade",
        "Pronomes complemento",
        "Marcadores e conectores de coesão textual",
        "Relações sintático-semânticas: adição, oposição, causa, consequência, condição, finalidade",
        "Recursos multimodais e diagramação",
        "Efeitos de sentido de escolhas lexicais"
      ]},
      { name: "Temas contemporâneos", items: [
        "Meio ambiente e consumo no mundo hispanofalante",
        "Direitos Humanos",
        "Ciência e tecnologia"
      ]}
    ]
  },
  "Matemática": {
    sections: [
      { name: "Números e Álgebra", items: [
        "Razão e proporção; porcentagem",
        "Aumentos e descontos percentuais sucessivos",
        "Escala",
        "Função seno: domínio, imagem, período, máximos e mínimos, zeros",
        "Função cosseno: domínio, imagem, período, máximos e mínimos, zeros",
        "Função tangente: domínio, imagem, zeros",
        "Representações algébrica, tabular e gráfica das funções trigonométricas",
        "Funções periódicas"
      ]},
      { name: "Geometria e Trigonometria", items: [
        "Congruência e semelhança de triângulos",
        "Relações métricas no triângulo retângulo",
        "Relações trigonométricas no triângulo retângulo",
        "Lei dos senos",
        "Lei dos cossenos",
        "Transformações isométricas e homotéticas",
        "Projeção ortogonal, localização e movimentação",
        "Geometria analítica: equação da reta",
        "Geometria analítica: equação da circunferência"
      ]},
      { name: "Probabilidade, Estatística e Pensamento Computacional", items: [
        "Histograma: leitura, análise e interpretação",
        "Box plot: leitura, análise e interpretação",
        "Fluxogramas: leitura, análise e execução",
        "Espaços amostrais equiprováveis e não-equiprováveis",
        "Probabilidade da união e interseção de eventos",
        "Probabilidade condicional",
        "Cálculo de probabilidades por frequências relativas e simulações"
      ]}
    ]
  },
  "Biologia": {
    sections: [
      { name: "Genética Básica", items: [
        "Padrões mendelianos: 1ª e 2ª Leis de Mendel",
        "Padrões não mendelianos: dominância incompleta, codominância",
        "Interação gênica e alelos múltiplos",
        "Penetrância e expressividade",
        "Ligações gênicas e recombinação",
        "Mapas genéticos",
        "Herança ligada ao sexo e cromossomos sexuais",
        "Mutações gênicas e alterações cromossômicas"
      ]},
      { name: "Genética Moderna e Biotecnologia", items: [
        "Noções de célula-tronco",
        "Clonagem",
        "Tecnologia do DNA recombinante",
        "Nanotecnologia",
        "Variabilidade genética e genomas",
        "Genoma humano",
        "Racismo, eugenia, vacinas e diversidades",
        "Biotecnologia e sistemática"
      ]},
      { name: "Evolução", items: [
        "Teorias evolutivas: Lamarck, Darwin e Neodarwinismo",
        "Evidências da evolução",
        "Tempo geológico e paleontológico",
        "Formação e evolução das espécies (especiação)",
        "Evolução da espécie humana",
        "Fatores evolutivos: mutação, seleção natural, deriva genética, fluxo gênico",
        "Diversidade étnico-sócio-cultural-sexual humana",
        "Seleção artificial e impactos ambientais e populacionais",
        "Noções de genética de populações"
      ]},
      { name: "Ecologia", items: [
        "Ecossistemas: fatores bióticos e abióticos",
        "Teia alimentar",
        "Sucessão ecológica e comunidade clímax",
        "Dinâmica de populações",
        "Ciclos biogeoquímicos",
        "Biociclos: terrestre, de água doce e marinho",
        "Relações entre seres vivos (intra e interespecíficas)",
        "Conservação da biodiversidade",
        "Recuperação de ecossistemas e tecnologias ambientais",
        "Problemas ambientais: mudanças climáticas, desmatamento, poluição"
      ]}
    ]
  },
  "Física": {
    sections: [
      { name: "Fenômenos Oscilatórios e Ondulatórios", items: [
        "Oscilações",
        "Movimento harmônico simples (MHS)",
        "Força e energia no MHS",
        "Cinemática e dinâmica do MHS: pêndulos"
      ]},
      { name: "Fenômenos Elétricos e Magnéticos", items: [
        "Carga elétrica e Lei de Coulomb",
        "Condutores e isolantes",
        "Campo elétrico",
        "Energia potencial elétrica e potencial elétrico",
        "Capacitores e associação de capacitores",
        "Resistores e associação de resistores",
        "Efeito Joule e Lei de Ohm",
        "Resistência e resistividade",
        "Tensão, corrente, potência e energia elétrica",
        "Circuitos elétricos simples: tensão contínua e alternada",
        "Geradores e associação de geradores",
        "Medidores elétricos",
        "Transformadores e indutores",
        "Campo Magnético e Campo Magnético Terrestre",
        "Força e Indução Magnética",
        "Leis de Faraday e Lenz",
        "Conversão de outras energias em energia elétrica"
      ]},
      { name: "Relatividade e Física Quântica", items: [
        "Introdução à Teoria da Relatividade Restrita",
        "Experiência de Michelson–Morley",
        "Postulados da Relatividade Restrita",
        "Dilatação temporal",
        "Quantidade de movimento, energia e massa relativística",
        "Origens da Mecânica Quântica; Radiação Térmica e Corpo Negro",
        "Quantização da Energia: Hipótese de Planck",
        "Efeito Fotoelétrico",
        "Modelos Atômicos: Rutherford e Bohr",
        "Dualidade Onda-Partícula e Princípio da Incerteza",
        "Aceleradores de Partículas"
      ]},
      { name: "Astronomia", items: [
        "Teoria do Big Bang: origem e expansão do Universo",
        "Planetas e formação planetária",
        "Evolução Estelar: formação, supernovas, origem dos elementos",
        "Objetos Compactos: anãs brancas, estrelas de nêutrons, buracos negros, pulsares",
        "Sistema Solar"
      ]}
    ]
  },
  "Química": {
    sections: [
      { name: "Ciência, Tecnologia e Sociedade (CTS)", items: [
        "Química no cotidiano, na saúde, na agricultura e nos alimentos",
        "Combustíveis e biocombustíveis: questões energéticas e impactos ambientais",
        "Fontes alternativas de energia",
        "Química e sustentabilidade ambiental"
      ]},
      { name: "Química Orgânica", items: [
        "Características gerais da Química Orgânica",
        "Hidrocarbonetos: estrutura, classificação, propriedades e obtenção",
        "Compostos halogenados, oxigenados, nitrogenados e sulfurados",
        "Isomeria (plana e espacial)",
        "Reações orgânicas: substituição, adição, eliminação e oxirredução",
        "Macromoléculas naturais e sintéticas: composição e função biológica",
        "Impactos sociais e ambientais de substâncias orgânicas",
        "Ciclos naturais: carbono, enxofre e nitrogênio",
        "Química do petróleo: aplicações industriais, econômicas e ambientais"
      ]},
      { name: "Eletroquímica", items: [
        "Reações de oxirredução",
        "Potenciais padrão de redução",
        "Pilhas: funcionamento e tipos",
        "Eletrólise: definição, Leis de Faraday e Equação de Nernst",
        "Cálculos envolvendo pilhas e eletroquímica",
        "Galvanoplastia, metalurgia e mineração"
      ]}
    ]
  },
  "História": {
    sections: [
      { name: "Brasil: República e Transições", items: [
        "Crise do Império e advento da República",
        "Novas formas de organização política e social",
        "Política, cultura e manifestações culturais no Brasil (séculos XX e XXI)",
        "Questões femininas e movimentos sociais negros no Brasil"
      ]},
      { name: "América Latina", items: [
        "Modernização, urbanização e industrialização na América Latina",
        "Populismos, Estado e regimes políticos na América Latina",
        "Reformas políticas e revoluções na América Latina"
      ]},
      { name: "Conflitos Mundiais e Guerra Fria", items: [
        "Primeira Guerra Mundial: causas, desenvolvimento e consequências",
        "Segunda Guerra Mundial: fascismos, ditaduras e totalitarismos",
        "Bipolarização do mundo e Guerra Fria",
        "Socialismos ao longo do século XX"
      ]},
      { name: "Mundo Contemporâneo", items: [
        "Descolonização na Ásia e África; movimentos de libertação nacional",
        "Conflitos no Oriente Médio (séculos XX e XXI)",
        "Nova ordem mundial e reconfiguração pós-URSS",
        "Arte e cultura: do eurocentrismo ao multiculturalismo",
        "Impacto das novas tecnologias na sociedade contemporânea"
      ]}
    ]
  },
  "Geografia": {
    sections: [
      { name: "Atividades Econômicas e Território", items: [
        "Usos da terra: processos produtivos, capital e relações de trabalho",
        "Questão agrária brasileira: acesso à terra e relações de poder",
        "Territórios urbanos e rurais: articulações campo-cidade-natureza",
        "Aspectos socioambientais das transformações no campo",
        "Sustentabilidade e usos tradicionais do território"
      ]},
      { name: "Indústria e Globalização", items: [
        "Processo histórico de industrialização e revoluções tecnológicas",
        "Produção, consumo, desindustrialização e reestruturação do trabalho",
        "Economia global: características e processo histórico",
        "Blocos econômicos: aspectos econômicos, políticos e sociais",
        "Articulações local-regional-global: energia, ambiente e trabalho"
      ]},
      { name: "Tecnologia e Sociedade", items: [
        "Redes de comunicação e transporte na constituição do território",
        "Novas tecnologias: impactos no mundo do trabalho e na sociedade",
        "Transformações sociotecnológicas e efeitos socioecológicos",
        "Globalização: aspectos econômicos, populacionais, ambientais e culturais"
      ]}
    ]
  },
  "Filosofia & Sociologia": {
    sections: [
      { name: "Filosofia: história e política", items: [
        "Renascimento e nova compreensão do mundo",
        "Revolução científica e industrial (séculos XVIII e XIX)",
        "Liberalismo e neoliberalismo",
        "Ressurgência do fascismo, nova direita radical e crise da democracia",
        "Conceito de liberdade nas civilizações clássicas",
        "Revolução Francesa e Declaração dos Direitos do Homem e do Cidadão"
      ]},
      { name: "Ética contemporânea", items: [
        "Biotecnologia e ética",
        "Antropoceno: impacto humano no planeta e futuro da humanidade",
        "Relações sociais no sistema neoliberal"
      ]},
      { name: "Sociologia", items: [
        "Identidade e reconhecimento de diferentes grupos populacionais",
        "Migrações e processos culturais",
        "Lutas operárias ao longo do tempo: história e sociedade",
        "Desigualdades sociais no capitalismo contemporâneo",
        "Transformações sociotecnológicas e efeitos socioecológicos"
      ]}
    ]
  }
};

const ENEM_DATA = {
  "Aguardando...": {
    sections: [
      { name: "Em breve", items: [
        "Assim que você criar o checklist do ENEM, ele será exibido aqui."
      ]}
    ]
  }
};

export const Checklists = () => {
    const [examMode, setExamMode] = useState('SSA3'); // SSA3 ou ENEM
    const [ssaState, setSsaState] = useFirebaseData('ssa3_2026_progress_v2', {});
    const [enemState, setEnemState] = useFirebaseData('enem_2026_progress', {});

    const activeData = examMode === 'SSA3' ? SSA_DATA : ENEM_DATA;
    const activeState = examMode === 'SSA3' ? ssaState : enemState;
    const setActiveState = examMode === 'SSA3' ? setSsaState : setEnemState;

    const subjects = Object.keys(activeData);
    const [activeSubj, setActiveSubj] = useState(subjects[0]);

    const handleToggle = (subj, item) => {
        const key = `${subj}||${item}`;
        setActiveState({
            ...activeState,
            [key]: !activeState[key]
        });
    };

    const handleMarkAll = (subj, val) => {
        const newState = { ...activeState };
        activeData[subj].sections.forEach(sec => {
            sec.items.forEach(item => {
                newState[`${subj}||${item}`] = val;
            });
        });
        setActiveState(newState);
    };

    const getStats = (subj) => {
        let total = 0, done = 0;
        activeData[subj].sections.forEach(s => s.items.forEach(it => {
            total++;
            if (activeState[`${subj}||${it}`]) done++;
        }));
        return { total, done };
    };

    const getGlobalStats = () => {
        let total = 0, done = 0;
        Object.keys(activeData).forEach(s => { 
            const st = getStats(s); 
            total += st.total; 
            done += st.done; 
        });
        return { total, done };
    };

    const globalStats = getGlobalStats();
    const globalPct = globalStats.total ? Math.round((globalStats.done / globalStats.total) * 100) : 0;
    const activeStats = getStats(activeSubj);
    const activePct = activeStats.total ? Math.round((activeStats.done / activeStats.total) * 100) : 0;

    return (
        <div className="animate-fade">
            <h1 className="page-title">Checklists de Estudos</h1>
            <p className="page-subtitle mb-4">Acompanhe seu progresso nos principais exames.</p>

            <div className="card mb-4">
                <div className="flex gap-2" style={{ background: 'rgba(0,0,0,0.3)', padding: '0.25rem', borderRadius: '12px', display: 'inline-flex' }}>
                    <button
                        onClick={() => { setExamMode('SSA3'); setActiveSubj(Object.keys(SSA_DATA)[0]); }}
                        style={{
                            padding: '0.5rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 'bold',
                            background: examMode === 'SSA3' ? 'var(--accent)' : 'transparent',
                            color: examMode === 'SSA3' ? 'white' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        SSA 3 (2026)
                    </button>
                    <button
                        onClick={() => { setExamMode('ENEM'); setActiveSubj(Object.keys(ENEM_DATA)[0]); }}
                        style={{
                            padding: '0.5rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 'bold',
                            background: examMode === 'ENEM' ? 'var(--accent)' : 'transparent',
                            color: examMode === 'ENEM' ? 'white' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        ENEM
                    </button>
                </div>

                <div className="mt-4 flex justify-between items-center text-sm mb-2">
                    <span className="text-muted">{globalStats.done} de {globalStats.total} tópicos concluídos</span>
                    <span className="font-mono text-accent font-bold">{globalPct}%</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${globalPct}%`, background: 'linear-gradient(90deg, var(--accent), var(--success))' }} />
                </div>
            </div>

            <div className="grid md:grid-cols-[220px_1fr] gap-6" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem' }}>
                <div className="card p-4" style={{ alignSelf: 'start', position: 'sticky', top: '1rem' }}>
                    <h3 className="text-xs uppercase tracking-wider text-muted mb-3 font-mono">Disciplinas</h3>
                    <div className="flex flex-col gap-1">
                        {subjects.map(subj => {
                            const { total, done } = getStats(subj);
                            const pct = total ? Math.round((done / total) * 100) : 0;
                            const isActive = activeSubj === subj;
                            return (
                                <button
                                    key={subj}
                                    onClick={() => setActiveSubj(subj)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '0.6rem 0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid',
                                        borderColor: isActive ? 'var(--accent)' : 'transparent',
                                        background: isActive ? 'rgba(124, 106, 255, 0.1)' : 'transparent',
                                        color: isActive ? 'var(--accent)' : 'var(--muted)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        textAlign: 'left',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? 'var(--accent)' : 'var(--border)' }} />
                                        {subj}
                                    </div>
                                    <span className="font-mono text-xs">{pct}%</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="card">
                    <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
                        <div>
                            <h2 className="text-xl font-bold font-mono">{activeSubj}</h2>
                            <p className="text-muted text-sm mt-1">{activeStats.total} tópicos no programa</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn btn-outline btn-sm" onClick={() => handleMarkAll(activeSubj, false)}>Limpar</button>
                            <button className="btn btn-primary btn-sm" onClick={() => handleMarkAll(activeSubj, true)}>Marcar Todos</button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between text-xs text-muted mb-2 font-mono">
                            <span>{activeStats.done} / {activeStats.total} tópicos</span>
                            <span>{activePct}%</span>
                        </div>
                        <div className="progress-bar" style={{ height: 4 }}>
                            <div className="progress-fill" style={{ width: `${activePct}%` }} />
                        </div>
                    </div>

                    {activeData[activeSubj].sections.map((sec, i) => (
                        <div key={i} className="mb-6 last:mb-0">
                            <h4 className="text-xs uppercase tracking-widest text-muted mb-3 pb-2 border-b border-[rgba(255,255,255,0.05)] font-mono">
                                {sec.name}
                            </h4>
                            <div className="flex flex-col gap-1">
                                {sec.items.map((item, j) => {
                                    const key = `${activeSubj}||${item}`;
                                    const isDone = !!activeState[key];
                                    return (
                                        <div
                                            key={j}
                                            onClick={() => handleToggle(activeSubj, item)}
                                            style={{
                                                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                                                padding: '0.6rem',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s',
                                                background: 'transparent'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <div style={{ marginTop: 2, color: isDone ? 'var(--success)' : 'var(--muted)' }}>
                                                {isDone ? <CheckCircle size={18} /> : <Circle size={18} />}
                                            </div>
                                            <span style={{ 
                                                fontSize: '0.9rem', 
                                                color: isDone ? 'var(--muted)' : 'var(--text-primary)',
                                                textDecoration: isDone ? 'line-through' : 'none',
                                                lineHeight: 1.5
                                            }}>
                                                {item}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

# Sistema de Organização Acadêmica e Pessoal

Este é o seu painel central de vida, focado na aprovação no ENEM/SSA e organização pessoal.

## Funcionalidades
- **Dashboard**: Visão geral do dia, saúde e progresso Ferreto.
- **Escola**: Horário fixo e calculadora de notas (Média Trimestral e Anual).
- **Cursos**: Acompanhamento detalhado do Curso Ferreto (31 semanas) e checklist de outros cursos.
- **Planner**: Planejamento semanal com gerador automático baseado em estratégia (Exatas vs Humanas).
- **Saúde**: Monitoramento de sono e treinos semanais.
- **Metas**: Objetivos universitários (ADS, Direito, CC) com estratégia.

## Como Usar (Localmente)

1.  **Instalar dependências**:
    ```bash
    npm install
    ```
2.  **Iniciar o sistema**:
    ```bash
    npm run dev
    ```
    Acesse `http://localhost:5173`.

## Publicar no GitHub Pages

Para colocar o site online (GitHub Repository):

1.  Crie um repositório no GitHub.
2.  No arquivo `vite.config.js`, adicione a base do repositório (opcional):
    ```js
    export default defineConfig({
      plugins: [react()],
      base: '/nome-do-repositorio/', // Ex e.g.: '/cronograma-life/'
    })
    ```
3.  Execute o build:
    ```bash
    npm run build
    ```
4.  Suba o conteúdo da pasta `dist` para a branch `gh-pages` ou configure o GitHub Pages para ler da pasta `docs` (se renomear).
    Recomendação: Use a action `gh-pages` ou suba manualmente o conteúdo para a raiz de um repositório `docs`.

## Estrutura do Projeto
- `src/App.jsx`: Componente principal.
- `src/components/`: Onde está a lógica de cada aba (School, Planner, etc).
- `src/index.css`: Estilização global (Design da Montanha).

## Automação e Dados
Os dados são salvos automaticamente no navegador (`localStorage`). Se limpar o cache, os dados somem. Para backup, use o botão "Salvar" no futuro (se implementado) ou exporte manualmente.

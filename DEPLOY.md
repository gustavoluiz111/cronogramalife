# 🚀 COMANDOS PARA DEPLOY - COPIE E COLE

## ⚠️ IMPORTANTE: Execute os comandos NA ORDEM

### 1️⃣ Inicializar Git e Fazer Push

```bash
git init
git add .
git commit -m "Sistema de Organização Acadêmica - Deploy inicial"
git remote add origin https://github.com/gustavoluiz111/cronogramalife.git
git branch -M main
git push -u origin main
```

**Se der erro "remote origin already exists":**
```bash
git remote remove origin
git remote add origin https://github.com/gustavoluiz111/cronogramalife.git
git push -u origin main
```

**Se der erro ao fazer push:**
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main --force
```

### 2️⃣ Fazer Deploy para GitHub Pages

```bash
npm run deploy
```

### 3️⃣ Configurar GitHub Pages (Manual)

1. Acesse: https://github.com/gustavoluiz111/cronogramalife/settings/pages
2. Em **Source**, selecione: `gh-pages` branch
3. Clique em **Save**
4. Aguarde 2-5 minutos

### 4️⃣ Acessar o Site

Seu site estará em:
**https://gustavoluiz111.github.io/cronogramalife/**

---

## 🔄 Para Atualizações Futuras

Quando fizer mudanças:

```bash
git add .
git commit -m "Descrição da mudança"
git push origin main
npm run deploy
```

---

## ✅ Status

- ✅ Vite configurado (`base: '/cronogramalife/'`)
- ✅ `.gitignore` criado
- ✅ `gh-pages` instalado
- ✅ Scripts de deploy adicionados
- ⏳ **PRÓXIMO PASSO**: Execute os comandos acima!

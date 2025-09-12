# 🔧 Correção do Build Command

## ❌ **Problema Identificado:**

O Render está mostrando:
```
==> Empty build command; skipping build
```

Isso significa que o Build Command está vazio no dashboard.

## ✅ **Solução:**

### **1. No Dashboard do Render:**

#### **A. Acesse:**
- https://dashboard.render.com
- Projeto: "estampai"
- **Settings** → **Build & Deploy**

#### **B. Configure:**
- **Build Command**: `./build.sh`
- **Publish Directory**: `.` (ponto)
- **Node Version**: `18` ou `20`

#### **C. Salve as alterações**

### **2. Environment Variables:**

Adicione:
- **Name**: `OPENAI_API_KEY`
- **Value**: `[SUA_API_KEY_AQUI]`

### **3. Manual Deploy:**

Após configurar:
- Clique em **"Manual Deploy"**
- Selecione **"Deploy latest commit"**

## 🔍 **Logs Esperados:**

Após configurar corretamente, você deve ver:
```
==> Running build command './build.sh'...
🔧 Iniciando build do EstampAI...
✅ API Key encontrada: [API_KEY]...
🔄 Atualizando arquivos principais...
✅ index.html atualizado
✅ config.js atualizado
✅ embed/config.js atualizado
🔄 Atualizando embeds...
✅ estampai-embed.html atualizado
✅ estampai-embed-optimized.html atualizado
✅ estampai-embed-dark.html atualizado
✅ estampai-embed-compact.html atualizado
✅ estampai-embed-mobile.html atualizado
🎉 Build concluído com sucesso!
```

## ⚠️ **Importante:**

- **Build Command no dashboard**: `./build.sh`
- **NÃO deixe vazio** no dashboard
- **O package.json é backup**, mas o dashboard tem prioridade

---

**Configure o Build Command como `./build.sh` no dashboard do Render!** 🎯

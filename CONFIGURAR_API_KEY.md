# 🔑 Configuração da API Key no Render

## ⚠️ **IMPORTANTE: Segurança da API Key**

Por questões de segurança, a API key não está incluída no código. Você precisa configurá-la no Render.

## 🚀 **Como configurar no Render:**

### 1. **Acesse o Dashboard do Render**
- Vá para: https://dashboard.render.com
- Entre na sua conta
- Selecione o projeto "estampai"

### 2. **Configure a Variável de Ambiente**
- No menu lateral, clique em **"Environment"**
- Clique em **"Add Environment Variable"**
- **Name**: `OPENAI_API_KEY`
- **Value**: `[SUA_API_KEY_AQUI]` (cole sua API key aqui)
- Clique em **"Save Changes"**

### 3. **Redeploy o Projeto**
- Após salvar a variável, clique em **"Manual Deploy"**
- Selecione **"Deploy latest commit"**
- Aguarde o deploy completar

## ✅ **Verificação**

Após o deploy, acesse:
- **Site principal**: https://estampai.onrender.com
- **Embeds**: https://estampai.onrender.com/embed/

## 🔧 **Para Desenvolvimento Local**

Se quiser testar localmente, substitua `YOUR_OPENAI_API_KEY_HERE` nos arquivos:
- `index.html`
- `config.js`
- `embed/config.js`

## 📝 **Arquivos que usam a API Key:**

- ✅ `index.html` - Site principal
- ✅ `config.js` - Configuração global
- ✅ `embed/config.js` - Configuração dos embeds
- ✅ `embed/estampai-embed.html` - Embed original
- ✅ `embed/estampai-embed-optimized.html` - Embed otimizado
- ✅ `embed/estampai-embed-dark.html` - Embed dark theme
- ✅ `embed/estampai-embed-compact.html` - Embed compacto
- ✅ `embed/estampai-embed-mobile.html` - Embed mobile

## 🛡️ **Segurança**

- ✅ API key não está no código
- ✅ Usa variáveis de ambiente no Render
- ✅ GitHub não detecta segredos
- ✅ Deploy seguro e protegido

---

**Sua nova API key está pronta para uso!** 🎉

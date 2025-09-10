# 🎨 EstampAI Embed - Guia de Uso

## 🚀 Início Rápido

### 1. Servidor Local (HTTP)
```bash
cd embed
python3 cors-server.py
# Acesse: http://localhost:8001
```

### 2. Servidor HTTPS (Recomendado)
```bash
cd embed
pip install cryptography  # Instala dependência
python3 https-server.py
# Acesse: https://localhost:8443
```

## 🔧 Resolvendo CORS

### Problema
O navegador bloqueia requisições de `http://localhost` para APIs externas por questões de segurança.

### Soluções

#### ✅ Solução 1: Use HTTPS Local
```bash
# Instala mkcert (recomendado)
brew install mkcert  # macOS
choco install mkcert  # Windows
sudo apt install mkcert  # Linux

# Cria certificado local
mkcert -install
mkcert localhost 127.0.0.1 ::1

# Renomeia os arquivos
mv localhost+2.pem server.crt
mv localhost+2-key.pem server.key

# Inicia servidor HTTPS
python3 https-server.py
```

#### ✅ Solução 2: Deploy em Produção
- **Vercel** (gratuito)
- **Netlify** (gratuito)
- **GitHub Pages** (gratuito)
- **Firebase Hosting** (gratuito)

## 📱 Teste de Compatibilidade

### Acesse o teste:
- **HTTP:** http://localhost:8001/framer-test.html
- **HTTPS:** https://localhost:8443/framer-test.html

### O que é testado:
- ✅ HTML5 Semântico
- ✅ CSS3 Responsivo
- ✅ JavaScript ES6+
- ✅ IndexedDB (Cache)
- ✅ localStorage
- ✅ Fetch API
- ✅ Canvas API
- ⚠️ CORS Headers (requer HTTPS)

## 🎯 Embed no Framer

### Código para Framer:
```html
<iframe 
    src="https://seu-dominio.com/embed/estampai-embed.html"
    width="100%" 
    height="600" 
    frameborder="0"
    allow="clipboard-write"
    title="EstampAI - Gerador de Estampas"
></iframe>
```

### Configurações:
- **Largura:** 100% (responsivo)
- **Altura:** 600px (recomendado)
- **Frameborder:** 0
- **Allow:** clipboard-write (para downloads)

## 🔧 Configuração

### Variáveis de Ambiente:
```javascript
const CONFIG = {
    apiKey: 'sua-api-key-aqui',
    maxStamps: 3,  // Limite freemium
    cacheEnabled: true,
    analyticsEnabled: true,
    rateLimitEnabled: true
};
```

### Personalização:
- **Avatar:** Substitua `AVATAR.png`
- **Cores:** Edite as variáveis CSS
- **Limites:** Ajuste `CONFIG.maxStamps`
- **Portfólio:** Atualize `showPortfolio()`

## 📊 Funcionalidades

### ✅ Implementado:
- 🎨 **Geração de estampas** com DALL-E 3
- 💬 **Chat conversacional** com GPT-4
- 📱 **Design responsivo** (mobile/desktop)
- 💾 **Cache inteligente** (IndexedDB)
- 🚦 **Rate limiting** por usuário
- 📈 **Analytics** completo
- 🎯 **Lead capture** automático
- 💧 **Watermark** discreto
- 🔒 **CORS** configurado

### 🚀 Próximas Fases:
- 💰 **Monetização** (freemium)
- 💳 **Pagamento** por estampa
- 📧 **Notificações** de lead
- 📊 **Dashboard** de analytics

## 🐛 Troubleshooting

### Erro: "Origin null is not allowed"
- **Causa:** CORS do navegador
- **Solução:** Use HTTPS ou deploy em produção

### Erro: "Failed to load resource"
- **Causa:** Arquivo não encontrado
- **Solução:** Verifique se `AVATAR.png` existe

### Erro: "API Key invalid"
- **Causa:** Chave da OpenAI inválida
- **Solução:** Verifique a API key no código

### Erro: "Rate limit exceeded"
- **Causa:** Muitas requisições
- **Solução:** Aguarde ou ajuste os limites

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique este README
2. Teste com o arquivo `framer-test.html`
3. Verifique o console do navegador
4. Entre em contato

---

**🎨 EstampAI - Gerador de Estampas com IA**

# 🚀 Deploy do EstampAI no Render - Guia Completo

## 📋 Pré-requisitos

- ✅ Conta no [Render.com](https://render.com)
- ✅ Repositório no GitHub com o EstampAI
- ✅ API Key da OpenAI configurada
- ✅ Domínio personalizado (opcional)

## 🎯 Método 1: Deploy Automático (Recomendado)

### **Passo 1: Preparar o Repositório**

1. **Faça commit dos arquivos de configuração:**
```bash
git add render.yaml package.json .renderignore
git commit -m "Add Render deployment configuration"
git push origin main
```

### **Passo 2: Conectar no Render**

1. **Acesse [Render Dashboard](https://dashboard.render.com)**
2. **Clique em "New +" → "Static Site"**
3. **Conecte seu repositório GitHub**
4. **Configure o serviço:**

```
Name: estampai
Branch: main
Root Directory: (deixe vazio)
Build Command: echo "No build needed"
Publish Directory: .
```

### **Passo 3: Configurar Variáveis de Ambiente**

No dashboard do Render, vá em **Environment** e adicione:

```
OPENAI_API_KEY = sua-api-key-aqui
NODE_ENV = production
RENDER = true
```

### **Passo 4: Configurar Headers CORS**

No dashboard, vá em **Headers** e adicione:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
X-Frame-Options: ALLOWALL (apenas para /embed/*)
```

### **Passo 5: Deploy**

1. **Clique em "Create Static Site"**
2. **Aguarde o deploy (2-3 minutos)**
3. **Teste a URL gerada**

## 🎯 Método 2: Deploy Manual

### **Passo 1: Upload Direto**

1. **Acesse Render Dashboard**
2. **New + → Static Site → Upload**
3. **Arraste a pasta do EstampAI**
4. **Configure as mesmas variáveis**

### **Passo 2: Configurar Domínio**

1. **Vá em Settings → Custom Domains**
2. **Adicione seu domínio**
3. **Configure DNS conforme instruções**

## 🔧 Configurações Avançadas

### **Headers para Embed**

```yaml
# Para /embed/*
X-Frame-Options: ALLOWALL
Content-Security-Policy: frame-ancestors *;
Access-Control-Allow-Origin: *
```

### **Cache Headers**

```yaml
# Para assets estáticos
Cache-Control: public, max-age=3600
# Para HTML
Cache-Control: public, max-age=300
```

### **Redirects**

```yaml
# Redirects no render.yaml
routes:
  - type: rewrite
    source: /embed
    destination: /embed/estampai-embed.html
```

## 📱 Testando o Deploy

### **URLs de Teste**

```
# Site principal
https://seu-app.onrender.com

# Embed para Framer
https://seu-app.onrender.com/embed/estampai-embed.html

# Teste de compatibilidade
https://seu-app.onrender.com/embed/framer-test.html
```

### **Teste de Funcionalidades**

1. **Abra o site principal**
2. **Teste o chat com IA**
3. **Gere uma estampa**
4. **Teste o embed no Framer**

## 🎨 Personalização

### **Cores e Branding**

Edite no `embed/estampai-embed.html`:

```css
:root {
    --primary-color: #1A237E;    /* Sua cor */
    --secondary-color: #4CAF50;  /* Sua cor */
}
```

### **Logo e Watermark**

```javascript
// Linha 604-608 do estampai-embed.html
<div class="watermark" onclick="showPortfolio()">
    <span class="watermark-text">Powered by</span>
    <span class="watermark-brand">SEU BRAND</span>
    <span class="watermark-arrow">→</span>
</div>
```

## 🔒 Segurança

### **API Key**

- ✅ **NUNCA** commite a API key no código
- ✅ Use variáveis de ambiente no Render
- ✅ Configure rate limiting

### **CORS**

- ✅ Configure headers CORS corretos
- ✅ Limite origins se necessário
- ✅ Use HTTPS sempre

## 📊 Monitoramento

### **Logs do Render**

1. **Acesse o dashboard**
2. **Vá em Logs**
3. **Monitore erros e performance**

### **Analytics**

```javascript
// No estampai-embed.html
analytics.track('deploy_success', {
    platform: 'render',
    timestamp: Date.now()
});
```

## 🚀 Otimizações

### **Performance**

1. **Habilite gzip no Render**
2. **Configure cache headers**
3. **Otimize imagens**
4. **Use CDN se necessário**

### **SEO**

```html
<!-- No index.html -->
<meta name="description" content="EstampAI - Crie estampas únicas com IA">
<meta property="og:title" content="EstampAI">
<meta property="og:description" content="Sistema de chat com IA para criação de estampas">
```

## 🔧 Troubleshooting

### **Problemas Comuns**

**1. CORS Errors**
```bash
# Verifique headers no Render dashboard
Access-Control-Allow-Origin: *
```

**2. API Key não funciona**
```bash
# Verifique variáveis de ambiente
echo $OPENAI_API_KEY
```

**3. Embed não carrega no Framer**
```bash
# Verifique X-Frame-Options
X-Frame-Options: ALLOWALL
```

**4. Site não atualiza**
```bash
# Force refresh no Render
# Ou aguarde cache expirar
```

## 📈 Próximos Passos

### **Após Deploy**

1. **Teste todas as funcionalidades**
2. **Configure domínio personalizado**
3. **Configure analytics**
4. **Monitore performance**
5. **Integre no Framer**

### **Integração com Framer**

```html
<!-- Use esta URL no Framer -->
<iframe 
    src="https://seu-app.onrender.com/embed/estampai-embed.html"
    width="100%" 
    height="600" 
    frameborder="0"
    allow="clipboard-write"
    title="EstampAI - Gerador de Estampas"
></iframe>
```

## 🎉 Resultado Final

Você terá:

- ✅ **EstampAI funcionando** no Render
- ✅ **HTTPS automático**
- ✅ **CORS configurado**
- ✅ **Pronto para Framer**
- ✅ **Deploy automático** via GitHub
- ✅ **Monitoramento** de logs
- ✅ **Escalabilidade** automática

**O EstampAI estará online e pronto para uso!** 🚀

---

## 📞 Suporte

Se tiver problemas:

1. **Verifique os logs** no Render dashboard
2. **Teste localmente** primeiro
3. **Verifique variáveis** de ambiente
4. **Consulte a documentação** do Render

**Boa sorte com o deploy!** 🎯

# 🔐 **Configuração Segura das Chaves do Stripe**

## **📋 Passo a Passo Completo**

### **1. 🔑 Obter Chaves do Stripe**

1. Acesse o [Dashboard do Stripe](https://dashboard.stripe.com/apikeys)
2. Copie suas chaves:
   - **Chave Pública:** `pk_live_...` (para frontend)
   - **Chave Secreta:** `sk_live_...` (para backend)

### **2. 🏠 Configuração Local (Desenvolvimento)**

#### **2.1 Criar arquivo `.env`:**
```bash
# No diretório raiz do projeto
touch .env
```

#### **2.2 Adicionar chaves no `.env`:**
```env
# 🔐 CONFIGURAÇÃO LOCAL DO STRIPE
STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave_publica_aqui
STRIPE_SECRET_KEY=sk_live_sua_chave_secreta_aqui
STRIPE_MODE=live
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook_aqui
GOOGLE_ANALYTICS_ID=G-E0Z97STDKV
OPENAI_API_KEY=sk-sua_chave_openai_aqui
```

#### **2.3 Instalar dependências:**
```bash
npm install
```

#### **2.4 Testar localmente:**
```bash
npm start
```

### **3. 🚀 Configuração no Render.com (Produção)**

#### **3.1 Acessar Dashboard do Render:**
1. Vá para [render.com](https://render.com)
2. Acesse seu projeto `estampai-unified`
3. Vá em **Environment**

#### **3.2 Adicionar Variáveis de Ambiente:**
```bash
STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave_publica_aqui

STRIPE_SECRET_KEY=sk_live_sua_chave_secreta_aqui

STRIPE_MODE=live

STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook_aqui

GOOGLE_ANALYTICS_ID=G-E0Z97STDKV

OPENAI_API_KEY=sk-sua_chave_openai_aqui
```

#### **3.3 Deploy Automático:**
- O Render detectará as mudanças e fará deploy automaticamente
- Aguarde o build completar

### **4. 🔧 Configuração do Webhook (Opcional)**

#### **4.1 No Dashboard do Stripe:**
1. Vá em **Developers > Webhooks**
2. Clique em **Add endpoint**
3. URL: `https://estampai-unified.onrender.com/api/stripe-webhook`
4. Eventos: `checkout.session.completed`

#### **4.2 Copiar Webhook Secret:**
- Copie o `whsec_...` e adicione nas variáveis de ambiente

### **5. ✅ Verificação**

#### **5.1 Logs Esperados:**
```
🚀 Servidor rodando na porta 3000
🔑 Modo Stripe: live
📊 Analytics: G-E0Z97STDKV
✅ Variáveis de ambiente carregadas do backend
🔑 Chaves do Stripe carregadas: live
💳 Processando pagamento real via Stripe
```

#### **5.2 Teste de Pagamento:**
1. Acesse o site
2. Clique em "Comprar Agora"
3. Deve redirecionar para Stripe Checkout
4. Use cartão de teste: `4242 4242 4242 4242`

---

## **🔒 Segurança**

### **✅ O que está seguro:**
- ✅ Chaves em variáveis de ambiente
- ✅ `.env` no `.gitignore`
- ✅ Chave secreta apenas no backend
- ✅ Chave pública via endpoint seguro

### **❌ O que NÃO fazer:**
- ❌ Commitar `.env` no Git
- ❌ Expor chave secreta no frontend
- ❌ Hardcodar chaves no código
- ❌ Usar chaves de teste em produção

---

## **🚨 Troubleshooting**

### **Problema: "Chaves não disponíveis"**
- **Solução:** Verificar se as variáveis estão configuradas no Render

### **Problema: "Erro ao criar sessão"**
- **Solução:** Verificar se a chave secreta está correta

### **Problema: "Stripe.js não carregado"**
- **Solução:** Verificar se a chave pública está correta

---

**🎯 Após configurar, o sistema estará pronto para pagamentos reais!** 🚀

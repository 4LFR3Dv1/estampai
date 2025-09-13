# 🚀 **Backend Real para Stripe - EstampAI**

## **📋 Visão Geral**

Este backend Node.js/Express implementa um sistema real de pagamentos com Stripe para o EstampAI, substituindo o sistema de simulação anterior.

## **🏗️ Arquitetura**

```
Frontend (HTML/JS) → Backend Node.js → Stripe API
```

### **Arquivos Principais:**
- `server.js` - Servidor Express principal
- `package.json` - Dependências Node.js
- `stripe-api.js` - Cliente frontend para API
- `render.yaml` - Configuração de deploy

## **🔧 Funcionalidades**

### **1. Criação de Sessões de Checkout**
```javascript
POST /api/create-checkout-session
{
  "planType": "daily_unlimited" | "premium",
  "amount": 990 | 2990,
  "currency": "BRL",
  "successUrl": "https://estampai.onrender.com/chat.html?payment=success",
  "cancelUrl": "https://estampai.onrender.com/chat.html?payment=cancelled"
}
```

### **2. Verificação de Status**
```javascript
GET /api/payment-status/:sessionId
```

### **3. Webhook do Stripe**
```javascript
POST /api/stripe-webhook
```

## **🔑 Variáveis de Ambiente**

Configure no Render.com:

```bash
STRIPE_SECRET_KEY=sk_live_PLACEHOLDER

STRIPE_PUBLISHABLE_KEY=pk_live_PLACEHOLDER

STRIPE_MODE=live

STRIPE_WEBHOOK_SECRET=whsec_PLACEHOLDER

GOOGLE_ANALYTICS_ID=G-E0Z97STDKV
```

## **🚀 Deploy no Render.com**

### **1. Configuração do Serviço:**
- **Tipo:** Web Service
- **Environment:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### **2. Variáveis de Ambiente:**
Configure todas as variáveis listadas acima no dashboard do Render.

### **3. Webhook do Stripe:**
Configure o webhook no dashboard do Stripe:
- **URL:** `https://estampai-backend.onrender.com/api/stripe-webhook`
- **Eventos:** `checkout.session.completed`

## **💳 Fluxo de Pagamento**

1. **Usuário clica** em "Comprar Agora"
2. **Frontend chama** `/api/create-checkout-session`
3. **Backend cria** sessão no Stripe
4. **Stripe retorna** URL de checkout
5. **Usuário é redirecionado** para Stripe
6. **Usuário paga** no Stripe
7. **Stripe envia webhook** para backend
8. **Backend processa** pagamento
9. **Stripe redireciona** para success/cancel

## **🔒 Segurança**

- ✅ Chaves secretas em variáveis de ambiente
- ✅ Validação de webhook com assinatura
- ✅ CORS configurado
- ✅ Validação de dados de entrada
- ✅ Tratamento de erros

## **📊 Logs e Monitoramento**

O backend gera logs detalhados:
- ✅ Criação de sessões
- ✅ Processamento de webhooks
- ✅ Erros e exceções
- ✅ Status de pagamentos

## **🧪 Teste Local**

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
export STRIPE_SECRET_KEY="sk_test_..."
export STRIPE_MODE="test"

# Executar servidor
npm start
```

## **🎯 Próximos Passos**

1. **Deploy do backend** no Render.com
2. **Configurar variáveis** de ambiente
3. **Configurar webhook** no Stripe
4. **Testar pagamentos** reais
5. **Monitorar logs** e métricas

---

**✅ Backend Real Implementado - Sem Mais Simulação!** 🚀

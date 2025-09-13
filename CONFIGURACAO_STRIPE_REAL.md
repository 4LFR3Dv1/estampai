# 🔧 **Configuração da Conta Real do Stripe**

## 🚀 **Passo a Passo Completo**

### **1. 📋 Obter Chaves do Stripe**

#### **1.1 Acesse o Dashboard:**
1. **Faça login** em [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Vá para** "Developers" → "API keys"
3. **Copie** as chaves necessárias

#### **1.2 Chaves que você precisa:**
- **Publishable key** (pk_live_... ou pk_test_...)
- **Secret key** (sk_live_... ou sk_test_...)
- **Webhook endpoint secret** (whsec_...)

---

### **2. 🔑 Configurar Chaves no EstampAI**

#### **2.1 Edite o arquivo `stripe-keys.js`:**
```javascript
const STRIPE_KEYS = {
    // SUA CHAVE PÚBLICA AQUI
    publishableKey: 'pk_live_51...', // ou pk_test_51...
    
    // SUA CHAVE SECRETA AQUI
    secretKey: 'sk_live_51...', // ou sk_test_51...
    
    // SEU WEBHOOK SECRET AQUI
    webhookSecret: 'whsec_...',
    
    // Modo (test ou live)
    mode: 'live' // 'test' para desenvolvimento, 'live' para produção
};
```

#### **2.2 Exemplo com chaves reais:**
```javascript
const STRIPE_KEYS = {
    publishableKey: 'pk_live_51N8...',
    secretKey: 'sk_live_51N8...',
    webhookSecret: 'whsec_1234567890abcdef...',
    mode: 'live'
};
```

---

### **3. 🌐 Configurar Webhooks**

#### **3.1 Criar Webhook no Stripe:**
1. **Vá para** "Developers" → "Webhooks"
2. **Clique** "Add endpoint"
3. **URL do endpoint**: `https://seudominio.com/api/webhook/stripe`
4. **Eventos para escutar**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `invoice.payment_succeeded`

#### **3.2 Copiar Secret do Webhook:**
1. **Clique** no webhook criado
2. **Copie** o "Signing secret" (whsec_...)
3. **Cole** no arquivo `stripe-keys.js`

---

### **4. 💰 Configurar Produtos e Preços**

#### **4.1 Criar Produtos no Stripe:**
1. **Vá para** "Products" → "Add product"
2. **Crie** os produtos:
   - **Nome**: "Dia Ilimitado - EstampAI"
   - **Preço**: R$ 9,90 (R$ 0,99)
   - **Moeda**: BRL
   - **Tipo**: One-time

   - **Nome**: "Premium - EstampAI"
   - **Preço**: R$ 29,90 (R$ 2,99)
   - **Moeda**: BRL
   - **Tipo**: One-time

#### **4.2 Obter IDs dos Preços:**
1. **Clique** em cada produto
2. **Copie** o "Price ID" (price_...)
3. **Atualize** o `stripe-config.js`:

```javascript
prices: {
    dailyUnlimited: {
        priceId: 'price_1234567890', // ID real do Stripe
        amount: 990,
        currency: 'brl'
    },
    premium: {
        priceId: 'price_0987654321', // ID real do Stripe
        amount: 2990,
        currency: 'brl'
    }
}
```

---

### **5. 🔧 Configurar Backend (Futuro)**

#### **5.1 Endpoint para Criar Sessão:**
```javascript
// POST /api/create-checkout-session
app.post('/api/create-checkout-session', async (req, res) => {
    const { planType, successUrl, cancelUrl } = req.body;
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price: STRIPE_CONFIG.prices[planType].priceId,
            quantity: 1,
        }],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
            planType: planType,
            userId: req.user.id
        }
    });
    
    res.json({ id: session.id });
});
```

#### **5.2 Webhook para Confirmar Pagamento:**
```javascript
// POST /api/webhook/stripe
app.post('/api/webhook/stripe', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_CONFIG.webhookSecret);
    } catch (err) {
        return res.status(400).send(`Webhook signature verification failed.`);
    }
    
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Ativar plano do usuário
        activateUserPlan(session.metadata.userId, session.metadata.planType);
    }
    
    res.json({received: true});
});
```

---

### **6. 🧪 Testar Configuração**

#### **6.1 Modo Teste:**
1. **Use chaves de teste** (pk_test_...)
2. **Teste com cartões** de teste do Stripe
3. **Verifique** se os webhooks funcionam

#### **6.2 Modo Produção:**
1. **Use chaves reais** (pk_live_...)
2. **Teste com cartões** reais
3. **Monitore** os logs de webhook

---

### **7. 🔒 Segurança**

#### **7.1 Proteger Chaves:**
- ✅ **NUNCA** commite `stripe-keys.js` no Git
- ✅ **Use** variáveis de ambiente em produção
- ✅ **Rotacione** chaves regularmente
- ✅ **Monitore** uso das chaves

#### **7.2 Validação de Webhook:**
- ✅ **Sempre** valide assinatura do webhook
- ✅ **Use** HTTPS em produção
- ✅ **Logue** todas as transações
- ✅ **Implemente** retry para falhas

---

### **8. 📊 Monitoramento**

#### **8.1 Dashboard do Stripe:**
- **Transações** em tempo real
- **Logs** de webhook
- **Métricas** de conversão
- **Relatórios** de receita

#### **8.2 Logs do EstampAI:**
- **Pagamentos** confirmados
- **Planos** ativados
- **Erros** de webhook
- **Métricas** de uso

---

## 🎯 **Checklist de Configuração**

- [ ] **Chaves do Stripe** configuradas
- [ ] **Webhook** criado e configurado
- [ ] **Produtos** criados no Stripe
- [ ] **IDs de preço** atualizados
- [ ] **Backend** implementado (futuro)
- [ ] **Testes** realizados
- [ ] **Monitoramento** ativo

---

## 🚀 **Próximos Passos**

1. **Configure** as chaves reais
2. **Teste** o sistema
3. **Implemente** backend real
4. **Monitore** transações
5. **Otimize** conversão

**Sua conta Stripe está pronta para receber pagamentos reais!** 💰✨

# 🔧 Configurar Webhook do Stripe

## **1. ✅ Acesse o Dashboard do Stripe:**
1. Vá para [dashboard.stripe.com](https://dashboard.stripe.com)
2. Faça login na sua conta
3. Vá em **Developers > Webhooks**

## **2. ✅ Crie um Novo Webhook:**
1. Clique em **"Add endpoint"**
2. **URL do endpoint:** `https://seu-dominio.com/webhook`
3. **Eventos para escutar:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `invoice.paid`

## **3. ✅ Configure as Variáveis de Ambiente:**
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## **4. ✅ Deploy do Webhook Server:**
- **Render:** Crie um novo serviço Node.js
- **Vercel:** Use serverless functions
- **Railway:** Deploy direto do repositório

## **5. ✅ Teste o Webhook:**
1. Faça um pagamento de teste
2. Verifique os logs do servidor
3. Confirme que o evento foi recebido

## **6. ✅ Integração com Frontend:**
- Payment Links funcionam independentemente
- Webhook atualiza status do usuário
- Frontend verifica status via API ou localStorage

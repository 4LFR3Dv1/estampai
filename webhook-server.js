const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

// Middleware
app.use(express.raw({ type: 'application/json' }));

// Webhook endpoint
app.post('/webhook', (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('✅ Pagamento confirmado:', session.id);
            
            // Aqui você pode:
            // 1. Salvar no banco de dados
            // 2. Enviar email de confirmação
            // 3. Ativar plano do usuário
            // 4. Notificar sistema de CRM
            
            handleSuccessfulPayment(session);
            break;
            
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('✅ PaymentIntent confirmado:', paymentIntent.id);
            break;
            
        default:
            console.log(`Evento não tratado: ${event.type}`);
    }

    res.json({ received: true });
});

function handleSuccessfulPayment(session) {
    // Extrair informações do pagamento
    const customerEmail = session.customer_details?.email;
    const amount = session.amount_total;
    const currency = session.currency;
    
    console.log('📧 Email do cliente:', customerEmail);
    console.log('💰 Valor pago:', amount / 100, currency.toUpperCase());
    
    // Determinar tipo de plano baseado no valor
    let planType = 'unknown';
    if (amount === 990) { // R$ 9,90
        planType = 'daily_unlimited';
    } else if (amount === 2990) { // R$ 29,90
        planType = 'premium';
    }
    
    console.log('📋 Plano ativado:', planType);
    
    // Aqui você pode:
    // 1. Salvar no banco de dados
    // 2. Enviar email de confirmação
    // 3. Ativar plano no seu sistema
    // 4. Notificar o usuário
    
    // Exemplo de notificação por email (usando serviço como SendGrid, Mailgun, etc.)
    // sendConfirmationEmail(customerEmail, planType);
    
    // Exemplo de salvar no banco de dados
    // saveUserPlan(customerEmail, planType, session.id);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Webhook server rodando na porta ${PORT}`);
});

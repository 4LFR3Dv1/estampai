const express = require('express');
const cors = require('cors');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Rota para criar sessão de checkout
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        console.log('🔑 Criando sessão de checkout:', req.body);
        
        const { planType, amount, currency, successUrl, cancelUrl } = req.body;
        
        // Validar dados
        if (!planType || !amount || !currency) {
            return res.status(400).json({ error: 'Dados obrigatórios não fornecidos' });
        }
        
        // Criar sessão de checkout no Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name: planType === 'daily_unlimited' ? 'Dia Ilimitado - EstampAI' : 'Premium - EstampAI',
                            description: planType === 'daily_unlimited' 
                                ? 'Acesso ilimitado por 24 horas' 
                                : 'Acesso premium mensal',
                        },
                        unit_amount: amount, // em centavos
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                planType: planType,
                userId: req.body.userId || 'anonymous'
            }
        });
        
        console.log('✅ Sessão criada:', session.id);
        
        res.json({
            id: session.id,
            url: session.url,
            planType: planType,
            amount: amount,
            currency: currency
        });
        
    } catch (error) {
        console.error('❌ Erro ao criar sessão:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            details: error.message 
        });
    }
});

// Rota para verificar status do pagamento
app.get('/api/payment-status/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        res.json({
            id: session.id,
            status: session.payment_status,
            planType: session.metadata?.planType,
            amount: session.amount_total
        });
        
    } catch (error) {
        console.error('❌ Erro ao verificar status:', error);
        res.status(500).json({ 
            error: 'Erro ao verificar status do pagamento',
            details: error.message 
        });
    }
});

// Rota para webhook do Stripe
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('❌ Erro no webhook:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Processar evento
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('✅ Pagamento confirmado:', session.id);
        
        // Aqui você pode:
        // 1. Ativar o plano do usuário
        // 2. Enviar email de confirmação
        // 3. Atualizar banco de dados
        // 4. Enviar notificação
        
        // Por enquanto, apenas log
        console.log('🎯 Plano ativado:', session.metadata?.planType);
    }
    
    res.json({received: true});
});

// Rota para servir variáveis de ambiente (apenas chave pública)
app.get('/api/env-vars', (req, res) => {
    res.json({
        STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
        STRIPE_MODE: process.env.STRIPE_MODE
    });
});

// Servir arquivos estáticos
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🔑 Modo Stripe: ${process.env.STRIPE_MODE || 'test'}`);
    console.log(`📊 Analytics: ${process.env.GOOGLE_ANALYTICS_ID || 'não configurado'}`);
});

// Simulador de Backend para Stripe
// Este arquivo simula um backend real que criaria sessões de checkout

class StripeBackendSimulator {
    constructor() {
        this.sessions = new Map();
        this.products = {
            'daily_unlimited': {
                id: 'prod_daily_unlimited',
                name: 'Dia Ilimitado - EstampAI',
                price: 990, // R$ 9,90 em centavos
                currency: 'brl'
            },
            'premium': {
                id: 'prod_premium',
                name: 'Premium - EstampAI',
                price: 2990, // R$ 29,90 em centavos
                currency: 'brl'
            }
        };
    }
    
    // Simula criação de sessão de checkout
    async createCheckoutSession(data) {
        console.log('[Backend Simulator] Criando sessão de checkout:', data);
        
        const { planType, successUrl, cancelUrl } = data;
        const product = this.products[planType];
        
        if (!product) {
            throw new Error(`Plano não encontrado: ${planType}`);
        }
        
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Cria sessão simulada
        const sessionId = `cs_sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const session = {
            id: sessionId,
            url: `https://checkout.stripe.com/pay/${sessionId}`,
            success_url: successUrl,
            cancel_url: cancelUrl,
            amount_total: product.price,
            currency: product.currency,
            payment_status: 'unpaid',
            planType: planType,
            created: Date.now()
        };
        
        // Armazena sessão
        this.sessions.set(sessionId, session);
        
        console.log('[Backend Simulator] Sessão criada:', session);
        return session;
    }
    
    // Simula confirmação de pagamento
    async confirmPayment(sessionId) {
        console.log('[Backend Simulator] Confirmando pagamento:', sessionId);
        
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error(`Sessão não encontrada: ${sessionId}`);
        }
        
        // Simula delay de processamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Marca como pago
        session.payment_status = 'paid';
        session.paid_at = Date.now();
        
        console.log('[Backend Simulator] Pagamento confirmado:', session);
        return session;
    }
    
    // Simula webhook do Stripe
    async handleWebhook(eventType, data) {
        console.log('[Backend Simulator] Webhook recebido:', eventType, data);
        
        if (eventType === 'checkout.session.completed') {
            const sessionId = data.id;
            return await this.confirmPayment(sessionId);
        }
        
        return { success: true };
    }
}

// Instância global do simulador
window.stripeBackendSimulator = new StripeBackendSimulator();

// Interceptar chamadas fetch para simular backend
const originalFetch = window.fetch;
window.fetch = async function(url, options) {
    // Interceptar chamadas para /api/create-checkout-session
    if (url === '/api/create-checkout-session' && options?.method === 'POST') {
        console.log('[Fetch Interceptor] Interceptando chamada para criar sessão de checkout');
        
        const data = JSON.parse(options.body);
        const session = await window.stripeBackendSimulator.createCheckoutSession(data);
        
        return new Response(JSON.stringify(session), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // Interceptar chamadas para /api/confirm-payment
    if (url === '/api/confirm-payment' && options?.method === 'POST') {
        console.log('[Fetch Interceptor] Interceptando chamada para confirmar pagamento');
        
        const data = JSON.parse(options.body);
        const result = await window.stripeBackendSimulator.confirmPayment(data.sessionId);
        
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // Para outras chamadas, usar fetch original
    return originalFetch(url, options);
};

console.log('🔧 Backend Simulator do Stripe carregado');

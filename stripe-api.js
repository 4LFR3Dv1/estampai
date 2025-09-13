// API Simulada do Stripe para desenvolvimento
// Em produção, isso seria um backend real

class StripeAPI {
    constructor() {
        this.baseUrl = '/api'; // Em produção seria uma URL real
    }
    
    // Cria sessão de checkout (real ou simulada)
    async createCheckoutSession(planType, successUrl, cancelUrl) {
        console.log(`Criando sessão de checkout para: ${planType}`);
        
        // Verificar se temos chaves reais do Stripe
        if (window.STRIPE_KEYS && window.STRIPE_KEYS.mode === 'live' && window.STRIPE_KEYS.publishableKey.startsWith('pk_live_')) {
            return await this.createRealCheckoutSession(planType, successUrl, cancelUrl);
        } else {
            return await this.createSimulatedCheckoutSession(planType, successUrl, cancelUrl);
        }
    }
    
    // Cria sessão real do Stripe via backend
    async createRealCheckoutSession(planType, successUrl, cancelUrl) {
        console.log(`[Stripe Real] Criando sessão real para ${planType}`);
        
        const amount = this.getPlanAmount(planType);
        
        try {
            // Criar sessão real via backend Node.js
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planType: planType,
                    amount: amount,
                    currency: 'BRL',
                    successUrl: successUrl,
                    cancelUrl: cancelUrl
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            const session = await response.json();
            console.log('✅ Sessão real criada via backend:', session);
            return session;
            
        } catch (error) {
            console.error('❌ Erro ao criar sessão real:', error);
            throw error; // Não fazer fallback para simulação
        }
    }
    
    // Cria sessão simulada
    async createSimulatedCheckoutSession(planType, successUrl, cancelUrl) {
        console.log(`[Stripe Simulado] Criando sessão simulada para ${planType}`);
        
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Retorna sessão simulada
        return {
            id: `cs_simulated_${Date.now()}`,
            url: successUrl, // Em simulação, redireciona direto para sucesso
            planType: planType,
            amount: this.getPlanAmount(planType),
            currency: 'brl'
        };
    }
    
    // Simula confirmação de pagamento
    async confirmPayment(sessionId) {
        console.log(`Confirmando pagamento para sessão: ${sessionId}`);
        
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simula sucesso do pagamento
        return {
            success: true,
            sessionId: sessionId,
            planType: this.extractPlanFromSession(sessionId),
            timestamp: new Date().toISOString()
        };
    }
    
    // Obtém valor do plano
    getPlanAmount(planType) {
        const prices = {
            'daily_unlimited': 990, // R$ 9,90
            'premium': 2990 // R$ 29,90
        };
        return prices[planType] || 0;
    }
    
    // Extrai tipo de plano da sessão (simulado)
    extractPlanFromSession(sessionId) {
        // Em produção, isso viria do Stripe
        return 'daily_unlimited'; // Simulação
    }
    
    // Simula webhook do Stripe
    async handleWebhook(payload, signature) {
        console.log('Processando webhook do Stripe:', payload);
        
        // Simula processamento do webhook
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return {
            success: true,
            processed: true
        };
    }
}

// Instância global da API
window.stripeAPI = new StripeAPI();

// Função para simular endpoint de criação de sessão
window.createCheckoutSession = async function(planType, successUrl, cancelUrl) {
    return await window.stripeAPI.createCheckoutSession(planType, successUrl, cancelUrl);
};

// Função para simular endpoint de confirmação
window.confirmPayment = async function(sessionId) {
    return await window.stripeAPI.confirmPayment(sessionId);
};

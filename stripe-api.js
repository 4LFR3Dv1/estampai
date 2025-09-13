// API Simulada do Stripe para desenvolvimento
// Em produção, isso seria um backend real

class StripeAPI {
    constructor() {
        this.baseUrl = '/api'; // Em produção seria uma URL real
    }
    
    // Simula criação de sessão de checkout
    async createCheckoutSession(planType, successUrl, cancelUrl) {
        console.log(`Criando sessão de checkout para: ${planType}`);
        
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Retorna sessão simulada
        return {
            id: `cs_test_${Date.now()}`,
            url: successUrl, // Em produção seria a URL do Stripe
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

// Sistema de validação de pagamentos para site estático
class PaymentValidator {
    constructor() {
        this.paymentStatus = this.loadPaymentStatus();
    }
    
    // Carrega status de pagamento do localStorage
    loadPaymentStatus() {
        const saved = localStorage.getItem('estampai_payment_status');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Erro ao carregar status de pagamento:', e);
            }
        }
        return {
            planType: 'free',
            expiresAt: null,
            paymentId: null,
            lastCheck: null
        };
    }
    
    // Salva status de pagamento no localStorage
    savePaymentStatus(status) {
        this.paymentStatus = status;
        localStorage.setItem('estampai_payment_status', JSON.stringify(status));
    }
    
    // Verifica se o usuário tem plano ativo
    hasActivePlan() {
        if (this.paymentStatus.planType === 'free') {
            return false;
        }
        
        if (this.paymentStatus.expiresAt) {
            const now = new Date();
            const expires = new Date(this.paymentStatus.expiresAt);
            return now < expires;
        }
        
        return true; // Plano sem expiração (premium)
    }
    
    // Ativa plano após pagamento confirmado
    activatePlan(planType, paymentId) {
        const now = new Date();
        let expiresAt = null;
        
        if (planType === 'daily_unlimited') {
            // 24 horas
            expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        } else if (planType === 'premium') {
            // 30 dias
            expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        }
        
        this.savePaymentStatus({
            planType,
            expiresAt: expiresAt?.toISOString(),
            paymentId,
            lastCheck: now.toISOString()
        });
        
        console.log(`✅ Plano ${planType} ativado até ${expiresAt}`);
        
        // Notificar outros componentes
        this.notifyPlanActivated(planType);
    }
    
    // Notifica que o plano foi ativado
    notifyPlanActivated(planType) {
        // Disparar evento customizado
        const event = new CustomEvent('planActivated', {
            detail: { planType }
        });
        window.dispatchEvent(event);
        
        // Atualizar interface
        if (window.authManager) {
            window.authManager.usageData.planType = planType;
            window.authManager.updateUsageDisplay();
            window.authManager.updateHeader();
        }
    }
    
    // Verifica status via URL (para casos de sucesso)
    checkPaymentFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const payment = urlParams.get('payment');
        const sessionId = urlParams.get('session_id');
        
        if (payment === 'success' && sessionId) {
            // Simular ativação do plano (em produção, isso viria do webhook)
            this.simulatePaymentConfirmation(sessionId);
        }
    }
    
    // Simula confirmação de pagamento (remover em produção)
    simulatePaymentConfirmation(sessionId) {
        console.log('🎉 Pagamento confirmado via URL:', sessionId);
        
        // Determinar tipo de plano baseado na URL ou sessionId
        // Em produção, isso viria do webhook
        const planType = this.detectPlanTypeFromSession(sessionId);
        
        if (planType) {
            this.activatePlan(planType, sessionId);
            
            // Limpar URL
            const url = new URL(window.location);
            url.searchParams.delete('payment');
            url.searchParams.delete('session_id');
            window.history.replaceState({}, '', url);
        }
    }
    
    // Detecta tipo de plano baseado na sessão (simulação)
    detectPlanTypeFromSession(sessionId) {
        // Verificar parâmetros da URL
        const urlParams = new URLSearchParams(window.location.search);
        const plan = urlParams.get('plan');
        
        if (plan === 'daily_unlimited') {
            return 'daily_unlimited';
        }
        
        if (plan === 'premium') {
            return 'premium';
        }
        
        // Verificar se veio do link de dia ilimitado
        if (document.referrer.includes('bJefZgaji3F0g4J7EG2Nq01')) {
            return 'daily_unlimited';
        }
        
        // Verificar se veio do link premium
        if (document.referrer.includes('cNiaEW8baa3o19Pgbc2Nq02')) {
            return 'premium';
        }
        
        // Fallback: perguntar ao usuário
        return this.askUserForPlanType();
    }
    
    // Pergunta ao usuário qual plano foi comprado
    askUserForPlanType() {
        const planType = prompt(
            'Pagamento confirmado! Qual plano você comprou?\n\n' +
            '1 - Dia Ilimitado (R$ 9,90)\n' +
            '2 - Premium (R$ 29,90)\n\n' +
            'Digite 1 ou 2:'
        );
        
        if (planType === '1') return 'daily_unlimited';
        if (planType === '2') return 'premium';
        
        return null;
    }
    
    // Verifica se pode gerar estampa
    canGenerateStamp() {
        if (!this.hasActivePlan()) {
            return {
                canGenerate: false,
                reason: 'Plano expirado ou não ativo'
            };
        }
        
        return {
            canGenerate: true
        };
    }
    
    // Obtém informações do plano atual
    getPlanInfo() {
        return {
            planType: this.paymentStatus.planType,
            expiresAt: this.paymentStatus.expiresAt,
            isActive: this.hasActivePlan(),
            paymentId: this.paymentStatus.paymentId
        };
    }
}

// Instanciar globalmente
window.paymentValidator = new PaymentValidator();

// Verificar pagamento ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    window.paymentValidator.checkPaymentFromURL();
});

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentValidator;
}

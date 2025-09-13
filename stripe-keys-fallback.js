// 🔑 CONFIGURAÇÃO FALLBACK DO STRIPE
// ⚠️ Este arquivo é usado quando stripe-keys.js não está disponível

// Chaves de fallback (modo teste)
const STRIPE_KEYS = {
    // Chave pública de teste
    publishableKey: 'pk_test_fallback_key',
    
    // Chave secreta de teste
    secretKey: 'sk_test_fallback_key',
    
    // Secret do webhook de teste
    webhookSecret: 'whsec_fallback',
    
    // Modo teste
    mode: 'test'
};

// Exportar para uso global
window.STRIPE_KEYS = STRIPE_KEYS;

// Log de segurança
console.log('🔑 Chaves de fallback do Stripe carregadas:', STRIPE_KEYS.mode);

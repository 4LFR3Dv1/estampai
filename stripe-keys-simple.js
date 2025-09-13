// 🔑 CONFIGURAÇÃO SIMPLES DAS CHAVES DO STRIPE
// Usa variáveis de ambiente do Render.com

console.log('🔑 Carregando chaves do Stripe...');

// Função para obter variáveis de ambiente
function getEnvVar(key, defaultValue = null) {
    // Em produção, isso viria do backend
    // Por enquanto, vamos usar valores padrão que serão substituídos pelas variáveis de ambiente
    const envVars = {
        'STRIPE_PUBLISHABLE_KEY': 'pk_live_PLACEHOLDER',
        'STRIPE_SECRET_KEY': 'sk_live_PLACEHOLDER',
        'STRIPE_MODE': 'live'
    };
    
    return envVars[key] || defaultValue;
}

// Chaves do Stripe
const STRIPE_KEYS = {
    publishableKey: getEnvVar('STRIPE_PUBLISHABLE_KEY'),
    secretKey: getEnvVar('STRIPE_SECRET_KEY'),
    mode: getEnvVar('STRIPE_MODE')
};

// Exportar para uso global
window.STRIPE_KEYS = STRIPE_KEYS;

// Log de segurança
console.log('🔑 Chaves do Stripe carregadas:', STRIPE_KEYS.mode);
console.log('🔑 Chave pública:', STRIPE_KEYS.publishableKey);

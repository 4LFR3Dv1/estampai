// 🔑 CONFIGURAÇÃO SIMPLES DAS CHAVES DO STRIPE
// Usa variáveis de ambiente do Render.com

console.log('🔑 Carregando chaves do Stripe...');

// Função para obter variáveis de ambiente
function getEnvVar(key, defaultValue = null) {
    // Em produção, isso viria do backend via API
    // Por enquanto, vamos usar valores padrão que serão substituídos pelas variáveis de ambiente
    const envVars = {
        'STRIPE_PUBLISHABLE_KEY': 'pk_live_PLACEHOLDER',
        'STRIPE_SECRET_KEY': 'sk_live_PLACEHOLDER',
        'STRIPE_MODE': 'live'
    };
    
    // Tentar obter do window (se injetado pelo backend)
    if (window.ENV_VARS && window.ENV_VARS[key]) {
        return window.ENV_VARS[key];
    }
    
    return envVars[key] || defaultValue;
}

// Função para carregar variáveis de ambiente do backend
async function loadEnvVars() {
    try {
        const response = await fetch('/api/env-vars');
        if (response.ok) {
            const envVars = await response.json();
            window.ENV_VARS = envVars;
            console.log('✅ Variáveis de ambiente carregadas do backend:', envVars);
        }
    } catch (error) {
        console.log('⚠️ Não foi possível carregar variáveis do backend:', error);
    }
}

// Função principal para inicializar
async function initializeStripeKeys() {
    // Carregar variáveis de ambiente
    await loadEnvVars();

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
}

// Inicializar
initializeStripeKeys();

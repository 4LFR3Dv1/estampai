// Configuração do Stripe
const STRIPE_CONFIG = {
    // Chaves de API (modo teste)
    publishableKey: 'pk_test_51...', // Substituir pela chave real
    secretKey: 'sk_test_51...', // Substituir pela chave real
    
    // URLs de webhook
    webhookSecret: 'whsec_...', // Substituir pelo secret real
    
    // Configurações de preços
    prices: {
        dailyUnlimited: {
            amount: 990, // R$ 9,90 em centavos
            currency: 'brl',
            productName: 'Dia Ilimitado - EstampAI'
        },
        premium: {
            amount: 2990, // R$ 29,90 em centavos
            currency: 'brl',
            productName: 'Premium - EstampAI'
        }
    },
    
    // Configurações de checkout
    checkout: {
        successUrl: (typeof window !== 'undefined' ? window.location.origin : '') + '/chat.html?payment=success',
        cancelUrl: (typeof window !== 'undefined' ? window.location.origin : '') + '/landing.html?payment=cancelled'
    }
};

// Função para inicializar o Stripe
async function initializeStripe() {
    if (typeof Stripe === 'undefined') {
        // Carrega o Stripe.js se não estiver carregado
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.onload = () => {
            window.stripe = Stripe(STRIPE_CONFIG.publishableKey);
        };
        document.head.appendChild(script);
    } else {
        window.stripe = Stripe(STRIPE_CONFIG.publishableKey);
    }
}

// Função para criar sessão de checkout
async function createCheckoutSession(planType) {
    try {
        // Usa API simulada para desenvolvimento
        if (window.stripeAPI) {
            return await window.stripeAPI.createCheckoutSession(
                planType, 
                STRIPE_CONFIG.checkout.successUrl, 
                STRIPE_CONFIG.checkout.cancelUrl
            );
        }
        
        // Fallback para API real (produção)
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                planType: planType,
                successUrl: STRIPE_CONFIG.checkout.successUrl,
                cancelUrl: STRIPE_CONFIG.checkout.cancelUrl
            })
        });
        
        const session = await response.json();
        return session;
    } catch (error) {
        console.error('Erro ao criar sessão de checkout:', error);
        throw error;
    }
}

// Função para redirecionar para checkout
async function redirectToCheckout(planType) {
    try {
        const session = await createCheckoutSession(planType);
        
        // Em desenvolvimento, usa simulação
        if (window.stripeAPI) {
            console.log('Usando API simulada para checkout');
            simulatePayment(planType);
            return;
        }
        
        // Em produção, usa Stripe real
        if (window.stripe) {
            const { error } = await window.stripe.redirectToCheckout({
                sessionId: session.id
            });
            
            if (error) {
                console.error('Erro no checkout:', error);
                throw error;
            }
        }
    } catch (error) {
        console.error('Erro ao redirecionar para checkout:', error);
        // Fallback para simulação local
        simulatePayment(planType);
    }
}

// Função de fallback para simulação local (desenvolvimento)
function simulatePayment(planType) {
    console.log(`Simulando pagamento para plano: ${planType}`);
    
    // Mostra loading
    showPaymentLoading(planType);
    
    // Simula processamento
    setTimeout(() => {
        if (window.authManager) {
            if (planType === 'daily_unlimited') {
                window.authManager.upgradeToDailyUnlimited();
            } else if (planType === 'premium') {
                window.authManager.upgradeToPremium();
            }
        }
        hidePaymentLoading();
    }, 2000);
}

// Função para mostrar loading de pagamento
function showPaymentLoading(planType) {
    const loadingHtml = `
        <div id="payment-loading" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        ">
            <div style="
                background: #1a1a1a;
                padding: 2rem;
                border-radius: 1rem;
                text-align: center;
                color: white;
                border: 1px solid #333;
            ">
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid #333;
                    border-top: 3px solid #4CAF50;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                "></div>
                <h3>Processando Pagamento...</h3>
                <p>Ativando ${planType === 'daily_unlimited' ? 'Dia Ilimitado' : 'Premium'}</p>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.insertAdjacentHTML('beforeend', loadingHtml);
}

// Função para esconder loading de pagamento
function hidePaymentLoading() {
    const loading = document.getElementById('payment-loading');
    if (loading) {
        loading.remove();
    }
}

// Exportar configurações
window.STRIPE_CONFIG = STRIPE_CONFIG;
window.initializeStripe = initializeStripe;
window.redirectToCheckout = redirectToCheckout;

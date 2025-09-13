// 📊 Eventos de Analytics Específicos do EstampAI

class EstampAIAnalytics {
    constructor() {
        this.sessionStart = Date.now();
        this.stampsGenerated = 0;
        this.chatMessages = 0;
        this.init();
    }
    
    init() {
        // Trackear início da sessão
        this.trackSessionStart();
        
        // Trackear visualizações de página
        this.trackPageView();
        
        // Trackear cliques em botões importantes
        this.trackButtonClicks();
        
        // Trackear formulários
        this.trackForms();
        
        // Trackear uso do chat
        this.trackChatUsage();
        
        // Trackear geração de estampas
        this.trackStampGeneration();
    }
    
    // ===== EVENTOS DE SESSÃO =====
    
    trackSessionStart() {
        trackEvent('session_start', {
            page_path: window.location.pathname,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`
        });
    }
    
    trackPageView() {
        trackEvent('page_view', {
            page_title: document.title,
            page_path: window.location.pathname,
            page_location: window.location.href
        });
    }
    
    // ===== EVENTOS DE AUTENTICAÇÃO =====
    
    trackLogin(email) {
        trackEvent('login', {
            method: 'email',
            user_id: email,
            event_category: 'authentication'
        });
    }
    
    trackRegister(email, plan = 'free') {
        trackEvent('register', {
            method: 'email',
            user_id: email,
            initial_plan: plan,
            event_category: 'authentication'
        });
    }
    
    trackLogout() {
        trackEvent('logout', {
            session_duration: this.getSessionDuration(),
            stamps_generated: this.stampsGenerated,
            chat_messages: this.chatMessages,
            event_category: 'authentication'
        });
    }
    
    // ===== EVENTOS DE CONVERSÃO =====
    
    trackUpgradeClick(planType, planPrice) {
        trackEvent('upgrade_click', {
            plan_type: planType,
            plan_price: planPrice,
            current_plan: window.authManager?.getPlanDisplayName() || 'free',
            event_category: 'conversion'
        });
    }
    
    trackPaymentStart(planType, planPrice) {
        trackEvent('payment_start', {
            plan_type: planType,
            plan_price: planPrice,
            payment_method: 'stripe',
            event_category: 'conversion'
        });
    }
    
    trackPaymentSuccess(planType, planPrice, transactionId) {
        trackConversion('purchase', planPrice, 'BRL');
        trackEvent('payment_success', {
            plan_type: planType,
            plan_price: planPrice,
            transaction_id: transactionId,
            event_category: 'conversion'
        });
    }
    
    trackPaymentFailed(planType, planPrice, error) {
        trackEvent('payment_failed', {
            plan_type: planType,
            plan_price: planPrice,
            error_message: error,
            event_category: 'conversion'
        });
    }
    
    // ===== EVENTOS DE USO =====
    
    trackStampGeneration(style, colors, prompt) {
        this.stampsGenerated++;
        trackUsage('stamp_generated', {
            style: style,
            colors: colors,
            prompt_length: prompt?.length || 0,
            total_stamps: this.stampsGenerated,
            user_plan: window.authManager?.getPlanDisplayName() || 'free'
        });
    }
    
    trackChatMessage(message, isUser = true) {
        if (isUser) {
            this.chatMessages++;
        }
        trackUsage('chat_message', {
            message_length: message.length,
            is_user: isUser,
            total_messages: this.chatMessages,
            user_plan: window.authManager?.getPlanDisplayName() || 'free'
        });
    }
    
    trackDownload(type = 'stamp') {
        trackUsage('download', {
            download_type: type,
            user_plan: window.authManager?.getPlanDisplayName() || 'free'
        });
    }
    
    // ===== EVENTOS DE NAVEGAÇÃO =====
    
    trackButtonClick(buttonName, location) {
        trackNavigation('button_click', {
            button_name: buttonName,
            button_location: location,
            page_path: window.location.pathname
        });
    }
    
    trackFormSubmit(formName, success = true) {
        trackNavigation('form_submit', {
            form_name: formName,
            success: success,
            page_path: window.location.pathname
        });
    }
    
    // ===== EVENTOS DE ERRO =====
    
    trackError(errorType, errorMessage, context = {}) {
        trackEvent('error', {
            error_type: errorType,
            error_message: errorMessage,
            context: JSON.stringify(context),
            page_path: window.location.pathname,
            event_category: 'error'
        });
    }
    
    // ===== UTILITÁRIOS =====
    
    getSessionDuration() {
        return Math.round((Date.now() - this.sessionStart) / 1000);
    }
    
    // ===== TRACKING AUTOMÁTICO =====
    
    trackButtonClicks() {
        // Trackear cliques em botões importantes
        document.addEventListener('click', (event) => {
            const button = event.target.closest('button, a');
            if (button) {
                const buttonText = button.textContent?.trim() || button.getAttribute('aria-label') || 'unknown';
                const buttonClass = button.className;
                
                // Trackear botões específicos
                if (buttonText.includes('Gerar') || buttonText.includes('Criar')) {
                    this.trackButtonClick('generate_stamp', 'chat');
                } else if (buttonText.includes('Download') || buttonText.includes('Baixar')) {
                    this.trackButtonClick('download', 'results');
                } else if (buttonText.includes('Login') || buttonText.includes('Entrar')) {
                    this.trackButtonClick('login', 'header');
                } else if (buttonText.includes('Registrar') || buttonText.includes('Cadastrar')) {
                    this.trackButtonClick('register', 'header');
                }
            }
        });
    }
    
    trackForms() {
        // Trackear submissão de formulários
        document.addEventListener('submit', (event) => {
            const form = event.target;
            const formName = form.id || form.className || 'unknown_form';
            
            // Verificar se o formulário foi submetido com sucesso
            setTimeout(() => {
                const hasError = form.querySelector('.error, .invalid');
                this.trackFormSubmit(formName, !hasError);
            }, 1000);
        });
    }
    
    trackChatUsage() {
        // Trackear uso do chat
        const chatInput = document.querySelector('#messageInput, input[type="text"]');
        if (chatInput) {
            chatInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    const message = event.target.value.trim();
                    if (message) {
                        this.trackChatMessage(message, true);
                    }
                }
            });
        }
    }
    
    trackStampGeneration() {
        // Trackear geração de estampas
        const originalProcessWithAI = window.processWithAI;
        if (originalProcessWithAI) {
            window.processWithAI = (...args) => {
                // Trackear antes da geração
                const [message] = args;
                this.trackChatMessage(message, true);
                
                // Chamar função original
                const result = originalProcessWithAI.apply(this, args);
                
                // Trackear após geração (assumindo sucesso)
                setTimeout(() => {
                    this.trackStampGeneration('unknown', 'unknown', message);
                }, 2000);
                
                return result;
            };
        }
    }
}

// Inicializar analytics quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.estampaiAnalytics = new EstampAIAnalytics();
});

// Exportar para uso global
window.EstampAIAnalytics = EstampAIAnalytics;

// 📊 Configuração do Google Analytics 4 - EstampAI
const ANALYTICS_CONFIG = {
    // ID de medição do GA4 (substituir pelo seu)
    measurementId: 'G-XXXXXXXXXX', // SEU ID DE MEDIÇÃO AQUI
    
    // Configurações de eventos
    events: {
        // Eventos de conversão
        login: 'login',
        register: 'register',
        upgrade_click: 'upgrade_click',
        payment_start: 'payment_start',
        payment_success: 'payment_success',
        payment_failed: 'payment_failed',
        
        // Eventos de uso
        stamp_generated: 'stamp_generated',
        chat_message: 'chat_message',
        download_stamp: 'download_stamp',
        
        // Eventos de navegação
        page_view: 'page_view',
        button_click: 'button_click',
        form_submit: 'form_submit'
    },
    
    // Parâmetros customizados
    customParameters: {
        user_plan: 'user_plan',
        stamps_count: 'stamps_count',
        session_duration: 'session_duration',
        page_path: 'page_path'
    },
    
    // Configurações de debug
    debug: false, // true para desenvolvimento
    enabled: true // false para desabilitar
};

// Função para inicializar o Google Analytics
function initializeAnalytics() {
    if (!ANALYTICS_CONFIG.enabled) {
        console.log('📊 Analytics desabilitado');
        return;
    }
    
    // Carrega o script do GA4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.measurementId}`;
    document.head.appendChild(script);
    
    // Configura o gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', ANALYTICS_CONFIG.measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: ANALYTICS_CONFIG.customParameters
    });
    
    console.log('📊 Google Analytics 4 inicializado');
}

// Função para enviar eventos
function trackEvent(eventName, parameters = {}) {
    if (!ANALYTICS_CONFIG.enabled || !window.gtag) {
        console.log('📊 Analytics não disponível');
        return;
    }
    
    // Adiciona timestamp
    parameters.timestamp = new Date().toISOString();
    
    // Adiciona informações do usuário se disponível
    if (window.authManager && window.authManager.isAuthenticated) {
        parameters.user_plan = window.authManager.getPlanDisplayName();
        parameters.stamps_count = window.authManager.usageData?.stampsGenerated || 0;
    }
    
    // Envia evento
    window.gtag('event', eventName, parameters);
    
    if (ANALYTICS_CONFIG.debug) {
        console.log('📊 Evento enviado:', eventName, parameters);
    }
}

// Função para trackear conversões
function trackConversion(eventName, value = 0, currency = 'BRL') {
    trackEvent(eventName, {
        value: value,
        currency: currency,
        event_category: 'conversion'
    });
}

// Função para trackear uso do sistema
function trackUsage(eventName, parameters = {}) {
    trackEvent(eventName, {
        ...parameters,
        event_category: 'usage'
    });
}

// Função para trackear navegação
function trackNavigation(eventName, parameters = {}) {
    trackEvent(eventName, {
        ...parameters,
        event_category: 'navigation'
    });
}

// Exportar funções
window.ANALYTICS_CONFIG = ANALYTICS_CONFIG;
window.initializeAnalytics = initializeAnalytics;
window.trackEvent = trackEvent;
window.trackConversion = trackConversion;
window.trackUsage = trackUsage;
window.trackNavigation = trackNavigation;

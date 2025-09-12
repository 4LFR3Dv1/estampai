/**
 * EstampAI - Arquivo de Configuração
 * Personalize facilmente as cores, estilos e URLs do sistema
 */

const ESTAMPAI_CONFIG = {
    // ===== CONFIGURAÇÕES GERAIS =====
    app: {
        name: "EstampAI",
        version: "1.0.0",
        author: "Renan Melo",
        description: "Sistema de co-criação de estampas com IA"
    },
    
    // ===== CONFIGURAÇÕES DE IA =====
    ai: {
        // Configuração da API da OpenAI (DALL-E 3)
        openai: {
            apiKey: 'YOUR_OPENAI_API_KEY_HERE', // ✅ Substitua pela sua API key
            model: 'dall-e-3',
            size: '1024x1024',
            quality: 'standard',
            style: 'natural',
            maxTokens: 1000
        },
        
        // Configuração para GPT-5 (Nova API)
        gpt5: {
            enabled: false, // Ativar quando GPT-5 estiver disponível
            model: 'gpt-5',
            useResponsesAPI: true // Usar nova API de responses
        },
        
        // Configuração para edição de imagens
        imageEdit: {
            enabled: true, // Ativar edição de imagens (PADRÃO)
            model: 'gpt-image-1',
            inputFidelity: 'high', // 'high' ou 'low'
            applyToAvatar: true, // Aplicar estampas diretamente no avatar
            autoApply: true // Aplicar automaticamente quando IA estiver disponível
        },
        
        // Configuração para streaming
        streaming: {
            enabled: false, // Ativar geração em tempo real
            model: 'gpt-4.1',
            partialImages: 3, // Número de imagens parciais
            showProgress: true // Mostrar progresso ao usuário
        },
        
        // Configurações de fallback
        fallback: {
            enabled: true, // Se true, usa sistema atual quando IA falha
            showMessage: true // Se true, mostra mensagem quando usa fallback
        },
        
        // Configurações de cache
        cache: {
            enabled: true, // Cache das imagens geradas
            maxSize: 50, // Máximo de imagens em cache
            ttl: 24 * 60 * 60 * 1000 // 24 horas em ms
        },
        
        // Respostas da IA
        responses: {
            greeting: "Olá! Sou a EstampAI, sua assistente para criação de estampas. Descreva o que você gostaria de criar e eu farei uma estampa única para você!",
            processing: "Entendi! Vou criar uma estampa baseada na sua descrição...",
            completed: "Pronto! Sua estampa foi criada com sucesso! Você pode visualizá-la no avatar acima e baixar quando quiser.",
            error: "Desculpe, não consegui processar sua solicitação. Pode tentar descrever de outra forma?"
        }
    },
    
    // ===== CONFIGURAÇÕES DO AVATAR =====
    avatar: {
        useRealImage: true, // Usar imagem real como avatar
        // OPÇÃO 1: Arquivo local (ATIVADO)
        imagePath: 'assets/images/AVATAR.png', // ✅ SUA IMAGEM LOCAL
        // OPÇÃO 2: URL externa (fallback)
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
        // OPÇÃO 3: Upload do usuário
        allowUserUpload: true, // Permitir upload do usuário
        fallbackToDrawn: true, // Usar avatar desenhado se imagem falhar
        stampPosition: {
            x: 200, // Posição X da estampa
            y: 250, // Posição Y da estampa
            width: 120, // Largura da estampa
            height: 120 // Altura da estampa
        }
    },
    
    // ===== CORES DO SISTEMA =====
    colors: {
        primary: {
            blue: "#1A237E",
            orange: "#FF9800",
            white: "#FFFFFF",
            cyan: "#4DD0E1"
        },
        secondary: {
            gray: "#F8F9FA",
            textDark: "#333333",
            textLight: "#666666",
            borderLight: "#E0E0E0"
        }
    },
    
    // ===== SISTEMA DE PONTUAÇÃO =====
    scoring: {
        styleSelection: 25,
        colorSelection: 25,
        creationComplete: 50,
        firstCreation: 100,
        multipleCreations: 25
    },
    
    // ===== BADGES E CONQUISTAS =====
    badges: {
        "Primeira Criação": {
            condition: (userData) => userData.totalCreations === 1,
            description: "Você criou sua primeira estampa!",
            icon: "🎉"
        },
        "Designer em Ascensão": {
            condition: (userData) => userData.totalCreations >= 3,
            description: "Você está se tornando um designer!",
            icon: "🎨"
        },
        "Mestre das Cores": {
            condition: (userData) => userData.colorVariety >= 3,
            description: "Você experimentou muitas paletas de cores!",
            icon: "🌈"
        },
        "Estilista Versátil": {
            condition: (userData) => userData.styleVariety >= 3,
            description: "Você domina diferentes estilos!",
            icon: "🎭"
        },
        "Criador Prolífico": {
            condition: (userData) => userData.totalCreations >= 5,
            description: "Você é um criador incansável!",
            icon: "⚡"
        },
        "Explorador": {
            condition: (userData) => userData.totalCreations >= 10,
            description: "Você explorou muitas possibilidades!",
            icon: "🚀"
        }
    },
    
    // ===== ESTILOS DE ESTAMPA =====
    styles: [
        {
            id: "geometrico",
            nome: "Geométrico",
            descricao: "Formas precisas e simétricas",
            emoji: "🔷",
            category: "geometric"
        },
        {
            id: "organico",
            nome: "Orgânico",
            descricao: "Formas fluidas e naturais",
            emoji: "🌿",
            category: "organic"
        },
        {
            id: "abstrato",
            nome: "Abstrato",
            descricao: "Arte não representacional",
            emoji: "🎨",
            category: "abstract"
        },
        {
            id: "figurativo",
            nome: "Figurativo",
            descricao: "Representações de objetos reais",
            emoji: "🖼️",
            category: "figurative"
        },
        {
            id: "religioso",
            nome: "Religioso",
            descricao: "Símbolos e elementos religiosos",
            emoji: "✝️",
            category: "religious"
        },
        {
            id: "simbolos",
            nome: "Símbolos",
            descricao: "Ícones e símbolos diversos",
            emoji: "🔣",
            category: "symbols"
        }
    ],
    
    // ===== PALETAS DE CORES =====
    colorPalettes: [
        {
            id: "azul-branco",
            nome: "Azul/Branco",
            descricao: "Profissional e confiável",
            emoji: "💙",
            colors: ["#1A237E", "#FFFFFF"],
            category: "professional"
        },
        {
            id: "preto-vermelho",
            nome: "Preto/Vermelho",
            descricao: "Ousado e impactante",
            emoji: "❤️",
            colors: ["#000000", "#FF0000"],
            category: "bold"
        },
        {
            id: "verde-amarelo",
            nome: "Verde/Amarelo",
            descricao: "Energético e vibrante",
            emoji: "💚",
            colors: ["#4CAF50", "#FFEB3B"],
            category: "energetic"
        },
        {
            id: "outro",
            nome: "Outro",
            descricao: "Paleta personalizada",
            emoji: "🌈",
            colors: ["#9C27B0", "#FF9800"],
            category: "custom"
        }
    ],
    
    // ===== URLS E INTEGRAÇÕES =====
    urls: {
        checkout: "https://seusite.com/ofertas",
        portfolio: "https://seusite.com/portfolio",
        instagram: "https://instagram.com/seuusuario",
        behance: "https://behance.net/seuusuario"
    },
    
    // ===== CONFIGURAÇÕES DE MOCKUP =====
    mockups: {
        // Substitua pelas suas URLs reais
        "Geométrico-Azul/Branco": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Geométrico+Azul/Branco",
        "Geométrico-Preto/Vermelho": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Geométrico+Preto/Vermelho",
        "Geométrico-Verde/Amarelo": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Geométrico+Verde/Amarelo",
        "Geométrico-Outro": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Geométrico+Outro",
        
        "Orgânico-Azul/Branco": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Orgânico+Azul/Branco",
        "Orgânico-Preto/Vermelho": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Orgânico+Preto/Vermelho",
        "Orgânico-Verde/Amarelo": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Orgânico+Verde/Amarelo",
        "Orgânico-Outro": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Orgânico+Outro",
        
        "Abstrato-Azul/Branco": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Abstrato+Azul/Branco",
        "Abstrato-Preto/Vermelho": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Abstrato+Preto/Vermelho",
        "Abstrato-Verde/Amarelo": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Abstrato+Verde/Amarelo",
        "Abstrato-Outro": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Abstrato+Outro",
        
        "Figurativo-Azul/Branco": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Figurativo+Azul/Branco",
        "Figurativo-Preto/Vermelho": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Figurativo+Preto/Vermelho",
        "Figurativo-Verde/Amarelo": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Figurativo+Verde/Amarelo",
        "Figurativo-Outro": "https://via.placeholder.com/400x500/FFFFFF/1A237E?text=Figurativo+Outro"
    },
    
    // ===== CONFIGURAÇÕES DE AVATAR =====
    avatar: {
        defaultView: "2d", // "2d", "3d", "mockup"
        enable3D: true,
        enable2D: true,
        enableMockup: true,
        autoUpdate: true
    },
    
    // ===== CONFIGURAÇÕES DE GAMIFICAÇÃO =====
    gamification: {
        enabled: true,
        showScore: true,
        showBadges: true,
        showHistory: true,
        enableExport: true,
        enableReset: true
    },
    
    // ===== CONFIGURAÇÕES DE ANALYTICS =====
    analytics: {
        enabled: false, // Mude para true para ativar
        googleAnalytics: {
            trackingId: "GA_TRACKING_ID", // Substitua pelo seu ID
            enabled: false
        },
        mixpanel: {
            token: "MIXPANEL_TOKEN", // Substitua pelo seu token
            enabled: false
        }
    },
    
    // ===== CONFIGURAÇÕES DE DESENVOLVIMENTO =====
    development: {
        debug: false,
        showConsoleLogs: true,
        enableHotReload: false,
        mockData: false
    },
    
    // ===== CONFIGURAÇÕES DE RESPONSIVIDADE =====
    responsive: {
        breakpoints: {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        },
        enableTouch: true,
        enableSwipe: true
    }
};

// ===== FUNÇÕES DE UTILIDADE =====
/**
 * Obtém uma configuração específica
 * @param {string} path - Caminho da configuração (ex: "colors.primary.blue")
 * @returns {any} Valor da configuração
 */
function getConfig(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], ESTAMPAI_CONFIG);
}

/**
 * Define uma configuração específica
 * @param {string} path - Caminho da configuração
 * @param {any} value - Novo valor
 */
function setConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, ESTAMPAI_CONFIG);
    target[lastKey] = value;
}

/**
 * Aplica as configurações ao sistema
 */
function applyConfig() {
    // Aplica cores CSS
    if (typeof document !== 'undefined') {
        const root = document.documentElement;
        const colors = ESTAMPAI_CONFIG.colors;
        
        root.style.setProperty('--primary-blue', colors.primary.blue);
        root.style.setProperty('--primary-orange', colors.primary.orange);
        root.style.setProperty('--primary-white', colors.primary.white);
        root.style.setProperty('--primary-cyan', colors.primary.cyan);
        root.style.setProperty('--secondary-gray', colors.secondary.gray);
        root.style.setProperty('--text-dark', colors.secondary.textDark);
        root.style.setProperty('--text-light', colors.secondary.textLight);
        root.style.setProperty('--border-light', colors.secondary.borderLight);
    }
    
    // Aplica configurações de analytics
    if (ESTAMPAI_CONFIG.analytics.enabled) {
        if (ESTAMPAI_CONFIG.analytics.googleAnalytics.enabled) {
            // Inicializa Google Analytics
            console.log('Google Analytics inicializado');
        }
        
        if (ESTAMPAI_CONFIG.analytics.mixpanel.enabled) {
            // Inicializa Mixpanel
            console.log('Mixpanel inicializado');
        }
    }
}

// ===== EXPORTAÇÃO =====
if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = { ESTAMPAI_CONFIG, getConfig, setConfig, applyConfig };
} else if (typeof window !== 'undefined') {
    // Browser
    window.ESTAMPAI_CONFIG = ESTAMPAI_CONFIG;
    window.getConfig = getConfig;
    window.setConfig = setConfig;
    window.applyConfig = applyConfig;
}

// ===== INICIALIZAÇÃO AUTOMÁTICA =====
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', applyConfig);
}

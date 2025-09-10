/**
 * EstampAI - Chat com IA para Criação de Estampas
 * Sistema de chat conversacional com geração de estampas PNG dinâmicas
 */

// ===== CONFIGURAÇÕES =====
const CONFIG = {
    ai: {
        name: "EstampAI",
        avatar: "🤖",
        responses: {
            greeting: "Olá! Sou a EstampAI, sua assistente para criação de estampas. Descreva o que você gostaria de criar e eu farei uma estampa única para você!",
            processing: "Entendi! Vou criar uma estampa baseada na sua descrição...",
            completed: "Pronto! Criei sua estampa. Você pode visualizá-la no avatar ou baixar apenas a estampa.",
            error: "Desculpe, não consegui processar sua solicitação. Pode tentar descrever de outra forma?"
        }
    },
    canvas: {
        avatar: { width: 400, height: 500 },
        stamp: { width: 400, height: 400 }
    }
};

// ===== VARIÁVEIS GLOBAIS =====
let chatHistory = [];
let currentStamp = null;
let isGenerating = false;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    showWelcomeMessage();
});

function initializeApp() {
    console.log('🎨 EstampAI Chat iniciado!');
    initializeCanvas();
    loadChatHistory();
    document.getElementById('chatInput').focus();
}

function setupEventListeners() {
    const chatInput = document.getElementById('chatInput');
    
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Verifica se o botão existe antes de adicionar o listener
    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}

function initializeCanvas() {
    const avatarCanvas = document.getElementById('avatarCanvas');
    const stampCanvas = document.getElementById('stampCanvas');
    
    if (avatarCanvas) {
        avatarCanvas.width = CONFIG.canvas.avatar.width;
        avatarCanvas.height = CONFIG.canvas.avatar.height;
    }
    
    if (stampCanvas) {
        stampCanvas.width = CONFIG.canvas.stamp.width;
        stampCanvas.height = CONFIG.canvas.stamp.height;
    }
}

// ===== SISTEMA DE CHAT =====
function showWelcomeMessage() {
    addAIMessage(ESTAMPAI_CONFIG.ai.responses.greeting);
}

async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message || isGenerating) return;
    
    addUserMessage(message);
    chatInput.value = '';
    chatInput.style.height = 'auto';
    await processWithAI(message);
}

function addUserMessage(text) {
    const message = {
        type: 'user',
        text: text,
        timestamp: new Date()
    };
    
    chatHistory.push(message);
    renderMessage(message);
    saveChatHistory();
}

function addAIMessage(text) {
    const message = {
        type: 'ai',
        text: text,
        timestamp: new Date()
    };
    
    chatHistory.push(message);
    renderMessage(message);
    saveChatHistory();
}

function renderMessage(message) {
    const chatMessages = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.type}`;
    
    const timeString = message.timestamp.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageElement.innerHTML = `
        <div class="message-avatar">
            ${message.type === 'user' ? '👤' : CONFIG.ai.avatar}
        </div>
        <div class="message-content">
            <div class="message-text">${message.text}</div>
            <div class="message-time">${timeString}</div>
        </div>
    `;
    
    // Adiciona a mensagem ao container
    if (chatMessages) {
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

async function processWithAI(userMessage) {
    isGenerating = true;
    showLoadingOverlay("Analisando sua solicitação...");
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const analysis = analyzeUserRequest(userMessage);
        addAIMessage(ESTAMPAI_CONFIG.ai.responses.processing);
        
        showLoadingOverlay("Criando sua estampa...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const stamp = await generateStamp(analysis);
        currentStamp = stamp;
        
        await updateAvatarDisplay(stamp);
        updateStampDisplay(stamp);
        updateStampInfo(stamp);
        
        addAIMessage(ESTAMPAI_CONFIG.ai.responses.completed);
        
    } catch (error) {
        console.error('Erro ao processar com IA:', error);
        addAIMessage(ESTAMPAI_CONFIG.ai.responses.error);
    } finally {
        isGenerating = false;
        hideLoadingOverlay();
    }
}

function analyzeUserRequest(message) {
    const analysis = {
        style: 'geometric',
        colors: ['#1A237E', '#FF9800'],
        pattern: 'triangles',
        description: message,
        intensity: 0.8,
        mood: 'neutral',
        size: 'medium'
    };
    
    const lowerMessage = message.toLowerCase();
    
    // Análise mais sofisticada de estilo
    const styleKeywords = {
        'organic': ['floral', 'flor', 'orgânico', 'natureza', 'natural', 'folha', 'planta', 'botânico', 'jardim', 'verde', 'ecológico'],
        'geometric': ['geométrico', 'geometria', 'triângulo', 'quadrado', 'círculo', 'linha', 'forma', 'simétrico', 'preciso', 'matemático', 'angular'],
        'abstract': ['abstrato', 'abstrata', 'arte', 'moderno', 'contemporâneo', 'expressivo', 'criativo', 'único', 'diferente', 'inovador'],
        'figurative': ['figurativo', 'figura', 'desenho', 'ilustração', 'personagem', 'animal', 'objeto', 'representativo', 'realista', 'estrela', 'coração', 'moto', 'moto', 'bicicleta', 'carro', 'veículo', 'chamas', 'fogo', 'flame', 'burning', 'dragão', 'dragon', 'dragão', 'serpente', 'cobra', 'flamejante'],
        'religious': ['cruz', 'cristo', 'jesus', 'religioso', 'sagrado', 'bíblia', 'igreja', 'fé', 'deus', 'cristianismo'],
        'symbols': ['símbolo', 'símbolos', 'ícone', 'ícones', 'logo', 'marca', 'emblema', 'insígnia']
    };
    
    // Detecta estilo com pontuação
    let styleScore = { organic: 0, geometric: 0, abstract: 0, figurative: 0, religious: 0, symbols: 0 };
    
    Object.keys(styleKeywords).forEach(style => {
        styleKeywords[style].forEach(keyword => {
            if (lowerMessage.includes(keyword)) {
                styleScore[style] += 1;
            }
        });
    });
    
    // Escolhe o estilo com maior pontuação
    const bestStyle = Object.keys(styleScore).reduce((a, b) => styleScore[a] > styleScore[b] ? a : b);
    analysis.style = bestStyle;
    
    // Define padrão baseado no estilo
    switch(bestStyle) {
        case 'organic':
            analysis.pattern = 'flowers';
            break;
        case 'geometric':
            analysis.pattern = 'triangles';
            break;
        case 'abstract':
            analysis.pattern = 'abstract';
            break;
        case 'figurative':
            // Detecta se é dragão especificamente
            if (lowerMessage.includes('dragão') || lowerMessage.includes('dragon')) {
                analysis.pattern = 'dragon';
            } else {
                analysis.pattern = 'figures';
            }
            break;
        case 'religious':
            analysis.pattern = 'cross';
            break;
        case 'symbols':
            analysis.pattern = 'symbols';
            break;
    }
    
    // Análise de cores mais sofisticada
    const colorKeywords = {
        'azul': ['#1A237E', '#2196F3', '#03A9F4', '#00BCD4'],
        'vermelho': ['#F44336', '#E91E63', '#FF5722', '#FF9800'],
        'verde': ['#4CAF50', '#8BC34A', '#CDDC39', '#00E676'],
        'preto': ['#000000', '#212121', '#424242', '#616161'],
        'branco': ['#FFFFFF', '#FAFAFA', '#F5F5F5', '#EEEEEE'],
        'amarelo': ['#FFEB3B', '#FFC107', '#FF9800', '#FF5722'],
        'roxo': ['#9C27B0', '#673AB7', '#3F51B5', '#E91E63'],
        'rosa': ['#E91E63', '#F06292', '#F48FB1', '#FFB3BA'],
        'laranja': ['#FF9800', '#FF5722', '#FF6F00', '#E65100'],
        'fogo': ['#FF4500', '#FF6347', '#FF7F50', '#FFA500', '#FFD700'],
        'chamas': ['#FF4500', '#FF6347', '#FF7F50', '#FFA500', '#FFD700']
    };
    
    // Detecta cores primárias e secundárias
    let detectedColors = [];
    Object.keys(colorKeywords).forEach(color => {
        if (lowerMessage.includes(color)) {
            detectedColors.push(colorKeywords[color][0]); // Pega a primeira cor da paleta
        }
    });
    
    if (detectedColors.length >= 2) {
        analysis.colors = [detectedColors[0], detectedColors[1]];
    } else if (detectedColors.length === 1) {
        analysis.colors = [detectedColors[0], '#FFFFFF'];
    }
    
    // Análise de intensidade e mood
    if (lowerMessage.includes('pastel') || lowerMessage.includes('suave') || lowerMessage.includes('claro')) {
        analysis.intensity = 0.4;
        analysis.mood = 'calm';
    } else if (lowerMessage.includes('vibrante') || lowerMessage.includes('forte') || lowerMessage.includes('intenso') || lowerMessage.includes('energético')) {
        analysis.intensity = 1.0;
        analysis.mood = 'energetic';
    } else if (lowerMessage.includes('elegante') || lowerMessage.includes('sofisticado') || lowerMessage.includes('minimalista')) {
        analysis.intensity = 0.6;
        analysis.mood = 'elegant';
    } else if (lowerMessage.includes('divertido') || lowerMessage.includes('alegre') || lowerMessage.includes('colorido')) {
        analysis.intensity = 0.9;
        analysis.mood = 'fun';
    }
    
    // Análise de tamanho
    if (lowerMessage.includes('pequeno') || lowerMessage.includes('sutil') || lowerMessage.includes('discreto')) {
        analysis.size = 'small';
    } else if (lowerMessage.includes('grande') || lowerMessage.includes('chamativo') || lowerMessage.includes('destaque')) {
        analysis.size = 'large';
    }
    
    // Análise de contexto específico
    if (lowerMessage.includes('camiseta') || lowerMessage.includes('roupa') || lowerMessage.includes('moda')) {
        analysis.context = 'fashion';
    } else if (lowerMessage.includes('arte') || lowerMessage.includes('design') || lowerMessage.includes('criativo')) {
        analysis.context = 'artistic';
    } else if (lowerMessage.includes('marca') || lowerMessage.includes('logo') || lowerMessage.includes('empresa')) {
        analysis.context = 'branding';
    }
    
    return analysis;
}

// ===== GERAÇÃO DE ESTAMPAS =====
async function generateStamp(analysis) {
    const stamp = {
        id: Date.now(),
        analysis: analysis,
        timestamp: new Date(),
        style: analysis.style,
        colors: analysis.colors,
        pattern: analysis.pattern,
        aiGenerated: false,
        imageUrl: null,
        useImageEdit: false
    };
    
    // Tenta gerar com IA primeiro
    if (ESTAMPAI_CONFIG.ai.openai.apiKey) {
        try {
            // Primeiro, gera a estampa standalone
            const stampImageUrl = await generateStampWithAI(analysis.description, analysis);
            if (stampImageUrl) {
                stamp.aiGenerated = true;
                stamp.imageUrl = stampImageUrl;
                stamp.useImageEdit = ESTAMPAI_CONFIG.ai.imageEdit.enabled;
                console.log('✅ Estampa gerada com IA:', stampImageUrl);
                console.log('🎯 Usando edição de imagens:', stamp.useImageEdit);
            } else {
                console.log('⚠️ IA falhou, usando sistema de fallback');
            }
        } catch (error) {
            console.error('❌ Erro na geração com IA:', error);
        }
    }
    
    return stamp;
}

async function updateAvatarDisplay(stamp) {
    const canvas = document.getElementById('avatarCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Se a estampa foi gerada com IA e edição de imagens está habilitada
    if (stamp.aiGenerated && stamp.imageUrl && stamp.useImageEdit) {
        try {
            console.log('🎯 Aplicando estampa no avatar com edição de IA...');
            
            // Primeiro, desenha o avatar base
            drawAvatar(ctx, canvas.width, canvas.height, stamp);
            
            // Aplica a estampa usando edição de imagens
            const editedImageUrl = await applyStampToAvatarWithAI(stamp.analysis.description, canvas);
            
            if (editedImageUrl) {
                // Carrega a imagem editada
                const success = await loadAndApplyImage(editedImageUrl, canvas);
                if (success) {
                    console.log('✅ Estampa aplicada com edição de IA com sucesso!');
                } else {
                    console.log('⚠️ Falha ao carregar imagem editada, usando estampa sobreposta');
                    // Fallback: aplica a estampa sobreposta
                    await loadAndApplyImage(stamp.imageUrl, canvas);
                }
            } else {
                console.log('⚠️ Edição de IA falhou, usando estampa sobreposta');
                // Fallback: aplica a estampa sobreposta
                await loadAndApplyImage(stamp.imageUrl, canvas);
            }
            
        } catch (error) {
            console.error('❌ Erro na edição de IA:', error);
            // Fallback: usa sistema manual
            drawAvatar(ctx, canvas.width, canvas.height, stamp);
        }
    } 
    // Se a estampa foi gerada com IA mas sem edição
    else if (stamp.aiGenerated && stamp.imageUrl) {
        try {
            const success = await loadAndApplyImage(stamp.imageUrl, canvas);
            if (success) {
                console.log('✅ Imagem da IA aplicada com sucesso');
            } else {
                console.log('⚠️ Falha ao carregar imagem da IA, usando sistema de fallback');
                drawAvatar(ctx, canvas.width, canvas.height, stamp);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar imagem da IA:', error);
            drawAvatar(ctx, canvas.width, canvas.height, stamp);
        }
    } 
    // Usa o sistema de fallback (desenho manual)
    else {
        drawAvatar(ctx, canvas.width, canvas.height, stamp);
    }
}

function updateStampDisplay(stamp) {
    const canvas = document.getElementById('stampCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStamp(ctx, canvas.width, canvas.height, stamp);
}

function updateStampInfo(stamp) {
    const styleElement = document.getElementById('stampStyle');
    const colorsElement = document.getElementById('stampColors');
    
    if (styleElement) {
        styleElement.textContent = getStyleName(stamp.style);
    }
    
    if (colorsElement) {
        colorsElement.textContent = stamp.colors.join(' / ');
    }
}

// ===== DESENHO =====
function drawAvatar(ctx, width, height, stamp) {
    // SEMPRE tenta carregar avatar real primeiro
    if (ESTAMPAI_CONFIG.avatar.useRealImage) {
        loadRealAvatar(ctx, width, height, stamp);
    } else {
        // Fallback para avatar desenhado
        drawDrawnAvatar(ctx, width, height, stamp);
    }
}

function loadRealAvatar(ctx, width, height, stamp) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
        console.log('✅ Imagem carregada com sucesso!');
        // Limpa o canvas
        ctx.clearRect(0, 0, width, height);
        
        // Desenha a imagem do avatar
        ctx.drawImage(img, 0, 0, width, height);
        console.log('✅ Avatar desenhado no canvas');
        
        // Aplica a estampa se existir
        if (stamp && stamp.pattern) {
            console.log('🎨 Aplicando estampa:', stamp.pattern);
            applyStampToRealAvatar(ctx, width, height, stamp);
        }
    };
    
    img.onerror = function() {
        console.warn('Erro ao carregar avatar, tentando fallback');
        if (ESTAMPAI_CONFIG.avatar.fallbackToDrawn) {
            drawDrawnAvatar(ctx, width, height, stamp);
        }
    };
    
    // FORÇA carregamento da imagem local
    console.log('🖼️ Carregando avatar:', ESTAMPAI_CONFIG.avatar.imagePath);
    
    if (ESTAMPAI_CONFIG.avatar.imagePath) {
        img.src = ESTAMPAI_CONFIG.avatar.imagePath;
        console.log('✅ Tentando carregar:', ESTAMPAI_CONFIG.avatar.imagePath);
    } else if (ESTAMPAI_CONFIG.avatar.imageUrl) {
        img.src = ESTAMPAI_CONFIG.avatar.imageUrl;
        console.log('✅ Tentando carregar URL:', ESTAMPAI_CONFIG.avatar.imageUrl);
    } else {
        console.warn('❌ Nenhuma imagem de avatar configurada');
        drawDrawnAvatar(ctx, width, height, stamp);
    }
}

function applyStampToRealAvatar(ctx, width, height, stamp) {
    const stampPos = ESTAMPAI_CONFIG.avatar.stampPosition;
    
    // Cria um canvas temporário para a estampa
    const stampCanvas = document.createElement('canvas');
    stampCanvas.width = stampPos.width;
    stampCanvas.height = stampPos.height;
    const stampCtx = stampCanvas.getContext('2d');
    
    // Desenha a estampa no canvas temporário
    drawPattern(stampCtx, 0, 0, stampPos.width, stampPos.height, stamp);
    
    // Aplica a estampa na imagem real com transparência
    ctx.globalAlpha = 0.9; // Ligeira transparência para parecer mais natural
    ctx.drawImage(stampCanvas, stampPos.x, stampPos.y, stampPos.width, stampPos.height);
    ctx.globalAlpha = 1.0; // Restaura opacidade
}

function drawDrawnAvatar(ctx, width, height, stamp) {
    // Fundo profissional com gradiente sutil
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#f8f9fa');
    bgGradient.addColorStop(0.5, '#e9ecef');
    bgGradient.addColorStop(1, '#dee2e6');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Sombra geral do avatar
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 20;
    
    // Cabeça realista e proporcional
    const headGradient = ctx.createRadialGradient(width/2, 110, 0, width/2, 130, 75);
    headGradient.addColorStop(0, '#fdbcb4');
    headGradient.addColorStop(0.6, '#f4a261');
    headGradient.addColorStop(1, '#e76f51');
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.ellipse(width/2, 120, 70, 85, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabelo moderno e bem definido
    const hairGradient = ctx.createLinearGradient(width/2 - 85, 30, width/2 + 85, 170);
    hairGradient.addColorStop(0, '#2c1810');
    hairGradient.addColorStop(0.2, '#3d2314');
    hairGradient.addColorStop(0.5, '#4a2c1a');
    hairGradient.addColorStop(0.8, '#3d2314');
    hairGradient.addColorStop(1, '#2c1810');
    ctx.fillStyle = hairGradient;
    
    // Cabelo com formato realista
    ctx.beginPath();
    ctx.ellipse(width/2, 100, 85, 90, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Mechas de cabelo com movimento
    ctx.fillStyle = '#1a0f08';
    for(let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const x = width/2 + Math.cos(angle) * 80;
        const y = 100 + Math.sin(angle) * 80;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Olhos realistas e expressivos
    ctx.shadowBlur = 0;
    
    // Olho esquerdo
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(width/2 - 28, 110, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Íris com gradiente realista
    const irisGradient = ctx.createRadialGradient(width/2 - 28, 110, 0, width/2 - 28, 110, 10);
    irisGradient.addColorStop(0, '#87ceeb');
    irisGradient.addColorStop(0.6, '#4682b4');
    irisGradient.addColorStop(1, '#191970');
    ctx.fillStyle = irisGradient;
    ctx.beginPath();
    ctx.ellipse(width/2 - 28, 110, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupila
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(width/2 - 28, 110, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Brilho no olho
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(width/2 - 26, 108, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Olho direito
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(width/2 + 28, 110, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    const rightIrisGradient = ctx.createRadialGradient(width/2 + 28, 110, 0, width/2 + 28, 110, 10);
    rightIrisGradient.addColorStop(0, '#87ceeb');
    rightIrisGradient.addColorStop(0.6, '#4682b4');
    rightIrisGradient.addColorStop(1, '#191970');
    ctx.fillStyle = rightIrisGradient;
    ctx.beginPath();
    ctx.ellipse(width/2 + 28, 110, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(width/2 + 28, 110, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(width/2 + 26, 108, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Sobrancelhas bem definidas
    ctx.strokeStyle = '#2c1810';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(width/2 - 45, 95);
    ctx.quadraticCurveTo(width/2 - 20, 85, width/2 - 5, 95);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width/2 + 5, 95);
    ctx.quadraticCurveTo(width/2 + 20, 85, width/2 + 45, 95);
    ctx.stroke();
    
    // Nariz realista
    ctx.fillStyle = '#f4a261';
    ctx.beginPath();
    ctx.ellipse(width/2, 130, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Boca natural e expressiva
    const mouthGradient = ctx.createLinearGradient(width/2 - 25, 145, width/2 + 25, 160);
    mouthGradient.addColorStop(0, '#ff6b9d');
    mouthGradient.addColorStop(0.5, '#ff8fab');
    mouthGradient.addColorStop(1, '#ff6b9d');
    ctx.fillStyle = mouthGradient;
    ctx.beginPath();
    ctx.ellipse(width/2, 152, 22, 12, 0, 0, Math.PI);
    ctx.fill();
    
    // Dentes naturais
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(width/2, 150, 15, 5, 0, 0, Math.PI);
    ctx.fill();
    
    // Pescoço proporcional
    const neckGradient = ctx.createLinearGradient(width/2 - 25, 180, width/2 + 25, 210);
    neckGradient.addColorStop(0, '#fdbcb4');
    neckGradient.addColorStop(1, '#f4a261');
    ctx.fillStyle = neckGradient;
    ctx.fillRect(width/2 - 20, 180, 40, 35);
    
    // Corpo/Camiseta profissional
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 10;
    
    const shirtGradient = ctx.createLinearGradient(width/2 - 100, 200, width/2 + 100, 450);
    shirtGradient.addColorStop(0, '#ffffff');
    shirtGradient.addColorStop(0.2, '#f8f9fa');
    shirtGradient.addColorStop(0.8, '#e9ecef');
    shirtGradient.addColorStop(1, '#dee2e6');
    ctx.fillStyle = shirtGradient;
    ctx.fillRect(width/2 - 95, 200, 190, 270);
    
    // Gola profissional
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(width/2, 200, 35, 20, 0, 0, Math.PI);
    ctx.fill();
    
    // Área da estampa com bordas arredondadas
    const stampX = width/2 - 80;
    const stampY = 250;
    const stampWidth = 160;
    const stampHeight = 160;
    
    // Sombra da estampa
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(stampX + 4, stampY + 4, stampWidth, stampHeight);
    
    // Estampa
    ctx.shadowBlur = 0;
    ctx.fillStyle = stamp.colors[1] || '#ffffff';
    ctx.fillRect(stampX, stampY, stampWidth, stampHeight);
    
    // Aplica a estampa
    drawStampOnShirt(ctx, stampX, stampY, stampWidth, stampHeight, stamp);
    
    // Braços proporcionais
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    
    const armGradient = ctx.createLinearGradient(width/2 - 120, 220, width/2 - 85, 360);
    armGradient.addColorStop(0, '#fdbcb4');
    armGradient.addColorStop(1, '#f4a261');
    ctx.fillStyle = armGradient;
    ctx.fillRect(width/2 - 115, 220, 35, 140);
    
    const rightArmGradient = ctx.createLinearGradient(width/2 + 85, 220, width/2 + 120, 360);
    rightArmGradient.addColorStop(0, '#fdbcb4');
    rightArmGradient.addColorStop(1, '#f4a261');
    ctx.fillStyle = rightArmGradient;
    ctx.fillRect(width/2 + 80, 220, 35, 140);
    
    // Mãos realistas
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#fdbcb4';
    ctx.beginPath();
    ctx.arc(width/2 - 97, 360, 22, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(width/2 + 97, 360, 22, 0, Math.PI * 2);
    ctx.fill();
    
    // Pernas proporcionais
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;
    
    const legGradient = ctx.createLinearGradient(width/2 - 30, 470, width/2 - 5, 550);
    legGradient.addColorStop(0, '#2c3e50');
    legGradient.addColorStop(0.5, '#34495e');
    legGradient.addColorStop(1, '#2c3e50');
    ctx.fillStyle = legGradient;
    ctx.fillRect(width/2 - 27, 470, 24, 110);
    
    const rightLegGradient = ctx.createLinearGradient(width/2 + 5, 470, width/2 + 30, 550);
    rightLegGradient.addColorStop(0, '#2c3e50');
    rightLegGradient.addColorStop(0.5, '#34495e');
    rightLegGradient.addColorStop(1, '#2c3e50');
    ctx.fillStyle = rightLegGradient;
    ctx.fillRect(width/2 + 3, 470, 24, 110);
    
    // Sapatos profissionais
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(width/2 - 35, 580, 40, 30);
    ctx.fillRect(width/2 - 5, 580, 40, 30);
    
    // Detalhes dos sapatos
    ctx.fillStyle = '#333333';
    ctx.fillRect(width/2 - 33, 582, 36, 8);
    ctx.fillRect(width/2 - 3, 582, 36, 8);
    
    // Reset sombras
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

function drawStampOnShirt(ctx, x, y, width, height, stamp) {
    ctx.fillStyle = stamp.colors[1] || '#ffffff';
    ctx.fillRect(x, y, width, height);
    drawPattern(ctx, x, y, width, height, stamp);
}

function drawStamp(ctx, width, height, stamp) {
    ctx.fillStyle = stamp.colors[1] || '#ffffff';
    ctx.fillRect(0, 0, width, height);
    drawPattern(ctx, 0, 0, width, height, stamp);
}

function drawPattern(ctx, x, y, width, height, stamp) {
    const primaryColor = stamp.colors[0];
    const secondaryColor = stamp.colors[1];
    const intensity = stamp.analysis?.intensity || 0.8;
    
    ctx.globalAlpha = intensity;
    
    switch(stamp.pattern) {
        case 'triangles':
            drawTrianglePattern(ctx, x, y, width, height, primaryColor, secondaryColor);
            break;
        case 'flowers':
            drawFlowerPattern(ctx, x, y, width, height, primaryColor, secondaryColor);
            break;
        case 'abstract':
            drawAbstractPattern(ctx, x, y, width, height, primaryColor, secondaryColor);
            break;
        case 'figures':
            drawFigurePattern(ctx, x, y, width, height, primaryColor, secondaryColor);
            break;
        case 'dragon':
            drawDragonPattern(ctx, x, y, width, height, primaryColor, secondaryColor);
            break;
        case 'cross':
            drawCrossPattern(ctx, x, y, width, height, primaryColor, secondaryColor);
            break;
        case 'symbols':
            drawSymbolPattern(ctx, x, y, width, height, primaryColor, secondaryColor);
            break;
        default:
            drawTrianglePattern(ctx, x, y, width, height, primaryColor, secondaryColor);
    }
    
    ctx.globalAlpha = 1.0;
}

function drawTrianglePattern(ctx, x, y, width, height, primary, secondary) {
    const triangleSize = 25;
    const spacing = 5;
    
    // Fundo com gradiente sutil
    const bgGradient = ctx.createLinearGradient(x, y, x + width, y + height);
    bgGradient.addColorStop(0, secondary);
    bgGradient.addColorStop(1, secondary);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(x, y, width, height);
    
    // Triângulos com variações
    for(let i = 0; i < width; i += triangleSize + spacing) {
        for(let j = 0; j < height; j += triangleSize + spacing) {
            const variation = Math.sin(i * 0.1) * Math.cos(j * 0.1);
            const currentSize = triangleSize + variation * 5;
            
            // Gradiente para cada triângulo
            const triangleGradient = ctx.createLinearGradient(
                x + i, y + j, 
                x + i + currentSize, y + j + currentSize
            );
            triangleGradient.addColorStop(0, primary);
            triangleGradient.addColorStop(1, adjustColor(primary, -20));
            
            ctx.fillStyle = triangleGradient;
            ctx.beginPath();
            ctx.moveTo(x + i + currentSize/2, y + j);
            ctx.lineTo(x + i, y + j + currentSize);
            ctx.lineTo(x + i + currentSize, y + j + currentSize);
            ctx.closePath();
            ctx.fill();
            
            // Sombra sutil
            ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    // Linhas de conexão
    ctx.strokeStyle = adjustColor(primary, 30);
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    
    for(let i = triangleSize; i < width; i += triangleSize + spacing) {
        for(let j = triangleSize; j < height; j += triangleSize + spacing) {
            ctx.beginPath();
            ctx.moveTo(x + i, y + j);
            ctx.lineTo(x + i + triangleSize, y + j + triangleSize);
            ctx.stroke();
        }
    }
    
    ctx.globalAlpha = 1.0;
}

function drawFlowerPattern(ctx, x, y, width, height, primary, secondary) {
    const flowerSize = 35;
    const spacing = 10;
    
    // Fundo com gradiente orgânico
    const bgGradient = ctx.createRadialGradient(
        x + width/2, y + height/2, 0,
        x + width/2, y + height/2, Math.max(width, height)/2
    );
    bgGradient.addColorStop(0, adjustColor(secondary, 10));
    bgGradient.addColorStop(1, secondary);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(x, y, width, height);
    
    // Flores com variações naturais
    for(let i = flowerSize; i < width - flowerSize; i += flowerSize + spacing) {
        for(let j = flowerSize; j < height - flowerSize; j += flowerSize + spacing) {
            const variation = Math.sin(i * 0.2) * Math.cos(j * 0.2);
            const currentSize = flowerSize + variation * 8;
            const centerX = x + i;
            const centerY = y + j;
            
            // Centro da flor com gradiente
            const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 12);
            centerGradient.addColorStop(0, adjustColor(secondary, 20));
            centerGradient.addColorStop(1, adjustColor(secondary, -10));
            
            ctx.fillStyle = centerGradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
            ctx.fill();
            
            // Pétalas com gradiente e variações
            const petalCount = 6 + Math.floor(variation * 2);
            for(let k = 0; k < petalCount; k++) {
                const angle = (k * Math.PI * 2) / petalCount;
                const petalX = centerX + Math.cos(angle) * 18;
                const petalY = centerY + Math.sin(angle) * 18;
                const petalSize = 8 + variation * 3;
                
                // Gradiente da pétala
                const petalGradient = ctx.createRadialGradient(
                    petalX, petalY, 0,
                    petalX, petalY, petalSize
                );
                petalGradient.addColorStop(0, primary);
                petalGradient.addColorStop(0.7, adjustColor(primary, -15));
                petalGradient.addColorStop(1, adjustColor(primary, -30));
                
                ctx.fillStyle = petalGradient;
                ctx.beginPath();
                ctx.ellipse(petalX, petalY, petalSize, petalSize * 0.7, angle, 0, Math.PI * 2);
                ctx.fill();
                
                // Sombra da pétala
                ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            
            // Folhas decorativas
            ctx.fillStyle = adjustColor(primary, -40);
            ctx.globalAlpha = 0.6;
            for(let l = 0; l < 3; l++) {
                const leafAngle = (l * Math.PI * 2) / 3 + Math.PI/4;
                const leafX = centerX + Math.cos(leafAngle) * 25;
                const leafY = centerY + Math.sin(leafAngle) * 25;
                
                ctx.beginPath();
                ctx.ellipse(leafX, leafY, 6, 12, leafAngle, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1.0;
        }
    }
}

function drawAbstractPattern(ctx, x, y, width, height, primary, secondary) {
    // Fundo com gradiente abstrato
    const bgGradient = ctx.createLinearGradient(x, y, x + width, y + height);
    bgGradient.addColorStop(0, adjustColor(secondary, 15));
    bgGradient.addColorStop(0.5, secondary);
    bgGradient.addColorStop(1, adjustColor(secondary, -15));
    ctx.fillStyle = bgGradient;
    ctx.fillRect(x, y, width, height);
    
    // Linhas abstratas com variações
    ctx.strokeStyle = primary;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.8;
    
    for(let i = 0; i < 8; i++) {
        const startX = x + Math.random() * width;
        const startY = y + Math.random() * height;
        const controlX = x + Math.random() * width;
        const controlY = y + Math.random() * height;
        const endX = x + Math.random() * width;
        const endY = y + Math.random() * height;
        
        // Gradiente para a linha
        const lineGradient = ctx.createLinearGradient(startX, startY, endX, endY);
        lineGradient.addColorStop(0, primary);
        lineGradient.addColorStop(0.5, adjustColor(primary, 20));
        lineGradient.addColorStop(1, adjustColor(primary, -20));
        
        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = 2 + Math.random() * 4;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.stroke();
    }
    
    // Formas abstratas com gradientes
    ctx.globalAlpha = 0.7;
    for(let i = 0; i < 12; i++) {
        const shapeX = x + Math.random() * width;
        const shapeY = y + Math.random() * height;
        const shapeSize = 10 + Math.random() * 25;
        
        // Gradiente para a forma
        const shapeGradient = ctx.createRadialGradient(shapeX, shapeY, 0, shapeX, shapeY, shapeSize);
        shapeGradient.addColorStop(0, adjustColor(primary, 30));
        shapeGradient.addColorStop(0.7, primary);
        shapeGradient.addColorStop(1, adjustColor(primary, -30));
        
        ctx.fillStyle = shapeGradient;
        
        // Diferentes tipos de formas
        const shapeType = Math.floor(Math.random() * 3);
        switch(shapeType) {
            case 0: // Círculo
                ctx.beginPath();
                ctx.arc(shapeX, shapeY, shapeSize, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 1: // Retângulo rotacionado
                ctx.save();
                ctx.translate(shapeX, shapeY);
                ctx.rotate(Math.random() * Math.PI * 2);
                ctx.fillRect(-shapeSize/2, -shapeSize/2, shapeSize, shapeSize * 0.6);
                ctx.restore();
                break;
            case 2: // Triângulo
                ctx.beginPath();
                ctx.moveTo(shapeX, shapeY - shapeSize);
                ctx.lineTo(shapeX - shapeSize, shapeY + shapeSize);
                ctx.lineTo(shapeX + shapeSize, shapeY + shapeSize);
                ctx.closePath();
                ctx.fill();
                break;
        }
        
        // Sombra sutil
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    // Pontos de destaque
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = adjustColor(primary, 40);
    for(let i = 0; i < 6; i++) {
        const pointX = x + Math.random() * width;
        const pointY = y + Math.random() * height;
        const pointSize = 3 + Math.random() * 8;
        
        ctx.beginPath();
        ctx.arc(pointX, pointY, pointSize, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.globalAlpha = 1.0;
}

function drawFigurePattern(ctx, x, y, width, height, primary, secondary) {
    const figureSize = 45;
    const spacing = 15;
    
    // Fundo com gradiente
    const bgGradient = ctx.createLinearGradient(x, y, x + width, y + height);
    bgGradient.addColorStop(0, adjustColor(secondary, 10));
    bgGradient.addColorStop(1, adjustColor(secondary, -10));
    ctx.fillStyle = bgGradient;
    ctx.fillRect(x, y, width, height);
    
    // Figuras com variações
    for(let i = figureSize; i < width - figureSize; i += figureSize + spacing) {
        for(let j = figureSize; j < height - figureSize; j += figureSize + spacing) {
            const centerX = x + i;
            const centerY = y + j;
            const variation = Math.sin(i * 0.1) * Math.cos(j * 0.1);
            
            // Escolhe tipo de figura baseado na variação
            const figureType = Math.floor((variation + 1) * 2) % 3;
            
            switch(figureType) {
                case 0: // Estrela
                    drawStar(ctx, centerX, centerY, primary, 20 + variation * 5);
                    break;
                case 1: // Coração
                    drawHeart(ctx, centerX, centerY, primary, 15 + variation * 3);
                    break;
                case 2: // Diamante
                    drawDiamond(ctx, centerX, centerY, primary, 18 + variation * 4);
                    break;
            }
        }
    }
}

function drawStar(ctx, x, y, color, size) {
    const outerRadius = size;
    const innerRadius = size * 0.4;
    const spikes = 5;
    
    // Gradiente para a estrela
    const starGradient = ctx.createRadialGradient(x, y, 0, x, y, outerRadius);
    starGradient.addColorStop(0, adjustColor(color, 30));
    starGradient.addColorStop(0.7, color);
    starGradient.addColorStop(1, adjustColor(color, -20));
    
    ctx.fillStyle = starGradient;
    ctx.beginPath();
    
    for(let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const starX = x + Math.cos(angle) * radius;
        const starY = y + Math.sin(angle) * radius;
        
        if(i === 0) {
            ctx.moveTo(starX, starY);
        } else {
            ctx.lineTo(starX, starY);
        }
    }
    ctx.closePath();
    ctx.fill();
    
    // Sombra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawHeart(ctx, x, y, color, size) {
    // Gradiente para o coração
    const heartGradient = ctx.createRadialGradient(x, y - size/2, 0, x, y, size);
    heartGradient.addColorStop(0, adjustColor(color, 20));
    heartGradient.addColorStop(1, adjustColor(color, -10));
    
    ctx.fillStyle = heartGradient;
    ctx.beginPath();
    
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    
    // Curva esquerda
    ctx.bezierCurveTo(x, y, x - size/2, y, x - size/2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size/2, y + (size + topCurveHeight)/2, x, y + (size + topCurveHeight)/2, x, y + size);
    
    // Curva direita
    ctx.bezierCurveTo(x, y + (size + topCurveHeight)/2, x + size/2, y + (size + topCurveHeight)/2, x + size/2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size/2, y, x, y, x, y + topCurveHeight);
    
    ctx.closePath();
    ctx.fill();
    
    // Sombra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawDiamond(ctx, x, y, color, size) {
    // Gradiente para o diamante
    const diamondGradient = ctx.createLinearGradient(x - size, y, x + size, y);
    diamondGradient.addColorStop(0, adjustColor(color, 20));
    diamondGradient.addColorStop(0.5, color);
    diamondGradient.addColorStop(1, adjustColor(color, -20));
    
    ctx.fillStyle = diamondGradient;
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size, y);
    ctx.closePath();
    ctx.fill();
    
    // Sombra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawCrossPattern(ctx, x, y, width, height, primary, secondary) {
    const crossSize = 40;
    const spacing = 20;
    
    // Fundo com gradiente
    const bgGradient = ctx.createLinearGradient(x, y, x + width, y + height);
    bgGradient.addColorStop(0, adjustColor(secondary, 10));
    bgGradient.addColorStop(1, adjustColor(secondary, -10));
    ctx.fillStyle = bgGradient;
    ctx.fillRect(x, y, width, height);
    
    // Cruzes com variações
    for(let i = crossSize; i < width - crossSize; i += crossSize + spacing) {
        for(let j = crossSize; j < height - crossSize; j += crossSize + spacing) {
            const centerX = x + i;
            const centerY = y + j;
            const variation = Math.sin(i * 0.1) * Math.cos(j * 0.1);
            const currentSize = crossSize + variation * 8;
            
            drawCross(ctx, centerX, centerY, primary, currentSize);
        }
    }
}

function drawCross(ctx, x, y, color, size) {
    const crossWidth = size * 0.2;
    const crossHeight = size;
    
    // Gradiente para a cruz
    const crossGradient = ctx.createLinearGradient(x - crossWidth/2, y - crossHeight/2, x + crossWidth/2, y + crossHeight/2);
    crossGradient.addColorStop(0, adjustColor(color, 20));
    crossGradient.addColorStop(0.5, color);
    crossGradient.addColorStop(1, adjustColor(color, -20));
    
    ctx.fillStyle = crossGradient;
    
    // Braço vertical
    ctx.fillRect(x - crossWidth/2, y - crossHeight/2, crossWidth, crossHeight);
    
    // Braço horizontal
    ctx.fillRect(x - crossHeight/2, y - crossWidth/2, crossHeight, crossWidth);
    
    // Sombra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Redesenha com sombra
    ctx.fillRect(x - crossWidth/2, y - crossHeight/2, crossWidth, crossHeight);
    ctx.fillRect(x - crossHeight/2, y - crossWidth/2, crossHeight, crossWidth);
    
    ctx.shadowBlur = 0;
}

function drawSymbolPattern(ctx, x, y, width, height, primary, secondary) {
    const symbolSize = 35;
    const spacing = 15;
    
    // Fundo com gradiente
    const bgGradient = ctx.createLinearGradient(x, y, x + width, y + height);
    bgGradient.addColorStop(0, adjustColor(secondary, 10));
    bgGradient.addColorStop(1, adjustColor(secondary, -10));
    ctx.fillStyle = bgGradient;
    ctx.fillRect(x, y, width, height);
    
    // Símbolos com variações
    for(let i = symbolSize; i < width - symbolSize; i += symbolSize + spacing) {
        for(let j = symbolSize; j < height - symbolSize; j += symbolSize + spacing) {
            const centerX = x + i;
            const centerY = y + j;
            const variation = Math.sin(i * 0.1) * Math.cos(j * 0.1);
            
            // Escolhe tipo de símbolo baseado na variação
            const symbolType = Math.floor((variation + 1) * 3) % 4;
            
            switch(symbolType) {
                case 0: // Círculo
                    drawCircleSymbol(ctx, centerX, centerY, primary, 15 + variation * 3);
                    break;
                case 1: // Quadrado
                    drawSquareSymbol(ctx, centerX, centerY, primary, 12 + variation * 2);
                    break;
                case 2: // Triângulo
                    drawTriangleSymbol(ctx, centerX, centerY, primary, 15 + variation * 3);
                    break;
                case 3: // Losango
                    drawDiamondSymbol(ctx, centerX, centerY, primary, 12 + variation * 2);
                    break;
            }
        }
    }
}

function drawCircleSymbol(ctx, x, y, color, size) {
    const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    circleGradient.addColorStop(0, adjustColor(color, 30));
    circleGradient.addColorStop(1, adjustColor(color, -20));
    
    ctx.fillStyle = circleGradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Sombra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawSquareSymbol(ctx, x, y, color, size) {
    const squareGradient = ctx.createLinearGradient(x - size, y - size, x + size, y + size);
    squareGradient.addColorStop(0, adjustColor(color, 20));
    squareGradient.addColorStop(1, adjustColor(color, -20));
    
    ctx.fillStyle = squareGradient;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
    
    // Sombra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
    ctx.shadowBlur = 0;
}

function drawTriangleSymbol(ctx, x, y, color, size) {
    const triangleGradient = ctx.createLinearGradient(x, y - size, x, y + size);
    triangleGradient.addColorStop(0, adjustColor(color, 20));
    triangleGradient.addColorStop(1, adjustColor(color, -20));
    
    ctx.fillStyle = triangleGradient;
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.lineTo(x + size, y + size);
    ctx.closePath();
    ctx.fill();
    
    // Sombra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawDiamondSymbol(ctx, x, y, color, size) {
    const diamondGradient = ctx.createLinearGradient(x - size, y, x + size, y);
    diamondGradient.addColorStop(0, adjustColor(color, 20));
    diamondGradient.addColorStop(1, adjustColor(color, -20));
    
    ctx.fillStyle = diamondGradient;
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size, y);
    ctx.closePath();
    ctx.fill();
    
    // Sombra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    ctx.shadowBlur = 0;
}

// ===== SISTEMA DE VISUALIZAÇÃO =====
function switchView(view) {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const selectedButton = document.querySelector(`[data-view="${view}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
    
    document.querySelectorAll('.result-view').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(`${view}View`);
    if (targetView) {
        targetView.classList.add('active');
    }
}

// ===== SISTEMA DE DOWNLOAD =====
function downloadAvatar() {
    if (!currentStamp) return;
    
    const canvas = document.getElementById('avatarCanvas');
    const link = document.createElement('a');
    link.download = `estampai-avatar-${currentStamp.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

function downloadStamp() {
    if (!currentStamp) return;
    
    const canvas = document.getElementById('stampCanvas');
    const link = document.createElement('a');
    link.download = `estampai-stamp-${currentStamp.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

function downloadInfo() {
    if (!currentStamp) return;
    
    const info = {
        id: currentStamp.id,
        timestamp: currentStamp.timestamp,
        style: currentStamp.style,
        colors: currentStamp.colors,
        pattern: currentStamp.pattern,
        description: currentStamp.analysis.description
    };
    
    const dataStr = JSON.stringify(info, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `estampai-info-${currentStamp.id}.json`;
    link.click();
}

function regenerateStamp() {
    if (!currentStamp || isGenerating) return;
    
    const newAnalysis = { ...currentStamp.analysis };
    newAnalysis.intensity = Math.random() * 0.4 + 0.6;
    
    const newStamp = generateStamp(newAnalysis);
    currentStamp = newStamp;
    
    updateAvatarDisplay(newStamp);
    updateStampDisplay(newStamp);
    updateStampInfo(newStamp);
    
    addAIMessage("Regenerei sua estampa com pequenas variações!");
}

// ===== FUNÇÕES UTILITÁRIAS =====
function useSuggestion(text) {
    document.getElementById('chatInput').value = text;
    document.getElementById('chatInput').focus();
}

function clearChat() {
    if (confirm('Tem certeza que deseja limpar todo o chat?')) {
        chatHistory = [];
        const chatMessages = document.getElementById('messages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        currentStamp = null;
        localStorage.removeItem('estampai_chat_history');
        showWelcomeMessage();
    }
}

function exportChat() {
    const chatData = {
        timestamp: new Date().toISOString(),
        messages: chatHistory,
        currentStamp: currentStamp
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `estampai-chat-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function showLoadingOverlay(text) {
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    
    if (loadingText) {
        loadingText.textContent = text;
    }
    
    if (overlay) {
        overlay.classList.add('active');
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

function getStyleName(style) {
    const names = {
        'geometric': 'Geométrico',
        'organic': 'Orgânico',
        'abstract': 'Abstrato',
        'figurative': 'Figurativo'
    };
    return names[style] || 'Personalizado';
}

// ===== LOCAL STORAGE =====
function saveChatHistory() {
    try {
        localStorage.setItem('estampai_chat_history', JSON.stringify(chatHistory));
    } catch (error) {
        console.error('Erro ao salvar histórico:', error);
    }
}

function loadChatHistory() {
    try {
        const saved = localStorage.getItem('estampai_chat_history');
        if (saved) {
            chatHistory = JSON.parse(saved);
            chatHistory.forEach(message => {
                renderMessage(message);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    }
}

// ===== INTEGRAÇÃO COM IA (DALL-E 3) =====
/**
 * Gera uma estampa usando DALL-E 3
 * @param {string} prompt - Descrição da estampa
 * @param {object} analysis - Análise do prompt do usuário
 * @returns {Promise<string|null>} URL da imagem gerada ou null se falhar
 */
async function generateStampWithAI(prompt, analysis) {
    const config = ESTAMPAI_CONFIG.ai.openai;
    
    // Verifica se a API Key está configurada
    if (!config.apiKey) {
        console.warn('API Key da OpenAI não configurada. Usando sistema de fallback.');
        return null;
    }
    
    // Cria prompt otimizado para DALL-E 3
    const optimizedPrompt = createOptimizedPrompt(prompt, analysis);
    
    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                prompt: optimizedPrompt,
                n: 1,
                size: config.size,
                quality: config.quality,
                style: config.style,
                response_format: 'url'
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro da API:', errorData);
            
            // Verifica se é erro de limite de cobrança
            if (errorData.error && errorData.error.code === 'billing_hard_limit_reached') {
                console.warn('💰 Limite de cobrança atingido. Usando sistema de fallback.');
                showBillingLimitMessage();
            }
            // Verifica se é erro de rate limit
            else if (errorData.error && errorData.error.message && errorData.error.message.includes('Rate limit exceeded')) {
                console.warn('⏰ Rate limit atingido. Usando sistema de fallback.');
                showRateLimitMessage();
            }
            
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const imageUrl = data.data[0].url;
        
        // Cache da imagem se habilitado
        if (ESTAMPAI_CONFIG.ai.cache.enabled) {
            cacheImage(imageUrl, optimizedPrompt);
        }
        
        return imageUrl;
        
    } catch (error) {
        console.error('Erro ao gerar estampa com IA:', error);
        return null;
    }
}

/**
 * Gera uma estampa usando GPT-5 (Nova API)
 * @param {string} prompt - Descrição da estampa
 * @param {object} analysis - Análise do prompt do usuário
 * @returns {Promise<string|null>} URL da imagem gerada ou null se falhar
 */
async function generateStampWithGPT5(prompt, analysis) {
    const config = ESTAMPAI_CONFIG.ai.openai;
    
    if (!config.apiKey) {
        console.warn('API Key da OpenAI não configurada. Usando sistema de fallback.');
        return null;
    }
    
    const optimizedPrompt = createOptimizedPrompt(prompt, analysis);
    
    try {
        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-5',
                input: optimizedPrompt,
                tools: [{"type": "image_generation"}]
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const imageGeneration = data.output.find(o => o.type === 'image_generation_call');
        
        if (imageGeneration && imageGeneration.result) {
            // Cache da imagem se habilitado
            if (ESTAMPAI_CONFIG.ai.cache.enabled) {
                cacheImage(imageGeneration.result, optimizedPrompt);
            }
            
            return imageGeneration.result;
        }
        
        return null;
        
    } catch (error) {
        console.error('Erro ao gerar estampa com GPT-5:', error);
        return null;
    }
}

/**
 * Aplica estampa em avatar usando edição de imagem
 * @param {string} stampPrompt - Prompt da estampa
 * @param {HTMLCanvasElement} avatarCanvas - Canvas do avatar
 * @returns {Promise<string|null>} URL da imagem editada ou null se falhar
 */
async function applyStampToAvatarWithAI(stampPrompt, avatarCanvas) {
    const config = ESTAMPAI_CONFIG.ai.openai;
    const imageEditConfig = ESTAMPAI_CONFIG.ai.imageEdit;
    
    if (!config.apiKey) {
        console.warn('API Key da OpenAI não configurada. Usando sistema de fallback.');
        return null;
    }
    
    try {
        // Converte canvas para blob
        const avatarBlob = await new Promise(resolve => {
            avatarCanvas.toBlob(resolve, 'image/png');
        });
        
        // Cria prompt otimizado para edição de imagens
        const editPrompt = createImageEditPrompt(stampPrompt);
        
        const formData = new FormData();
        formData.append('image', avatarBlob, 'avatar.png');
        formData.append('prompt', editPrompt);
        formData.append('model', imageEditConfig.model);
        formData.append('input_fidelity', imageEditConfig.inputFidelity);
        
        console.log('🎨 Aplicando estampa com prompt:', editPrompt);
        
        const response = await fetch('https://api.openai.com/v1/images/edit', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.data[0].url;
        
    } catch (error) {
        console.error('Erro ao aplicar estampa no avatar:', error);
        return null;
    }
}

/**
 * Cria prompt otimizado para edição de imagens
 * @param {string} stampPrompt - Prompt original da estampa
 * @returns {string} Prompt otimizado para edição
 */
function createImageEditPrompt(stampPrompt) {
    return `
        Apply this stamp design to the t-shirt area of the person in the image:
        "${stampPrompt}"
        
        Requirements:
        - Make it look natural and well-integrated into the fabric
        - Ensure proper perspective and lighting
        - Make it appear as if it's actually printed on the shirt
        - Maintain high quality and professional appearance
        - Keep the stamp centered and properly sized for the t-shirt
        - Ensure the design looks realistic and not like a digital overlay
    `.trim();
}

/**
 * Cria um prompt otimizado para DALL-E 3
 * @param {string} userPrompt - Prompt original do usuário
 * @param {object} analysis - Análise do prompt
 * @returns {string} Prompt otimizado
 */
function createOptimizedPrompt(userPrompt, analysis) {
    const style = analysis.style;
    const colors = analysis.colors;
    const mood = analysis.mood || 'neutral';
    const size = analysis.size || 'medium';
    
    // Mapeia estilos para descrições em inglês
    const styleDescriptions = {
        'organic': 'organic, natural, flowing shapes, botanical elements',
        'geometric': 'geometric, precise, symmetrical, mathematical patterns',
        'abstract': 'abstract, artistic, expressive, non-representational',
        'figurative': 'figurative, representational, illustrative, realistic',
        'religious': 'religious, spiritual, sacred symbols, devotional',
        'symbols': 'symbolic, iconic, minimalist, clean design'
    };
    
    // Mapeia cores para descrições
    const colorDescriptions = {
        '#1A237E': 'deep blue',
        '#F44336': 'bright red',
        '#4CAF50': 'green',
        '#000000': 'black',
        '#FFFFFF': 'white',
        '#FFEB3B': 'yellow',
        '#9C27B0': 'purple',
        '#E91E63': 'pink',
        '#FF9800': 'orange'
    };
    
    const primaryColor = colorDescriptions[colors[0]] || 'vibrant colors';
    const secondaryColor = colorDescriptions[colors[1]] || 'white';
    
    // Mapeia mood para descrições
    const moodDescriptions = {
        'calm': 'soft, gentle, peaceful',
        'energetic': 'bold, dynamic, vibrant',
        'elegant': 'sophisticated, refined, classy',
        'fun': 'playful, cheerful, colorful',
        'neutral': 'balanced, harmonious'
    };
    
    const moodDesc = moodDescriptions[mood] || 'balanced';
    
    // Cria o prompt otimizado
    const optimizedPrompt = `
        A high-quality t-shirt print design featuring:
        - Style: ${styleDescriptions[style] || 'creative design'}
        - Theme: ${userPrompt}
        - Colors: ${primaryColor} and ${secondaryColor}
        - Mood: ${moodDesc}
        - Size: ${size} scale
        - Format: square design, transparent background, high resolution
        - Quality: professional, print-ready, clean lines
        - Composition: well-balanced, centered, suitable for clothing
    `.trim();
    
    return optimizedPrompt;
}

/**
 * Cache de imagens geradas
 */
const imageCache = new Map();

/**
 * Adiciona imagem ao cache
 * @param {string} url - URL da imagem
 * @param {string} prompt - Prompt usado
 */
function cacheImage(url, prompt) {
    const cacheKey = prompt.toLowerCase().replace(/\s+/g, '_');
    imageCache.set(cacheKey, {
        url: url,
        timestamp: Date.now(),
        prompt: prompt
    });
    
    // Limpa cache antigo se necessário
    if (imageCache.size > ESTAMPAI_CONFIG.ai.cache.maxSize) {
        const oldestKey = imageCache.keys().next().value;
        imageCache.delete(oldestKey);
    }
}

/**
 * Busca imagem no cache
 * @param {string} prompt - Prompt para buscar
 * @returns {string|null} URL da imagem ou null se não encontrada
 */
function getCachedImage(prompt) {
    const cacheKey = prompt.toLowerCase().replace(/\s+/g, '_');
    const cached = imageCache.get(cacheKey);
    
    if (cached) {
        const age = Date.now() - cached.timestamp;
        if (age < ESTAMPAI_CONFIG.ai.cache.ttl) {
            return cached.url;
        } else {
            imageCache.delete(cacheKey);
        }
    }
    
    return null;
}

/**
 * Carrega imagem da URL e aplica no canvas
 * @param {string} imageUrl - URL da imagem
 * @param {HTMLCanvasElement} canvas - Canvas para desenhar
 * @returns {Promise<boolean>} Sucesso ou falha
 */
async function loadAndApplyImage(imageUrl, canvas) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(true);
        };
        
        img.onerror = () => {
            console.error('Erro ao carregar imagem:', imageUrl);
            resolve(false);
        };
        
        img.src = imageUrl;
    });
}

// ===== FUNÇÕES AUXILIARES =====
/**
 * Desenha padrão de dragão flamejante
 * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
 * @param {number} x - Posição X
 * @param {number} y - Posição Y
 * @param {number} width - Largura
 * @param {number} height - Altura
 * @param {string} primaryColor - Cor primária
 * @param {string} secondaryColor - Cor secundária
 */
function drawDragonPattern(ctx, x, y, width, height, primaryColor, secondaryColor) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const size = Math.min(width, height) * 0.8;
    
    // Corpo do dragão
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, size * 0.3, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cabeça do dragão
    ctx.beginPath();
    ctx.ellipse(centerX - size * 0.2, centerY, size * 0.15, size * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Chamas saindo da boca
    const flameColors = ['#FF4500', '#FF6347', '#FF7F50', '#FFA500'];
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = flameColors[i % flameColors.length];
        ctx.beginPath();
        ctx.ellipse(centerX - size * 0.35 + i * 8, centerY, 6, 15, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Asas
    ctx.fillStyle = adjustColor(primaryColor, -30);
    ctx.beginPath();
    ctx.ellipse(centerX + size * 0.1, centerY - size * 0.1, size * 0.2, size * 0.08, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + size * 0.1, centerY + size * 0.1, size * 0.2, size * 0.08, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Cauda
    ctx.beginPath();
    ctx.ellipse(centerX + size * 0.35, centerY, size * 0.15, size * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Chamas ao redor
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const flameX = centerX + Math.cos(angle) * size * 0.4;
        const flameY = centerY + Math.sin(angle) * size * 0.4;
        
        ctx.fillStyle = flameColors[i % flameColors.length];
        ctx.beginPath();
        ctx.ellipse(flameX, flameY, 4, 12, angle, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * Mostra mensagem de limite de cobrança atingido
 */
function showBillingLimitMessage() {
    addAIMessage("💰 Limite de cobrança da API atingido. Estou usando o sistema de fallback para criar sua estampa!");
}

/**
 * Mostra mensagem de rate limit atingido
 */
function showRateLimitMessage() {
    addAIMessage("⏰ Rate limit da API atingido (muitas requisições). Estou usando o sistema de fallback para criar sua estampa!");
}

/**
 * Ajusta o brilho de uma cor
 * @param {string} color - Cor em formato hex
 * @param {number} amount - Quantidade de ajuste (-100 a 100)
 * @returns {string} Cor ajustada
 */
function adjustColor(color, amount) {
    const usePound = color[0] === '#';
    const col = usePound ? color.slice(1) : color;
    
    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let g = (num >> 8 & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    
    return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
}

// ===== FUNÇÃO DE TESTE PARA AVATAR =====
function testarAvatarLocal() {
    console.log('🧪 Testando carregamento do avatar local...');
    const canvas = document.getElementById('avatarCanvas');
    if (!canvas) {
        console.error('❌ Canvas não encontrado');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    console.log('📁 Caminho configurado:', ESTAMPAI_CONFIG.avatar.imagePath);
    
    // Força carregamento da imagem
    loadRealAvatar(ctx, canvas.width, canvas.height, null);
}

// ===== FUNÇÕES GLOBAIS =====
window.sendMessage = sendMessage;
window.switchView = switchView;
window.downloadAvatar = downloadAvatar;
window.downloadStamp = downloadStamp;
window.downloadInfo = downloadInfo;
window.regenerateStamp = regenerateStamp;
window.useSuggestion = useSuggestion;
window.clearChat = clearChat;
window.exportChat = exportChat;
window.testarAvatarLocal = testarAvatarLocal;

console.log('🚀 EstampAI Chat carregado com sucesso!');

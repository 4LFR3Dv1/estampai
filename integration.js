/**
 * Sistema de Integração - EstampAI
 * Conecta todas as funcionalidades da Fase 2
 */

class EstampAIIntegration {
    constructor() {
        this.isInitialized = false;
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Aguarda todos os sistemas carregarem
        document.addEventListener('DOMContentLoaded', () => {
            this.setupIntegration();
            this.bindGlobalEvents();
            this.createIntegrationUI();
        });
        
        this.isInitialized = true;
    }
    
    setupIntegration() {
        // Verifica se todos os sistemas estão disponíveis
        const systems = {
            onboarding: typeof onboarding !== 'undefined',
            stateManager: typeof stateManager !== 'undefined',
            favoritesManager: typeof favoritesManager !== 'undefined',
            conversationHistory: typeof conversationHistory !== 'undefined',
            socialSharing: typeof socialSharing !== 'undefined'
        };
        
        console.log('🔧 Sistemas carregados:', systems);
        
        // Configura integrações entre sistemas
        this.setupSystemIntegrations();
    }
    
    setupSystemIntegrations() {
        // Integração: Onboarding → State Manager
        if (onboarding && stateManager) {
            // Adiciona notificações ao onboarding
            const originalComplete = onboarding.complete.bind(onboarding);
            onboarding.complete = function() {
                originalComplete();
                stateManager.showSuccessNotification(
                    'Bem-vindo!', 
                    'Agora você pode começar a criar estampas incríveis!'
                );
            };
        }
        
        // Integração: Favoritos → Compartilhamento
        if (favoritesManager && socialSharing) {
            // Adiciona botão de compartilhamento aos favoritos
            this.addShareToFavorites();
        }
        
        // Integração: Histórico → Favoritos
        if (conversationHistory && favoritesManager) {
            // Adiciona botão de favoritos ao histórico
            this.addFavoritesToHistory();
        }
        
        // Integração: State Manager → Todos os sistemas
        if (stateManager) {
            this.setupStateManagerIntegration();
        }
    }
    
    addShareToFavorites() {
        // Adiciona funcionalidade de compartilhamento aos favoritos
        const originalShareFavorite = favoritesManager.shareFavorite.bind(favoritesManager);
        favoritesManager.shareFavorite = function(id) {
            const favorite = this.getFavorite(id);
            if (favorite) {
                socialSharing.shareStamp({
                    title: favorite.title,
                    description: favorite.description,
                    imageUrl: favorite.imageUrl,
                    url: window.location.href
                });
            }
        };
    }
    
    addFavoritesToHistory() {
        // Adiciona botão de favoritos ao histórico de conversas
        const originalRenderConversations = conversationHistory.renderConversations.bind(conversationHistory);
        conversationHistory.renderConversations = function() {
            let html = originalRenderConversations();
            
            // Adiciona botão de favoritos se houver estampas na conversa
            html = html.replace(
                /<div class="conversation-actions" onclick="event.stopPropagation\(\)">/g,
                `<div class="conversation-actions" onclick="event.stopPropagation()">
                    <button class="conversation-action conversation-favorite" 
                            onclick="estampaiIntegration.addConversationToFavorites('$1')" 
                            title="Adicionar aos favoritos">
                        ⭐
                    </button>`
            );
            
            return html;
        };
    }
    
    setupStateManagerIntegration() {
        // Integra o state manager com todos os sistemas
        const originalShowLoading = stateManager.setLoading.bind(stateManager);
        stateManager.setLoading = function(title, description, steps) {
            originalShowLoading(title, description, steps);
            
            // Desabilita botões durante loading
            this.disableButtons();
        };
        
        const originalSetIdle = stateManager.setIdle.bind(stateManager);
        stateManager.setIdle = function() {
            originalSetIdle();
            
            // Reabilita botões
            this.enableButtons();
        };
        
        // Adiciona métodos de controle de botões
        stateManager.disableButtons = () => {
            document.querySelectorAll('.btn, .favorites-button, .history-button, .share-button').forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.6';
            });
        };
        
        stateManager.enableButtons = () => {
            document.querySelectorAll('.btn, .favorites-button, .history-button, .share-button').forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
            });
        };
    }
    
    bindGlobalEvents() {
        // Eventos globais para integração
        
        // Teclas de atalho
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S = Salvar nos favoritos
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (favoritesManager) {
                    favoritesManager.addCurrentStamp();
                }
            }
            
            // Ctrl/Cmd + H = Abrir histórico
            if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
                e.preventDefault();
                if (conversationHistory) {
                    conversationHistory.togglePanel();
                }
            }
            
            // Ctrl/Cmd + Shift + S = Compartilhar
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                if (socialSharing) {
                    socialSharing.showSharingPanel();
                }
            }
        });
        
        // Intercepta envio de mensagens para integração
        this.setupMessageIntegration();
    }
    
    setupMessageIntegration() {
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) {
            const originalOnclick = sendBtn.onclick;
            sendBtn.onclick = (e) => {
                // Salva conversa antes de enviar
                if (conversationHistory) {
                    conversationHistory.saveCurrentConversation();
                }
                
                // Chama função original
                if (originalOnclick) {
                    originalOnclick.call(sendBtn, e);
                }
            };
        }
    }
    
    createIntegrationUI() {
        // Cria UI de integração
        this.createQuickActions();
        this.createStatusBar();
        this.createKeyboardShortcuts();
    }
    
    createQuickActions() {
        const quickActions = document.createElement('div');
        quickActions.className = 'quick-actions';
        quickActions.innerHTML = `
            <div class="quick-actions-panel">
                <button class="quick-action" onclick="favoritesManager.addCurrentStamp()" title="Salvar nos favoritos (Ctrl+S)">
                    ⭐
                </button>
                <button class="quick-action" onclick="conversationHistory.togglePanel()" title="Histórico (Ctrl+H)">
                    💬
                </button>
                <button class="quick-action" onclick="socialSharing.showSharingPanel()" title="Compartilhar (Ctrl+Shift+S)">
                    📤
                </button>
                <button class="quick-action" onclick="conversationHistory.startNewConversation()" title="Nova conversa">
                    ➕
                </button>
            </div>
        `;
        
        // Adiciona estilos
        const style = document.createElement('style');
        style.textContent = `
            .quick-actions {
                position: fixed;
                bottom: var(--space-4);
                left: 50%;
                transform: translateX(-50%);
                z-index: 100;
            }
            
            .quick-actions-panel {
                display: flex;
                gap: var(--space-2);
                background: white;
                border: 1px solid var(--gray-200);
                border-radius: var(--radius-xl);
                padding: var(--space-2);
                box-shadow: var(--shadow-lg);
                backdrop-filter: blur(10px);
            }
            
            .quick-action {
                width: 40px;
                height: 40px;
                border: none;
                border-radius: var(--radius-lg);
                background: var(--gray-100);
                color: var(--gray-600);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-base);
                transition: all var(--transition-fast);
            }
            
            .quick-action:hover {
                background: var(--primary-100);
                color: var(--primary-600);
                transform: translateY(-2px);
            }
            
            @media (max-width: 768px) {
                .quick-actions {
                    bottom: var(--space-3);
                }
                
                .quick-action {
                    width: 36px;
                    height: 36px;
                    font-size: var(--font-size-sm);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(quickActions);
    }
    
    createStatusBar() {
        const statusBar = document.createElement('div');
        statusBar.className = 'integration-status-bar';
        statusBar.innerHTML = `
            <div class="status-bar-content">
                <div class="status-item">
                    <span class="status-icon">💾</span>
                    <span class="status-text" id="favoritesStatus">0 favoritos</span>
                </div>
                <div class="status-item">
                    <span class="status-icon">💬</span>
                    <span class="status-text" id="historyStatus">0 conversas</span>
                </div>
                <div class="status-item">
                    <span class="status-icon">📤</span>
                    <span class="status-text" id="shareStatus">0 compartilhamentos</span>
                </div>
            </div>
        `;
        
        // Adiciona estilos
        const style = document.createElement('style');
        style.textContent = `
            .integration-status-bar {
                position: fixed;
                top: var(--space-4);
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid var(--gray-200);
                border-radius: var(--radius-xl);
                padding: var(--space-3) var(--space-4);
                box-shadow: var(--shadow-md);
                z-index: 100;
                opacity: 0;
                visibility: hidden;
                transition: all var(--transition-fast);
            }
            
            .integration-status-bar.show {
                opacity: 1;
                visibility: visible;
            }
            
            .status-bar-content {
                display: flex;
                gap: var(--space-4);
                align-items: center;
            }
            
            .status-item {
                display: flex;
                align-items: center;
                gap: var(--space-2);
                font-size: var(--font-size-sm);
                color: var(--gray-600);
            }
            
            .status-icon {
                font-size: var(--font-size-base);
            }
            
            @media (max-width: 768px) {
                .integration-status-bar {
                    top: var(--space-3);
                    padding: var(--space-2) var(--space-3);
                }
                
                .status-bar-content {
                    gap: var(--space-2);
                }
                
                .status-item {
                    font-size: var(--font-size-xs);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(statusBar);
        
        // Atualiza status periodicamente
        this.updateStatusBar();
        setInterval(() => this.updateStatusBar(), 5000);
    }
    
    updateStatusBar() {
        const favoritesStatus = document.getElementById('favoritesStatus');
        const historyStatus = document.getElementById('historyStatus');
        const shareStatus = document.getElementById('shareStatus');
        
        if (favoritesStatus && favoritesManager) {
            const count = favoritesManager.favorites.length;
            favoritesStatus.textContent = `${count} favorito${count !== 1 ? 's' : ''}`;
        }
        
        if (historyStatus && conversationHistory) {
            const count = conversationHistory.conversations.length;
            historyStatus.textContent = `${count} conversa${count !== 1 ? 's' : ''}`;
        }
        
        if (shareStatus && socialSharing) {
            const stats = socialSharing.getShareStats();
            const count = stats.total || 0;
            shareStatus.textContent = `${count} compartilhamento${count !== 1 ? 's' : ''}`;
        }
    }
    
    createKeyboardShortcuts() {
        const shortcuts = document.createElement('div');
        shortcuts.className = 'keyboard-shortcuts';
        shortcuts.innerHTML = `
            <div class="shortcuts-panel">
                <h4>⌨️ Atalhos de Teclado</h4>
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>S</kbd>
                        <span>Salvar nos favoritos</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>H</kbd>
                        <span>Abrir histórico</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>
                        <span>Compartilhar</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Esc</kbd>
                        <span>Fechar painéis</span>
                    </div>
                </div>
            </div>
        `;
        
        // Adiciona estilos
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-shortcuts {
                position: fixed;
                bottom: var(--space-4);
                right: var(--space-4);
                z-index: 100;
                opacity: 0;
                visibility: hidden;
                transition: all var(--transition-fast);
            }
            
            .keyboard-shortcuts.show {
                opacity: 1;
                visibility: visible;
            }
            
            .shortcuts-panel {
                background: white;
                border: 1px solid var(--gray-200);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                box-shadow: var(--shadow-lg);
                max-width: 250px;
            }
            
            .shortcuts-panel h4 {
                font-size: var(--font-size-sm);
                font-weight: 600;
                color: var(--gray-900);
                margin-bottom: var(--space-3);
            }
            
            .shortcuts-list {
                display: flex;
                flex-direction: column;
                gap: var(--space-2);
            }
            
            .shortcut-item {
                display: flex;
                align-items: center;
                gap: var(--space-2);
                font-size: var(--font-size-xs);
                color: var(--gray-600);
            }
            
            kbd {
                background: var(--gray-100);
                border: 1px solid var(--gray-300);
                border-radius: var(--radius-sm);
                padding: var(--space-1) var(--space-2);
                font-size: var(--font-size-xs);
                font-family: monospace;
                color: var(--gray-700);
            }
            
            @media (max-width: 768px) {
                .keyboard-shortcuts {
                    bottom: var(--space-3);
                    right: var(--space-3);
                }
                
                .shortcuts-panel {
                    padding: var(--space-3);
                    max-width: 200px;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(shortcuts);
        
        // Mostra atalhos com Ctrl+?
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '?') {
                e.preventDefault();
                shortcuts.classList.toggle('show');
            }
        });
    }
    
    // Métodos públicos para integração
    addConversationToFavorites(conversationId) {
        if (conversationHistory && favoritesManager) {
            const conversation = conversationHistory.conversations.find(c => c.id === conversationId);
            if (conversation) {
                // Adiciona cada mensagem da conversa como favorito
                conversation.messages.forEach((msg, index) => {
                    if (msg.type === 'user') {
                        favoritesManager.addFavorite({
                            title: `Conversa: ${conversation.title}`,
                            description: msg.content,
                            prompt: msg.content,
                            timestamp: conversation.timestamp
                        });
                    }
                });
                
                if (stateManager) {
                    stateManager.showSuccessNotification('Adicionado!', 'Conversa salva nos favoritos');
                }
            }
        }
    }
    
    // Método para reiniciar onboarding
    restartOnboarding() {
        if (onboarding) {
            onboarding.restart();
        }
    }
    
    // Método para limpar todos os dados
    clearAllData() {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            localStorage.removeItem('estampai_favorites');
            localStorage.removeItem('estampai_conversations');
            localStorage.removeItem('estampai_share_stats');
            localStorage.removeItem('estampai_onboarding_completed');
            
            // Recarrega a página
            window.location.reload();
        }
    }
}

// Inicializa a integração
let estampaiIntegration;
document.addEventListener('DOMContentLoaded', () => {
    estampaiIntegration = new EstampAIIntegration();
});

// Métodos globais
window.restartOnboarding = () => estampaiIntegration.restartOnboarding();
window.clearAllData = () => estampaiIntegration.clearAllData();

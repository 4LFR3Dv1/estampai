/**
 * Sistema de Histórico de Conversas - EstampAI
 * Gerencia conversas persistentes com localStorage
 */

class ConversationHistory {
    constructor() {
        this.storageKey = 'estampai_conversations';
        this.currentConversationId = null;
        this.conversations = this.loadConversations();
        this.maxConversations = 20; // Limite de conversas salvas
        
        this.init();
    }
    
    init() {
        this.createStyles();
        this.createHistoryUI();
        this.bindEvents();
        this.startNewConversation();
    }
    
    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* History Panel */
            .history-panel {
                position: fixed;
                top: 0;
                left: -400px;
                width: 400px;
                height: 100vh;
                background: white;
                box-shadow: var(--shadow-xl);
                z-index: 1000;
                transition: left 0.3s ease;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .history-panel.open {
                left: 0;
            }
            
            .history-header {
                padding: var(--space-6);
                border-bottom: 1px solid var(--gray-200);
                background: linear-gradient(135deg, var(--secondary-50), var(--primary-50));
            }
            
            .history-title {
                display: flex;
                align-items: center;
                gap: var(--space-3);
                margin-bottom: var(--space-2);
            }
            
            .history-title h3 {
                font-size: var(--font-size-xl);
                font-weight: 600;
                color: var(--gray-900);
            }
            
            .history-count {
                background: var(--secondary-100);
                color: var(--secondary-700);
                padding: var(--space-1) var(--space-3);
                border-radius: var(--radius-full);
                font-size: var(--font-size-sm);
                font-weight: 500;
            }
            
            .history-actions {
                display: flex;
                gap: var(--space-2);
                margin-top: var(--space-4);
            }
            
            .history-content {
                flex: 1;
                overflow-y: auto;
                padding: var(--space-4);
            }
            
            .history-empty {
                text-align: center;
                padding: var(--space-8);
                color: var(--gray-500);
            }
            
            .history-empty-icon {
                font-size: var(--font-size-4xl);
                margin-bottom: var(--space-4);
                opacity: 0.5;
            }
            
            .history-empty h4 {
                font-size: var(--font-size-lg);
                font-weight: 600;
                margin-bottom: var(--space-2);
            }
            
            .history-empty p {
                font-size: var(--font-size-sm);
                line-height: 1.5;
            }
            
            /* Conversation Item */
            .conversation-item {
                background: white;
                border: 1px solid var(--gray-200);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                margin-bottom: var(--space-4);
                transition: all var(--transition-fast);
                cursor: pointer;
                position: relative;
            }
            
            .conversation-item:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-md);
                border-color: var(--secondary-300);
            }
            
            .conversation-item.active {
                border-color: var(--secondary-500);
                background: var(--secondary-50);
            }
            
            .conversation-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: var(--space-3);
            }
            
            .conversation-info {
                flex: 1;
            }
            
            .conversation-title {
                font-size: var(--font-size-base);
                font-weight: 600;
                color: var(--gray-900);
                margin-bottom: var(--space-1);
                line-height: 1.3;
            }
            
            .conversation-date {
                font-size: var(--font-size-xs);
                color: var(--gray-500);
            }
            
            .conversation-actions {
                display: flex;
                gap: var(--space-1);
            }
            
            .conversation-action {
                width: 28px;
                height: 28px;
                border: none;
                border-radius: var(--radius-md);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all var(--transition-fast);
                font-size: var(--font-size-xs);
            }
            
            .conversation-action:hover {
                transform: scale(1.1);
            }
            
            .conversation-delete {
                background: var(--error-100);
                color: var(--error-600);
            }
            
            .conversation-delete:hover {
                background: var(--error-200);
            }
            
            .conversation-export {
                background: var(--success-100);
                color: var(--success-600);
            }
            
            .conversation-export:hover {
                background: var(--success-200);
            }
            
            .conversation-preview {
                background: var(--gray-50);
                border-radius: var(--radius-md);
                padding: var(--space-3);
                margin-bottom: var(--space-3);
                max-height: 100px;
                overflow: hidden;
            }
            
            .conversation-preview-message {
                font-size: var(--font-size-sm);
                color: var(--gray-600);
                margin-bottom: var(--space-2);
                display: flex;
                align-items: center;
                gap: var(--space-2);
            }
            
            .conversation-preview-message:last-child {
                margin-bottom: 0;
            }
            
            .conversation-preview-avatar {
                width: 20px;
                height: 20px;
                border-radius: var(--radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-xs);
                flex-shrink: 0;
            }
            
            .conversation-preview-avatar.user {
                background: var(--primary-100);
                color: var(--primary-600);
            }
            
            .conversation-preview-avatar.ai {
                background: var(--secondary-100);
                color: var(--secondary-600);
            }
            
            .conversation-stats {
                display: flex;
                gap: var(--space-4);
                font-size: var(--font-size-xs);
                color: var(--gray-500);
            }
            
            .conversation-stat {
                display: flex;
                align-items: center;
                gap: var(--space-1);
            }
            
            /* History Button */
            .history-button {
                position: fixed;
                top: 50%;
                left: var(--space-4);
                transform: translateY(-50%);
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, var(--secondary-500), var(--primary-500));
                color: white;
                border: none;
                border-radius: var(--radius-full);
                box-shadow: var(--shadow-lg);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-lg);
                transition: all var(--transition-fast);
                z-index: 999;
            }
            
            .history-button:hover {
                transform: translateY(-50%) scale(1.1);
                box-shadow: var(--shadow-xl);
            }
            
            .history-button .badge {
                position: absolute;
                top: -4px;
                right: -4px;
                background: var(--error-500);
                color: white;
                border-radius: var(--radius-full);
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-xs);
                font-weight: 600;
            }
            
            /* Current Conversation Indicator */
            .current-conversation {
                position: fixed;
                bottom: var(--space-4);
                left: 50%;
                transform: translateX(-50%);
                background: white;
                border: 1px solid var(--gray-200);
                border-radius: var(--radius-lg);
                padding: var(--space-3) var(--space-4);
                box-shadow: var(--shadow-md);
                z-index: 100;
                display: flex;
                align-items: center;
                gap: var(--space-2);
                font-size: var(--font-size-sm);
                color: var(--gray-600);
                max-width: 300px;
                opacity: 0;
                visibility: hidden;
                transition: all var(--transition-fast);
            }
            
            .current-conversation.show {
                opacity: 1;
                visibility: visible;
            }
            
            .current-conversation-icon {
                width: 24px;
                height: 24px;
                background: var(--primary-100);
                color: var(--primary-600);
                border-radius: var(--radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-xs);
            }
            
            /* New Conversation Button */
            .new-conversation-btn {
                background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
                color: white;
                border: none;
                border-radius: var(--radius-lg);
                padding: var(--space-3) var(--space-4);
                font-size: var(--font-size-sm);
                font-weight: 500;
                cursor: pointer;
                transition: all var(--transition-fast);
                display: flex;
                align-items: center;
                gap: var(--space-2);
            }
            
            .new-conversation-btn:hover {
                transform: translateY(-1px);
                box-shadow: var(--shadow-md);
            }
            
            /* Search */
            .history-search {
                margin-bottom: var(--space-4);
            }
            
            .history-search input {
                width: 100%;
                padding: var(--space-3) var(--space-4);
                border: 1px solid var(--gray-300);
                border-radius: var(--radius-lg);
                font-size: var(--font-size-sm);
                background: white;
            }
            
            .history-search input:focus {
                outline: none;
                border-color: var(--secondary-500);
                box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
            }
            
            /* Mobile responsive */
            @media (max-width: 768px) {
                .history-panel {
                    width: 100%;
                    left: -100%;
                }
                
                .history-button {
                    left: var(--space-3);
                    width: 48px;
                    height: 48px;
                    font-size: var(--font-size-base);
                }
                
                .conversation-item {
                    padding: var(--space-3);
                }
                
                .current-conversation {
                    left: var(--space-4);
                    right: var(--space-4);
                    transform: none;
                    max-width: none;
                }
            }
            
            /* Animations */
            @keyframes slideInLeft {
                from { transform: translateX(-100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .conversation-item {
                animation: slideInLeft 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    createHistoryUI() {
        // Botão flutuante
        this.historyButton = document.createElement('button');
        this.historyButton.className = 'history-button';
        this.historyButton.innerHTML = `
            <span>💬</span>
            ${this.conversations.length > 0 ? `<span class="badge">${this.conversations.length}</span>` : ''}
        `;
        this.historyButton.onclick = () => this.togglePanel();
        
        // Panel de histórico
        this.historyPanel = document.createElement('div');
        this.historyPanel.className = 'history-panel';
        this.historyPanel.innerHTML = `
            <div class="history-header">
                <div class="history-title">
                    <h3>💬 Histórico</h3>
                    <span class="history-count">${this.conversations.length}</span>
                </div>
                <div class="history-actions">
                    <button class="new-conversation-btn" onclick="conversationHistory.startNewConversation()">
                        ➕ Nova Conversa
                    </button>
                </div>
            </div>
            <div class="history-content" id="historyContent">
                ${this.renderConversations()}
            </div>
        `;
        
        // Indicador de conversa atual
        this.currentConversationIndicator = document.createElement('div');
        this.currentConversationIndicator.className = 'current-conversation';
        this.currentConversationIndicator.innerHTML = `
            <div class="current-conversation-icon">💬</div>
            <span>Conversa atual: <strong id="currentConversationTitle">Nova conversa</strong></span>
        `;
        
        document.body.appendChild(this.historyButton);
        document.body.appendChild(this.historyPanel);
        document.body.appendChild(this.currentConversationIndicator);
    }
    
    bindEvents() {
        // Fecha o panel ao clicar fora
        document.addEventListener('click', (e) => {
            if (!this.historyPanel.contains(e.target) && 
                !this.historyButton.contains(e.target) && 
                this.historyPanel.classList.contains('open')) {
                this.closePanel();
            }
        });
        
        // ESC para fechar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.historyPanel.classList.contains('open')) {
                this.closePanel();
            }
        });
        
        // Salva mensagens automaticamente
        this.setupAutoSave();
    }
    
    setupAutoSave() {
        // Intercepta mensagens sendo adicionadas ao chat
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (type === 'click' && this.id === 'sendBtn') {
                const originalListener = listener;
                listener = function(e) {
                    originalListener.call(this, e);
                    // Salva a conversa após enviar mensagem
                    setTimeout(() => {
                        conversationHistory.saveCurrentConversation();
                    }, 1000);
                };
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    }
    
    loadConversations() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Erro ao carregar conversas:', error);
            return [];
        }
    }
    
    saveConversations() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.conversations));
            this.updateUI();
        } catch (error) {
            console.error('Erro ao salvar conversas:', error);
            if (stateManager) {
                stateManager.showErrorNotification('Erro', 'Não foi possível salvar o histórico');
            }
        }
    }
    
    startNewConversation() {
        this.currentConversationId = Date.now().toString();
        this.updateCurrentConversationIndicator('Nova conversa');
        
        if (stateManager) {
            stateManager.showInfoNotification('Nova conversa', 'Começando uma nova conversa');
        }
    }
    
    saveCurrentConversation() {
        const messages = this.getCurrentMessages();
        if (messages.length === 0) return;
        
        const conversation = {
            id: this.currentConversationId,
            title: this.generateConversationTitle(messages),
            messages: messages,
            timestamp: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            messageCount: messages.length,
            stampCount: messages.filter(msg => msg.type === 'stamp').length
        };
        
        // Remove conversa existente se houver
        this.conversations = this.conversations.filter(conv => conv.id !== this.currentConversationId);
        
        // Adiciona nova conversa no início
        this.conversations.unshift(conversation);
        
        // Limita o número de conversas
        if (this.conversations.length > this.maxConversations) {
            this.conversations = this.conversations.slice(0, this.maxConversations);
        }
        
        this.saveConversations();
    }
    
    getCurrentMessages() {
        const messagesContainer = document.getElementById('messages');
        if (!messagesContainer) return [];
        
        const messages = [];
        const messageElements = messagesContainer.querySelectorAll('.message');
        
        messageElements.forEach((element, index) => {
            const isUser = element.classList.contains('user');
            const content = element.querySelector('.message-content');
            const text = content ? content.textContent.trim() : '';
            
            if (text) {
                messages.push({
                    id: index,
                    type: isUser ? 'user' : 'ai',
                    content: text,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        return messages;
    }
    
    generateConversationTitle(messages) {
        if (messages.length === 0) return 'Conversa vazia';
        
        const firstUserMessage = messages.find(msg => msg.type === 'user');
        if (firstUserMessage) {
            const title = firstUserMessage.content.substring(0, 50);
            return title.length < firstUserMessage.content.length ? title + '...' : title;
        }
        
        return `Conversa de ${new Date().toLocaleDateString('pt-BR')}`;
    }
    
    loadConversation(id) {
        const conversation = this.conversations.find(conv => conv.id === id);
        if (!conversation) return false;
        
        this.currentConversationId = id;
        this.updateCurrentConversationIndicator(conversation.title);
        
        // Limpa mensagens atuais
        const messagesContainer = document.getElementById('messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            
            // Adiciona mensagens da conversa
            conversation.messages.forEach(msg => {
                this.addMessageToChat(msg.content, msg.type === 'user');
            });
        }
        
        this.closePanel();
        
        if (stateManager) {
            stateManager.showSuccessNotification('Conversa carregada', conversation.title);
        }
        
        return true;
    }
    
    addMessageToChat(content, isUser) {
        const messagesContainer = document.getElementById('messages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
        
        const avatar = isUser ? '👤' : '🤖';
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">${content}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    deleteConversation(id) {
        const index = this.conversations.findIndex(conv => conv.id === id);
        if (index !== -1) {
            this.conversations.splice(index, 1);
            this.saveConversations();
            
            if (stateManager) {
                stateManager.showInfoNotification('Removido', 'Conversa removida do histórico');
            }
            
            return true;
        }
        return false;
    }
    
    exportConversation(id) {
        const conversation = this.conversations.find(conv => conv.id === id);
        if (!conversation) return;
        
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            conversation: conversation
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `conversa-${conversation.title.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        if (stateManager) {
            stateManager.showSuccessNotification('Exportado!', 'Conversa exportada com sucesso');
        }
    }
    
    renderConversations() {
        if (this.conversations.length === 0) {
            return `
                <div class="history-empty">
                    <div class="history-empty-icon">💬</div>
                    <h4>Nenhuma conversa ainda</h4>
                    <p>Suas conversas com a IA serão salvas automaticamente aqui.</p>
                </div>
            `;
        }
        
        return this.conversations.map(conversation => `
            <div class="conversation-item ${conversation.id === this.currentConversationId ? 'active' : ''}" 
                 data-id="${conversation.id}" 
                 onclick="conversationHistory.loadConversation('${conversation.id}')">
                <div class="conversation-header">
                    <div class="conversation-info">
                        <div class="conversation-title">${conversation.title}</div>
                        <div class="conversation-date">${this.formatDate(conversation.lastActivity)}</div>
                    </div>
                    <div class="conversation-actions" onclick="event.stopPropagation()">
                        <button class="conversation-action conversation-export" 
                                onclick="conversationHistory.exportConversation('${conversation.id}')" 
                                title="Exportar">
                            📤
                        </button>
                        <button class="conversation-action conversation-delete" 
                                onclick="conversationHistory.deleteConversation('${conversation.id}')" 
                                title="Excluir">
                            🗑️
                        </button>
                    </div>
                </div>
                <div class="conversation-preview">
                    ${conversation.messages.slice(0, 2).map(msg => `
                        <div class="conversation-preview-message">
                            <div class="conversation-preview-avatar ${msg.type}">
                                ${msg.type === 'user' ? '👤' : '🤖'}
                            </div>
                            <span>${msg.content.substring(0, 60)}${msg.content.length > 60 ? '...' : ''}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="conversation-stats">
                    <div class="conversation-stat">
                        <span>💬</span>
                        <span>${conversation.messageCount} mensagens</span>
                    </div>
                    <div class="conversation-stat">
                        <span>🎨</span>
                        <span>${conversation.stampCount} estampas</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    updateUI() {
        // Atualiza o contador no botão
        const badge = this.historyButton.querySelector('.badge');
        if (this.conversations.length > 0) {
            if (!badge) {
                this.historyButton.innerHTML += `<span class="badge">${this.conversations.length}</span>`;
            } else {
                badge.textContent = this.conversations.length;
            }
        } else if (badge) {
            badge.remove();
        }
        
        // Atualiza o conteúdo do panel
        const content = document.getElementById('historyContent');
        if (content) {
            content.innerHTML = this.renderConversations();
        }
        
        // Atualiza o contador no header
        const countElement = document.querySelector('.history-count');
        if (countElement) {
            countElement.textContent = this.conversations.length;
        }
    }
    
    updateCurrentConversationIndicator(title) {
        const titleElement = document.getElementById('currentConversationTitle');
        if (titleElement) {
            titleElement.textContent = title;
        }
        
        // Mostra o indicador por alguns segundos
        this.currentConversationIndicator.classList.add('show');
        setTimeout(() => {
            this.currentConversationIndicator.classList.remove('show');
        }, 3000);
    }
    
    togglePanel() {
        this.historyPanel.classList.toggle('open');
    }
    
    openPanel() {
        this.historyPanel.classList.add('open');
    }
    
    closePanel() {
        this.historyPanel.classList.remove('open');
    }
    
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // Menos de 1 minuto
            return 'Agora mesmo';
        } else if (diff < 3600000) { // Menos de 1 hora
            const minutes = Math.floor(diff / 60000);
            return `${minutes} min atrás`;
        } else if (diff < 86400000) { // Menos de 1 dia
            const hours = Math.floor(diff / 3600000);
            return `${hours}h atrás`;
        } else {
            return date.toLocaleDateString('pt-BR');
        }
    }
}

// Inicializa o gerenciador de histórico
let conversationHistory;
document.addEventListener('DOMContentLoaded', () => {
    conversationHistory = new ConversationHistory();
});

// Métodos globais
window.toggleHistory = () => conversationHistory.togglePanel();
window.newConversation = () => conversationHistory.startNewConversation();

/**
 * Sistema de Favoritos - EstampAI
 * Gerencia estampas favoritas com localStorage
 */

class FavoritesManager {
    constructor() {
        this.storageKey = 'estampai_favorites';
        this.favorites = this.loadFavorites();
        this.maxFavorites = 50; // Limite de favoritos
        
        this.init();
    }
    
    init() {
        this.createStyles();
        this.createFavoritesUI();
        this.bindEvents();
    }
    
    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Favorites Panel */
            .favorites-panel {
                position: fixed;
                top: 0;
                right: -400px;
                width: 400px;
                height: 100vh;
                background: white;
                box-shadow: var(--shadow-xl);
                z-index: 1000;
                transition: right 0.3s ease;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .favorites-panel.open {
                right: 0;
            }
            
            .favorites-header {
                padding: var(--space-6);
                border-bottom: 1px solid var(--gray-200);
                background: linear-gradient(135deg, var(--primary-50), var(--secondary-50));
            }
            
            .favorites-title {
                display: flex;
                align-items: center;
                gap: var(--space-3);
                margin-bottom: var(--space-2);
            }
            
            .favorites-title h3 {
                font-size: var(--font-size-xl);
                font-weight: 600;
                color: var(--gray-900);
            }
            
            .favorites-count {
                background: var(--primary-100);
                color: var(--primary-700);
                padding: var(--space-1) var(--space-3);
                border-radius: var(--radius-full);
                font-size: var(--font-size-sm);
                font-weight: 500;
            }
            
            .favorites-actions {
                display: flex;
                gap: var(--space-2);
                margin-top: var(--space-4);
            }
            
            .favorites-content {
                flex: 1;
                overflow-y: auto;
                padding: var(--space-4);
            }
            
            .favorites-empty {
                text-align: center;
                padding: var(--space-8);
                color: var(--gray-500);
            }
            
            .favorites-empty-icon {
                font-size: var(--font-size-4xl);
                margin-bottom: var(--space-4);
                opacity: 0.5;
            }
            
            .favorites-empty h4 {
                font-size: var(--font-size-lg);
                font-weight: 600;
                margin-bottom: var(--space-2);
            }
            
            .favorites-empty p {
                font-size: var(--font-size-sm);
                line-height: 1.5;
            }
            
            /* Favorite Item */
            .favorite-item {
                background: white;
                border: 1px solid var(--gray-200);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                margin-bottom: var(--space-4);
                transition: all var(--transition-fast);
                position: relative;
            }
            
            .favorite-item:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-md);
                border-color: var(--primary-300);
            }
            
            .favorite-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: var(--space-3);
            }
            
            .favorite-info {
                flex: 1;
            }
            
            .favorite-title {
                font-size: var(--font-size-base);
                font-weight: 600;
                color: var(--gray-900);
                margin-bottom: var(--space-1);
                line-height: 1.3;
            }
            
            .favorite-date {
                font-size: var(--font-size-xs);
                color: var(--gray-500);
            }
            
            .favorite-actions {
                display: flex;
                gap: var(--space-1);
            }
            
            .favorite-action {
                width: 32px;
                height: 32px;
                border: none;
                border-radius: var(--radius-md);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all var(--transition-fast);
                font-size: var(--font-size-sm);
            }
            
            .favorite-action:hover {
                transform: scale(1.1);
            }
            
            .favorite-remove {
                background: var(--error-100);
                color: var(--error-600);
            }
            
            .favorite-remove:hover {
                background: var(--error-200);
            }
            
            .favorite-download {
                background: var(--success-100);
                color: var(--success-600);
            }
            
            .favorite-download:hover {
                background: var(--success-200);
            }
            
            .favorite-share {
                background: var(--primary-100);
                color: var(--primary-600);
            }
            
            .favorite-share:hover {
                background: var(--primary-200);
            }
            
            .favorite-preview {
                width: 100%;
                height: 120px;
                background: var(--gray-100);
                border-radius: var(--radius-md);
                margin-bottom: var(--space-3);
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                position: relative;
            }
            
            .favorite-preview img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: var(--radius-md);
            }
            
            .favorite-preview-placeholder {
                color: var(--gray-400);
                font-size: var(--font-size-2xl);
            }
            
            .favorite-tags {
                display: flex;
                gap: var(--space-1);
                flex-wrap: wrap;
            }
            
            .favorite-tag {
                background: var(--gray-100);
                color: var(--gray-600);
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-full);
                font-size: var(--font-size-xs);
                font-weight: 500;
            }
            
            /* Favorites Button */
            .favorites-button {
                position: fixed;
                top: 50%;
                right: var(--space-4);
                transform: translateY(-50%);
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
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
            
            .favorites-button:hover {
                transform: translateY(-50%) scale(1.1);
                box-shadow: var(--shadow-xl);
            }
            
            .favorites-button .badge {
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
            
            /* Search and Filter */
            .favorites-search {
                margin-bottom: var(--space-4);
            }
            
            .favorites-search input {
                width: 100%;
                padding: var(--space-3) var(--space-4);
                border: 1px solid var(--gray-300);
                border-radius: var(--radius-lg);
                font-size: var(--font-size-sm);
                background: white;
            }
            
            .favorites-search input:focus {
                outline: none;
                border-color: var(--primary-500);
                box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
            }
            
            .favorites-filters {
                display: flex;
                gap: var(--space-2);
                margin-bottom: var(--space-4);
                flex-wrap: wrap;
            }
            
            .filter-chip {
                padding: var(--space-2) var(--space-3);
                border: 1px solid var(--gray-300);
                border-radius: var(--radius-full);
                background: white;
                color: var(--gray-600);
                font-size: var(--font-size-xs);
                cursor: pointer;
                transition: all var(--transition-fast);
            }
            
            .filter-chip.active {
                background: var(--primary-500);
                color: white;
                border-color: var(--primary-500);
            }
            
            .filter-chip:hover:not(.active) {
                background: var(--gray-100);
            }
            
            /* Mobile responsive */
            @media (max-width: 768px) {
                .favorites-panel {
                    width: 100%;
                    right: -100%;
                }
                
                .favorites-button {
                    right: var(--space-3);
                    width: 48px;
                    height: 48px;
                    font-size: var(--font-size-base);
                }
                
                .favorite-item {
                    padding: var(--space-3);
                }
                
                .favorite-preview {
                    height: 100px;
                }
            }
            
            /* Animations */
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .favorite-item {
                animation: slideInRight 0.3s ease;
            }
            
            /* Export/Import */
            .favorites-export {
                background: var(--success-100);
                color: var(--success-700);
                border: 1px solid var(--success-200);
                padding: var(--space-2) var(--space-4);
                border-radius: var(--radius-lg);
                font-size: var(--font-size-sm);
                cursor: pointer;
                transition: all var(--transition-fast);
            }
            
            .favorites-export:hover {
                background: var(--success-200);
            }
            
            .favorites-import {
                background: var(--primary-100);
                color: var(--primary-700);
                border: 1px solid var(--primary-200);
                padding: var(--space-2) var(--space-4);
                border-radius: var(--radius-lg);
                font-size: var(--font-size-sm);
                cursor: pointer;
                transition: all var(--transition-fast);
            }
            
            .favorites-import:hover {
                background: var(--primary-200);
            }
        `;
        document.head.appendChild(style);
    }
    
    createFavoritesUI() {
        // Botão flutuante
        this.favoritesButton = document.createElement('button');
        this.favoritesButton.className = 'favorites-button';
        this.favoritesButton.innerHTML = `
            <span>⭐</span>
            ${this.favorites.length > 0 ? `<span class="badge">${this.favorites.length}</span>` : ''}
        `;
        this.favoritesButton.onclick = () => this.togglePanel();
        
        // Panel de favoritos
        this.favoritesPanel = document.createElement('div');
        this.favoritesPanel.className = 'favorites-panel';
        this.favoritesPanel.innerHTML = `
            <div class="favorites-header">
                <div class="favorites-title">
                    <h3>⭐ Favoritos</h3>
                    <span class="favorites-count">${this.favorites.length}</span>
                </div>
                <div class="favorites-actions">
                    <button class="favorites-export" onclick="favoritesManager.exportFavorites()">
                        📤 Exportar
                    </button>
                    <button class="favorites-import" onclick="favoritesManager.importFavorites()">
                        📥 Importar
                    </button>
                </div>
            </div>
            <div class="favorites-content" id="favoritesContent">
                ${this.renderFavorites()}
            </div>
        `;
        
        document.body.appendChild(this.favoritesButton);
        document.body.appendChild(this.favoritesPanel);
    }
    
    bindEvents() {
        // Fecha o panel ao clicar fora
        document.addEventListener('click', (e) => {
            if (!this.favoritesPanel.contains(e.target) && 
                !this.favoritesButton.contains(e.target) && 
                this.favoritesPanel.classList.contains('open')) {
                this.closePanel();
            }
        });
        
        // ESC para fechar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.favoritesPanel.classList.contains('open')) {
                this.closePanel();
            }
        });
    }
    
    loadFavorites() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
            return [];
        }
    }
    
    saveFavorites() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
            this.updateUI();
        } catch (error) {
            console.error('Erro ao salvar favoritos:', error);
            if (stateManager) {
                stateManager.showErrorNotification('Erro', 'Não foi possível salvar os favoritos');
            }
        }
    }
    
    addFavorite(stampData) {
        if (this.favorites.length >= this.maxFavorites) {
            if (stateManager) {
                stateManager.showWarningNotification(
                    'Limite atingido', 
                    `Você pode ter no máximo ${this.maxFavorites} favoritos. Remova alguns para adicionar novos.`
                );
            }
            return false;
        }
        
        const favorite = {
            id: Date.now().toString(),
            title: stampData.title || 'Estampa sem título',
            description: stampData.description || '',
            imageUrl: stampData.imageUrl || '',
            prompt: stampData.prompt || '',
            tags: this.extractTags(stampData.prompt || ''),
            timestamp: new Date().toISOString(),
            metadata: {
                size: stampData.size || '1024x1024',
                model: stampData.model || 'dall-e-3',
                style: stampData.style || 'unknown'
            }
        };
        
        this.favorites.unshift(favorite);
        this.saveFavorites();
        
        if (stateManager) {
            stateManager.showSuccessNotification('Adicionado!', 'Estampa salva nos favoritos');
        }
        
        return true;
    }
    
    removeFavorite(id) {
        const index = this.favorites.findIndex(fav => fav.id === id);
        if (index !== -1) {
            this.favorites.splice(index, 1);
            this.saveFavorites();
            
            if (stateManager) {
                stateManager.showInfoNotification('Removido', 'Estampa removida dos favoritos');
            }
            
            return true;
        }
        return false;
    }
    
    getFavorite(id) {
        return this.favorites.find(fav => fav.id === id);
    }
    
    extractTags(prompt) {
        const commonTags = [
            'minimalista', 'vintage', 'moderno', 'colorido', 'preto e branco',
            'animais', 'natureza', 'abstrato', 'geometrico', 'tipografia',
            'fofo', 'elegante', 'divertido', 'serio', 'artistico'
        ];
        
        const tags = [];
        const lowerPrompt = prompt.toLowerCase();
        
        commonTags.forEach(tag => {
            if (lowerPrompt.includes(tag)) {
                tags.push(tag);
            }
        });
        
        return tags.slice(0, 3); // Máximo 3 tags
    }
    
    renderFavorites() {
        if (this.favorites.length === 0) {
            return `
                <div class="favorites-empty">
                    <div class="favorites-empty-icon">⭐</div>
                    <h4>Nenhum favorito ainda</h4>
                    <p>Adicione estampas aos favoritos clicando no ícone ⭐ quando uma estampa for gerada.</p>
                </div>
            `;
        }
        
        return this.favorites.map(favorite => `
            <div class="favorite-item" data-id="${favorite.id}">
                <div class="favorite-header">
                    <div class="favorite-info">
                        <div class="favorite-title">${favorite.title}</div>
                        <div class="favorite-date">${this.formatDate(favorite.timestamp)}</div>
                    </div>
                    <div class="favorite-actions">
                        <button class="favorite-action favorite-download" onclick="favoritesManager.downloadFavorite('${favorite.id}')" title="Baixar">
                            📥
                        </button>
                        <button class="favorite-action favorite-share" onclick="favoritesManager.shareFavorite('${favorite.id}')" title="Compartilhar">
                            📤
                        </button>
                        <button class="favorite-action favorite-remove" onclick="favoritesManager.removeFavorite('${favorite.id}')" title="Remover">
                            🗑️
                        </button>
                    </div>
                </div>
                <div class="favorite-preview">
                    ${favorite.imageUrl ? 
                        `<img src="${favorite.imageUrl}" alt="${favorite.title}" onerror="this.parentElement.innerHTML='<div class=\\"favorite-preview-placeholder\\">🎨</div>'">` :
                        '<div class="favorite-preview-placeholder">🎨</div>'
                    }
                </div>
                ${favorite.tags.length > 0 ? `
                    <div class="favorite-tags">
                        ${favorite.tags.map(tag => `<span class="favorite-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }
    
    updateUI() {
        // Atualiza o contador no botão
        const badge = this.favoritesButton.querySelector('.badge');
        if (this.favorites.length > 0) {
            if (!badge) {
                this.favoritesButton.innerHTML += `<span class="badge">${this.favorites.length}</span>`;
            } else {
                badge.textContent = this.favorites.length;
            }
        } else if (badge) {
            badge.remove();
        }
        
        // Atualiza o conteúdo do panel
        const content = document.getElementById('favoritesContent');
        if (content) {
            content.innerHTML = this.renderFavorites();
        }
        
        // Atualiza o contador no header
        const countElement = document.querySelector('.favorites-count');
        if (countElement) {
            countElement.textContent = this.favorites.length;
        }
    }
    
    togglePanel() {
        this.favoritesPanel.classList.toggle('open');
    }
    
    openPanel() {
        this.favoritesPanel.classList.add('open');
    }
    
    closePanel() {
        this.favoritesPanel.classList.remove('open');
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
    
    downloadFavorite(id) {
        const favorite = this.getFavorite(id);
        if (!favorite || !favorite.imageUrl) {
            if (stateManager) {
                stateManager.showErrorNotification('Erro', 'Imagem não disponível para download');
            }
            return;
        }
        
        // Cria um link temporário para download
        const link = document.createElement('a');
        link.href = favorite.imageUrl;
        link.download = `estampa-${favorite.title.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        if (stateManager) {
            stateManager.showSuccessNotification('Download iniciado', 'Sua estampa está sendo baixada');
        }
    }
    
    shareFavorite(id) {
        const favorite = this.getFavorite(id);
        if (!favorite) return;
        
        const shareData = {
            title: `Minha estampa: ${favorite.title}`,
            text: `Criei esta estampa com EstampAI: ${favorite.description}`,
            url: favorite.imageUrl
        };
        
        if (navigator.share && navigator.canShare(shareData)) {
            navigator.share(shareData).then(() => {
                if (stateManager) {
                    stateManager.showSuccessNotification('Compartilhado!', 'Estampa compartilhada com sucesso');
                }
            }).catch((error) => {
                console.error('Erro ao compartilhar:', error);
                this.fallbackShare(favorite);
            });
        } else {
            this.fallbackShare(favorite);
        }
    }
    
    fallbackShare(favorite) {
        // Fallback para redes sociais
        const text = encodeURIComponent(`Criei esta estampa com EstampAI: ${favorite.title}`);
        const url = encodeURIComponent(favorite.imageUrl);
        
        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        window.open(twitterUrl, '_blank');
        
        if (stateManager) {
            stateManager.showInfoNotification('Compartilhando', 'Abrindo Twitter para compartilhar');
        }
    }
    
    exportFavorites() {
        if (this.favorites.length === 0) {
            if (stateManager) {
                stateManager.showWarningNotification('Nada para exportar', 'Você não tem favoritos para exportar');
            }
            return;
        }
        
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            favorites: this.favorites
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `estampai-favorites-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        if (stateManager) {
            stateManager.showSuccessNotification('Exportado!', 'Favoritos exportados com sucesso');
        }
    }
    
    importFavorites() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.favorites && Array.isArray(data.favorites)) {
                        const importedCount = data.favorites.length;
                        const availableSlots = this.maxFavorites - this.favorites.length;
                        const toImport = Math.min(importedCount, availableSlots);
                        
                        if (toImport > 0) {
                            this.favorites.push(...data.favorites.slice(0, toImport));
                            this.saveFavorites();
                            
                            if (stateManager) {
                                stateManager.showSuccessNotification(
                                    'Importado!', 
                                    `${toImport} favoritos importados com sucesso`
                                );
                            }
                        } else {
                            if (stateManager) {
                                stateManager.showWarningNotification(
                                    'Limite atingido', 
                                    'Não há espaço para importar favoritos'
                                );
                            }
                        }
                    } else {
                        throw new Error('Formato inválido');
                    }
                } catch (error) {
                    if (stateManager) {
                        stateManager.showErrorNotification('Erro', 'Arquivo de favoritos inválido');
                    }
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
    
    // Método para adicionar favorito da estampa atual
    addCurrentStamp() {
        const canvas = document.getElementById('stampCanvas');
        const messageInput = document.getElementById('messageInput');
        
        if (!canvas || !messageInput) {
            if (stateManager) {
                stateManager.showErrorNotification('Erro', 'Nenhuma estampa para adicionar aos favoritos');
            }
            return;
        }
        
        // Captura a imagem do canvas
        const imageUrl = canvas.toDataURL('image/png');
        const prompt = messageInput.value || 'Estampa gerada';
        
        const stampData = {
            title: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
            description: prompt,
            imageUrl: imageUrl,
            prompt: prompt,
            size: '1024x1024',
            model: 'dall-e-3'
        };
        
        this.addFavorite(stampData);
    }
}

// Inicializa o gerenciador de favoritos
let favoritesManager;
document.addEventListener('DOMContentLoaded', () => {
    favoritesManager = new FavoritesManager();
});

// Métodos globais
window.addToFavorites = () => favoritesManager.addCurrentStamp();
window.toggleFavorites = () => favoritesManager.togglePanel();

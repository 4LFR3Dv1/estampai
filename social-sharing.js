/**
 * Sistema de Compartilhamento Social - EstampAI
 * Integração com redes sociais e compartilhamento nativo
 */

class SocialSharing {
    constructor() {
        this.platforms = {
            twitter: {
                name: 'Twitter',
                icon: '🐦',
                color: '#1DA1F2',
                url: 'https://twitter.com/intent/tweet'
            },
            facebook: {
                name: 'Facebook',
                icon: '📘',
                color: '#4267B2',
                url: 'https://www.facebook.com/sharer/sharer.php'
            },
            instagram: {
                name: 'Instagram',
                icon: '📷',
                color: '#E4405F',
                url: 'https://www.instagram.com'
            },
            whatsapp: {
                name: 'WhatsApp',
                icon: '💬',
                color: '#25D366',
                url: 'https://wa.me'
            },
            telegram: {
                name: 'Telegram',
                icon: '✈️',
                color: '#0088cc',
                url: 'https://t.me/share/url'
            },
            linkedin: {
                name: 'LinkedIn',
                icon: '💼',
                color: '#0077B5',
                url: 'https://www.linkedin.com/sharing/share-offsite'
            },
            pinterest: {
                name: 'Pinterest',
                icon: '📌',
                color: '#BD081C',
                url: 'https://pinterest.com/pin/create/button'
            }
        };
        
        this.init();
    }
    
    init() {
        this.createStyles();
        this.createSharingUI();
        this.bindEvents();
    }
    
    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Sharing Panel */
            .sharing-panel {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(4px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .sharing-panel.open {
                opacity: 1;
                visibility: visible;
            }
            
            .sharing-modal {
                background: white;
                border-radius: var(--radius-2xl);
                padding: var(--space-8);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: var(--shadow-xl);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .sharing-panel.open .sharing-modal {
                transform: scale(1);
            }
            
            .sharing-header {
                text-align: center;
                margin-bottom: var(--space-6);
            }
            
            .sharing-title {
                font-size: var(--font-size-2xl);
                font-weight: 700;
                color: var(--gray-900);
                margin-bottom: var(--space-2);
            }
            
            .sharing-description {
                font-size: var(--font-size-base);
                color: var(--gray-600);
            }
            
            .sharing-preview {
                background: var(--gray-50);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                margin-bottom: var(--space-6);
                border: 1px solid var(--gray-200);
            }
            
            .sharing-preview-image {
                width: 100%;
                height: 200px;
                background: var(--gray-100);
                border-radius: var(--radius-md);
                margin-bottom: var(--space-3);
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }
            
            .sharing-preview-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: var(--radius-md);
            }
            
            .sharing-preview-placeholder {
                color: var(--gray-400);
                font-size: var(--font-size-4xl);
            }
            
            .sharing-preview-text {
                font-size: var(--font-size-sm);
                color: var(--gray-700);
                line-height: 1.4;
            }
            
            .sharing-platforms {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: var(--space-3);
                margin-bottom: var(--space-6);
            }
            
            .sharing-platform {
                background: white;
                border: 2px solid var(--gray-200);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                text-align: center;
                cursor: pointer;
                transition: all var(--transition-fast);
                text-decoration: none;
                color: inherit;
            }
            
            .sharing-platform:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-md);
                border-color: var(--primary-300);
            }
            
            .sharing-platform-icon {
                font-size: var(--font-size-2xl);
                margin-bottom: var(--space-2);
                display: block;
            }
            
            .sharing-platform-name {
                font-size: var(--font-size-sm);
                font-weight: 600;
                color: var(--gray-900);
            }
            
            .sharing-actions {
                display: flex;
                gap: var(--space-3);
                justify-content: center;
            }
            
            .sharing-copy {
                background: var(--gray-100);
                border: 1px solid var(--gray-300);
                border-radius: var(--radius-lg);
                padding: var(--space-3) var(--space-4);
                font-size: var(--font-size-sm);
                color: var(--gray-700);
                cursor: pointer;
                transition: all var(--transition-fast);
                display: flex;
                align-items: center;
                gap: var(--space-2);
            }
            
            .sharing-copy:hover {
                background: var(--gray-200);
            }
            
            .sharing-copy.copied {
                background: var(--success-100);
                border-color: var(--success-300);
                color: var(--success-700);
            }
            
            /* Share Button */
            .share-button {
                position: fixed;
                bottom: var(--space-4);
                right: var(--space-4);
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
                opacity: 0;
                visibility: hidden;
            }
            
            .share-button.show {
                opacity: 1;
                visibility: visible;
            }
            
            .share-button:hover {
                transform: scale(1.1);
                box-shadow: var(--shadow-xl);
            }
            
            /* Native Share */
            .native-share {
                background: linear-gradient(135deg, var(--success-500), var(--success-600));
                color: white;
                border: none;
                border-radius: var(--radius-lg);
                padding: var(--space-3) var(--space-6);
                font-size: var(--font-size-sm);
                font-weight: 600;
                cursor: pointer;
                transition: all var(--transition-fast);
                display: flex;
                align-items: center;
                gap: var(--space-2);
            }
            
            .native-share:hover {
                transform: translateY(-1px);
                box-shadow: var(--shadow-md);
            }
            
            .native-share:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }
            
            /* Share Stats */
            .share-stats {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-3) var(--space-4);
                background: var(--gray-50);
                border-radius: var(--radius-lg);
                margin-bottom: var(--space-4);
                font-size: var(--font-size-sm);
                color: var(--gray-600);
            }
            
            .share-stat {
                display: flex;
                align-items: center;
                gap: var(--space-2);
            }
            
            .share-stat-icon {
                font-size: var(--font-size-base);
            }
            
            /* Custom Message */
            .sharing-message {
                margin-bottom: var(--space-4);
            }
            
            .sharing-message textarea {
                width: 100%;
                padding: var(--space-3) var(--space-4);
                border: 1px solid var(--gray-300);
                border-radius: var(--radius-lg);
                font-size: var(--font-size-sm);
                background: white;
                resize: vertical;
                min-height: 80px;
                font-family: inherit;
            }
            
            .sharing-message textarea:focus {
                outline: none;
                border-color: var(--primary-500);
                box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
            }
            
            .sharing-message textarea::placeholder {
                color: var(--gray-400);
            }
            
            /* Close Button */
            .sharing-close {
                position: absolute;
                top: var(--space-4);
                right: var(--space-4);
                background: none;
                border: none;
                color: var(--gray-400);
                cursor: pointer;
                font-size: var(--font-size-lg);
                padding: var(--space-2);
                border-radius: var(--radius-md);
                transition: all var(--transition-fast);
            }
            
            .sharing-close:hover {
                color: var(--gray-600);
                background: var(--gray-100);
            }
            
            /* Mobile responsive */
            @media (max-width: 768px) {
                .sharing-modal {
                    padding: var(--space-6);
                    margin: var(--space-4);
                }
                
                .sharing-title {
                    font-size: var(--font-size-xl);
                }
                
                .sharing-platforms {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .sharing-actions {
                    flex-direction: column;
                }
                
                .share-button {
                    bottom: var(--space-3);
                    right: var(--space-3);
                    width: 48px;
                    height: 48px;
                    font-size: var(--font-size-base);
                }
            }
            
            /* Animations */
            @keyframes shareBounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            
            .sharing-platform:hover .sharing-platform-icon {
                animation: shareBounce 0.6s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    createSharingUI() {
        // Botão de compartilhamento
        this.shareButton = document.createElement('button');
        this.shareButton.className = 'share-button';
        this.shareButton.innerHTML = '📤';
        this.shareButton.onclick = () => this.showSharingPanel();
        
        // Panel de compartilhamento
        this.sharingPanel = document.createElement('div');
        this.sharingPanel.className = 'sharing-panel';
        this.sharingPanel.innerHTML = `
            <div class="sharing-modal">
                <button class="sharing-close" onclick="socialSharing.hideSharingPanel()">×</button>
                <div class="sharing-header">
                    <h2 class="sharing-title">📤 Compartilhar Estampa</h2>
                    <p class="sharing-description">Compartilhe sua criação com o mundo!</p>
                </div>
                <div class="sharing-preview" id="sharingPreview">
                    <div class="sharing-preview-image" id="sharingPreviewImage">
                        <div class="sharing-preview-placeholder">🎨</div>
                    </div>
                    <div class="sharing-preview-text" id="sharingPreviewText">
                        Criei esta estampa incrível com EstampAI!
                    </div>
                </div>
                <div class="sharing-message">
                    <textarea id="sharingMessage" placeholder="Adicione uma mensagem personalizada...">Criei esta estampa incrível com EstampAI! 🎨✨</textarea>
                </div>
                <div class="sharing-platforms" id="sharingPlatforms">
                    ${this.renderPlatforms()}
                </div>
                <div class="sharing-actions">
                    <button class="native-share" id="nativeShareBtn" onclick="socialSharing.nativeShare()">
                        📱 Compartilhar
                    </button>
                    <button class="sharing-copy" onclick="socialSharing.copyToClipboard()">
                        📋 Copiar Link
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.shareButton);
        document.body.appendChild(this.sharingPanel);
    }
    
    bindEvents() {
        // Fecha o panel ao clicar fora
        document.addEventListener('click', (e) => {
            if (e.target === this.sharingPanel && this.sharingPanel.classList.contains('open')) {
                this.hideSharingPanel();
            }
        });
        
        // ESC para fechar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sharingPanel.classList.contains('open')) {
                this.hideSharingPanel();
            }
        });
        
        // Detecta quando uma estampa é gerada
        this.setupStampDetection();
    }
    
    setupStampDetection() {
        // Observa mudanças no canvas para mostrar o botão de compartilhamento
        const observer = new MutationObserver(() => {
            const canvas = document.getElementById('stampCanvas');
            if (canvas && canvas.width > 0 && canvas.height > 0) {
                this.showShareButton();
            } else {
                this.hideShareButton();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    renderPlatforms() {
        return Object.entries(this.platforms).map(([key, platform]) => `
            <a href="#" class="sharing-platform" data-platform="${key}" onclick="socialSharing.shareToPlatform('${key}')">
                <span class="sharing-platform-icon">${platform.icon}</span>
                <span class="sharing-platform-name">${platform.name}</span>
            </a>
        `).join('');
    }
    
    showSharingPanel() {
        this.updateSharingPreview();
        this.sharingPanel.classList.add('open');
        
        // Verifica se o compartilhamento nativo está disponível
        this.updateNativeShareButton();
    }
    
    hideSharingPanel() {
        this.sharingPanel.classList.remove('open');
    }
    
    updateSharingPreview() {
        const canvas = document.getElementById('stampCanvas');
        const previewImage = document.getElementById('sharingPreviewImage');
        const previewText = document.getElementById('sharingPreviewText');
        
        if (canvas && canvas.width > 0 && canvas.height > 0) {
            // Converte canvas para imagem
            const imageUrl = canvas.toDataURL('image/png');
            previewImage.innerHTML = `<img src="${imageUrl}" alt="Estampa gerada">`;
        } else {
            previewImage.innerHTML = '<div class="sharing-preview-placeholder">🎨</div>';
        }
        
        // Atualiza o texto de preview
        const messageInput = document.getElementById('sharingMessage');
        if (messageInput) {
            previewText.textContent = messageInput.value || 'Criei esta estampa incrível com EstampAI!';
        }
    }
    
    updateNativeShareButton() {
        const nativeShareBtn = document.getElementById('nativeShareBtn');
        if (nativeShareBtn) {
            if (navigator.share) {
                nativeShareBtn.disabled = false;
                nativeShareBtn.innerHTML = '📱 Compartilhar';
            } else {
                nativeShareBtn.disabled = true;
                nativeShareBtn.innerHTML = '❌ Não disponível';
            }
        }
    }
    
    shareToPlatform(platformKey) {
        const platform = this.platforms[platformKey];
        if (!platform) return;
        
        const shareData = this.getShareData();
        let url = '';
        
        switch (platformKey) {
            case 'twitter':
                url = `${platform.url}?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
                break;
            case 'facebook':
                url = `${platform.url}?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.text)}`;
                break;
            case 'whatsapp':
                url = `${platform.url}?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`;
                break;
            case 'telegram':
                url = `${platform.url}?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`;
                break;
            case 'linkedin':
                url = `${platform.url}?url=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}&summary=${encodeURIComponent(shareData.text)}`;
                break;
            case 'pinterest':
                url = `${platform.url}?url=${encodeURIComponent(shareData.url)}&description=${encodeURIComponent(shareData.text)}&media=${encodeURIComponent(shareData.imageUrl)}`;
                break;
            case 'instagram':
                // Instagram não suporta compartilhamento direto via URL
                this.copyToClipboard();
                if (stateManager) {
                    stateManager.showInfoNotification('Instagram', 'Link copiado! Cole no Instagram.');
                }
                return;
        }
        
        if (url) {
            window.open(url, '_blank', 'width=600,height=400');
            this.trackShare(platformKey);
        }
    }
    
    async nativeShare() {
        if (!navigator.share) {
            if (stateManager) {
                stateManager.showErrorNotification('Erro', 'Compartilhamento nativo não disponível');
            }
            return;
        }
        
        const shareData = this.getShareData();
        
        try {
            await navigator.share(shareData);
            this.trackShare('native');
            if (stateManager) {
                stateManager.showSuccessNotification('Compartilhado!', 'Estampa compartilhada com sucesso');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Erro ao compartilhar:', error);
                if (stateManager) {
                    stateManager.showErrorNotification('Erro', 'Falha ao compartilhar');
                }
            }
        }
    }
    
    async copyToClipboard() {
        const shareData = this.getShareData();
        const text = `${shareData.text}\n\n${shareData.url}`;
        
        try {
            await navigator.clipboard.writeText(text);
            this.trackShare('clipboard');
            
            const copyBtn = document.querySelector('.sharing-copy');
            if (copyBtn) {
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '✅ Copiado!';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = '📋 Copiar Link';
                }, 2000);
            }
            
            if (stateManager) {
                stateManager.showSuccessNotification('Copiado!', 'Link copiado para a área de transferência');
            }
        } catch (error) {
            console.error('Erro ao copiar:', error);
            if (stateManager) {
                stateManager.showErrorNotification('Erro', 'Falha ao copiar link');
            }
        }
    }
    
    getShareData() {
        const messageInput = document.getElementById('sharingMessage');
        const text = messageInput ? messageInput.value : 'Criei esta estampa incrível com EstampAI! 🎨✨';
        const url = window.location.href;
        const title = 'Minha estampa criada com EstampAI';
        
        // Tenta obter a imagem do canvas
        let imageUrl = '';
        const canvas = document.getElementById('stampCanvas');
        if (canvas && canvas.width > 0 && canvas.height > 0) {
            imageUrl = canvas.toDataURL('image/png');
        }
        
        return {
            title: title,
            text: text,
            url: url,
            imageUrl: imageUrl
        };
    }
    
    trackShare(platform) {
        // Salva estatísticas de compartilhamento
        const stats = this.getShareStats();
        stats[platform] = (stats[platform] || 0) + 1;
        stats.total = (stats.total || 0) + 1;
        stats.lastShare = new Date().toISOString();
        
        localStorage.setItem('estampai_share_stats', JSON.stringify(stats));
        
        // Atualiza as estatísticas na UI
        this.updateShareStats();
    }
    
    getShareStats() {
        try {
            const stored = localStorage.getItem('estampai_share_stats');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            return {};
        }
    }
    
    updateShareStats() {
        const stats = this.getShareStats();
        const statsElement = document.querySelector('.share-stats');
        
        if (statsElement) {
            statsElement.innerHTML = `
                <div class="share-stat">
                    <span class="share-stat-icon">📤</span>
                    <span>${stats.total || 0} compartilhamentos</span>
                </div>
                <div class="share-stat">
                    <span class="share-stat-icon">📅</span>
                    <span>Último: ${stats.lastShare ? new Date(stats.lastShare).toLocaleDateString('pt-BR') : 'Nunca'}</span>
                </div>
            `;
        }
    }
    
    showShareButton() {
        this.shareButton.classList.add('show');
    }
    
    hideShareButton() {
        this.shareButton.classList.remove('show');
    }
    
    // Método para compartilhar estampa específica
    shareStamp(stampData) {
        const shareData = {
            title: `Minha estampa: ${stampData.title || 'Estampa criada'}`,
            text: stampData.description || 'Criei esta estampa incrível com EstampAI! 🎨✨',
            url: stampData.url || window.location.href,
            imageUrl: stampData.imageUrl || ''
        };
        
        if (navigator.share && navigator.canShare(shareData)) {
            navigator.share(shareData).then(() => {
                this.trackShare('native');
                if (stateManager) {
                    stateManager.showSuccessNotification('Compartilhado!', 'Estampa compartilhada com sucesso');
                }
            }).catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Erro ao compartilhar:', error);
                }
            });
        } else {
            this.showSharingPanel();
        }
    }
}

// Inicializa o sistema de compartilhamento
let socialSharing;
document.addEventListener('DOMContentLoaded', () => {
    socialSharing = new SocialSharing();
});

// Métodos globais
window.shareStamp = (stampData) => socialSharing.shareStamp(stampData);
window.showSharing = () => socialSharing.showSharingPanel();

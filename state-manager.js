/**
 * Sistema de Estados Melhorados - EstampAI
 * Gerencia estados de loading, success, error com feedback visual
 */

class StateManager {
    constructor() {
        this.states = {
            idle: 'idle',
            loading: 'loading',
            success: 'success',
            error: 'error'
        };
        
        this.currentState = this.states.idle;
        this.notifications = [];
        
        this.init();
    }
    
    init() {
        this.createStyles();
        this.createNotificationContainer();
    }
    
    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Loading States */
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(4px);
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .loading-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .loading-content {
                background: white;
                border-radius: var(--radius-2xl);
                padding: var(--space-8);
                text-align: center;
                box-shadow: var(--shadow-xl);
                max-width: 400px;
                width: 90%;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .loading-overlay.active .loading-content {
                transform: scale(1);
            }
            
            .loading-spinner-large {
                width: 60px;
                height: 60px;
                border: 4px solid var(--gray-200);
                border-top: 4px solid var(--primary-500);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto var(--space-4);
            }
            
            .loading-title {
                font-size: var(--font-size-xl);
                font-weight: 600;
                color: var(--gray-900);
                margin-bottom: var(--space-2);
            }
            
            .loading-description {
                font-size: var(--font-size-base);
                color: var(--gray-600);
                margin-bottom: var(--space-4);
            }
            
            .loading-progress {
                width: 100%;
                height: 4px;
                background: var(--gray-200);
                border-radius: var(--radius-full);
                overflow: hidden;
                margin-bottom: var(--space-4);
            }
            
            .loading-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-500), var(--secondary-500));
                border-radius: var(--radius-full);
                width: 0%;
                transition: width 0.3s ease;
            }
            
            .loading-steps {
                display: flex;
                flex-direction: column;
                gap: var(--space-2);
                text-align: left;
            }
            
            .loading-step {
                display: flex;
                align-items: center;
                gap: var(--space-3);
                padding: var(--space-2);
                border-radius: var(--radius-lg);
                transition: all 0.3s ease;
            }
            
            .loading-step.active {
                background: var(--primary-50);
                color: var(--primary-700);
            }
            
            .loading-step.completed {
                background: var(--success-50);
                color: var(--success-700);
            }
            
            .loading-step-icon {
                width: 20px;
                height: 20px;
                border-radius: var(--radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-xs);
                font-weight: 600;
            }
            
            .loading-step.active .loading-step-icon {
                background: var(--primary-500);
                color: white;
                animation: pulse 2s infinite;
            }
            
            .loading-step.completed .loading-step-icon {
                background: var(--success-500);
                color: white;
            }
            
            /* Success States */
            .success-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(16, 185, 129, 0.1);
                backdrop-filter: blur(4px);
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .success-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .success-content {
                background: white;
                border-radius: var(--radius-2xl);
                padding: var(--space-8);
                text-align: center;
                box-shadow: var(--shadow-xl);
                max-width: 400px;
                width: 90%;
                transform: scale(0.9);
                transition: transform 0.3s ease;
                border: 2px solid var(--success-200);
            }
            
            .success-overlay.active .success-content {
                transform: scale(1);
            }
            
            .success-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, var(--success-500), var(--success-600));
                border-radius: var(--radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-3xl);
                margin: 0 auto var(--space-4);
                animation: successBounce 0.6s ease;
            }
            
            @keyframes successBounce {
                0% { transform: scale(0); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            .success-title {
                font-size: var(--font-size-xl);
                font-weight: 600;
                color: var(--success-800);
                margin-bottom: var(--space-2);
            }
            
            .success-description {
                font-size: var(--font-size-base);
                color: var(--success-700);
                margin-bottom: var(--space-6);
            }
            
            .success-actions {
                display: flex;
                gap: var(--space-3);
                justify-content: center;
            }
            
            /* Error States */
            .error-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(239, 68, 68, 0.1);
                backdrop-filter: blur(4px);
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .error-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .error-content {
                background: white;
                border-radius: var(--radius-2xl);
                padding: var(--space-8);
                text-align: center;
                box-shadow: var(--shadow-xl);
                max-width: 400px;
                width: 90%;
                transform: scale(0.9);
                transition: transform 0.3s ease;
                border: 2px solid var(--error-200);
            }
            
            .error-overlay.active .error-content {
                transform: scale(1);
            }
            
            .error-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, var(--error-500), var(--error-600));
                border-radius: var(--radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-3xl);
                margin: 0 auto var(--space-4);
                animation: errorShake 0.6s ease;
            }
            
            @keyframes errorShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .error-title {
                font-size: var(--font-size-xl);
                font-weight: 600;
                color: var(--error-800);
                margin-bottom: var(--space-2);
            }
            
            .error-description {
                font-size: var(--font-size-base);
                color: var(--error-700);
                margin-bottom: var(--space-6);
            }
            
            .error-details {
                background: var(--error-50);
                border: 1px solid var(--error-200);
                border-radius: var(--radius-lg);
                padding: var(--space-3);
                margin-bottom: var(--space-4);
                font-size: var(--font-size-sm);
                color: var(--error-800);
                text-align: left;
                font-family: monospace;
            }
            
            .error-actions {
                display: flex;
                gap: var(--space-3);
                justify-content: center;
            }
            
            /* Notifications */
            .notification-container {
                position: fixed;
                top: var(--space-4);
                right: var(--space-4);
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: var(--space-2);
                max-width: 400px;
                width: 100%;
            }
            
            .notification {
                background: white;
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                box-shadow: var(--shadow-lg);
                border-left: 4px solid;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                display: flex;
                align-items: center;
                gap: var(--space-3);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.success {
                border-left-color: var(--success-500);
            }
            
            .notification.error {
                border-left-color: var(--error-500);
            }
            
            .notification.warning {
                border-left-color: var(--warning-500);
            }
            
            .notification.info {
                border-left-color: var(--primary-500);
            }
            
            .notification-icon {
                width: 32px;
                height: 32px;
                border-radius: var(--radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-lg);
                flex-shrink: 0;
            }
            
            .notification.success .notification-icon {
                background: var(--success-100);
                color: var(--success-600);
            }
            
            .notification.error .notification-icon {
                background: var(--error-100);
                color: var(--error-600);
            }
            
            .notification.warning .notification-icon {
                background: var(--warning-100);
                color: var(--warning-600);
            }
            
            .notification.info .notification-icon {
                background: var(--primary-100);
                color: var(--primary-600);
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-title {
                font-weight: 600;
                color: var(--gray-900);
                margin-bottom: var(--space-1);
            }
            
            .notification-message {
                font-size: var(--font-size-sm);
                color: var(--gray-600);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--gray-400);
                cursor: pointer;
                padding: var(--space-1);
                border-radius: var(--radius-md);
                transition: all var(--transition-fast);
            }
            
            .notification-close:hover {
                color: var(--gray-600);
                background: var(--gray-100);
            }
            
            /* Button States */
            .btn-loading {
                position: relative;
                color: transparent !important;
            }
            
            .btn-loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 20px;
                height: 20px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            .btn-success {
                background: linear-gradient(135deg, var(--success-500), var(--success-600)) !important;
            }
            
            .btn-error {
                background: linear-gradient(135deg, var(--error-500), var(--error-600)) !important;
            }
            
            /* Mobile responsive */
            @media (max-width: 768px) {
                .notification-container {
                    left: var(--space-4);
                    right: var(--space-4);
                    max-width: none;
                }
                
                .loading-content,
                .success-content,
                .error-content {
                    margin: var(--space-4);
                    padding: var(--space-6);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    createNotificationContainer() {
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.className = 'notification-container';
        document.body.appendChild(this.notificationContainer);
    }
    
    // Estados principais
    setLoading(title = 'Carregando...', description = 'Aguarde um momento', steps = []) {
        this.currentState = this.states.loading;
        this.showLoadingOverlay(title, description, steps);
    }
    
    setSuccess(title = 'Sucesso!', description = 'Operação concluída com sucesso', actions = []) {
        this.currentState = this.states.success;
        this.showSuccessOverlay(title, description, actions);
    }
    
    setError(title = 'Erro!', description = 'Algo deu errado', details = '', actions = []) {
        this.currentState = this.states.error;
        this.showErrorOverlay(title, description, details, actions);
    }
    
    setIdle() {
        this.currentState = this.states.idle;
        this.hideAllOverlays();
    }
    
    // Loading overlay
    showLoadingOverlay(title, description, steps = []) {
        this.hideAllOverlays();
        
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner-large"></div>
                <h3 class="loading-title">${title}</h3>
                <p class="loading-description">${description}</p>
                ${steps.length > 0 ? `
                    <div class="loading-progress">
                        <div class="loading-progress-bar" id="loadingProgressBar"></div>
                    </div>
                    <div class="loading-steps" id="loadingSteps">
                        ${steps.map((step, index) => `
                            <div class="loading-step" data-step="${index}">
                                <div class="loading-step-icon">${index + 1}</div>
                                <span>${step}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.classList.add('active');
        }, 100);
        
        this.currentOverlay = overlay;
    }
    
    updateLoadingProgress(stepIndex, progress = null) {
        const progressBar = document.getElementById('loadingProgressBar');
        const steps = document.querySelectorAll('.loading-step');
        
        if (progressBar && progress !== null) {
            progressBar.style.width = `${progress}%`;
        }
        
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            if (index < stepIndex) {
                step.classList.add('completed');
                step.querySelector('.loading-step-icon').textContent = '✓';
            } else if (index === stepIndex) {
                step.classList.add('active');
            }
        });
    }
    
    // Success overlay
    showSuccessOverlay(title, description, actions = []) {
        this.hideAllOverlays();
        
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✓</div>
                <h3 class="success-title">${title}</h3>
                <p class="success-description">${description}</p>
                ${actions.length > 0 ? `
                    <div class="success-actions">
                        ${actions.map(action => `
                            <button class="btn ${action.class || 'btn-primary'}" onclick="${action.onclick}">
                                ${action.text}
                            </button>
                        `).join('')}
                    </div>
                ` : `
                    <button class="btn btn-primary" onclick="stateManager.setIdle()">
                        Continuar
                    </button>
                `}
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.classList.add('active');
        }, 100);
        
        this.currentOverlay = overlay;
    }
    
    // Error overlay
    showErrorOverlay(title, description, details = '', actions = []) {
        this.hideAllOverlays();
        
        const overlay = document.createElement('div');
        overlay.className = 'error-overlay';
        overlay.innerHTML = `
            <div class="error-content">
                <div class="error-icon">✕</div>
                <h3 class="error-title">${title}</h3>
                <p class="error-description">${description}</p>
                ${details ? `<div class="error-details">${details}</div>` : ''}
                ${actions.length > 0 ? `
                    <div class="error-actions">
                        ${actions.map(action => `
                            <button class="btn ${action.class || 'btn-primary'}" onclick="${action.onclick}">
                                ${action.text}
                            </button>
                        `).join('')}
                    </div>
                ` : `
                    <button class="btn btn-primary" onclick="stateManager.setIdle()">
                        Tentar Novamente
                    </button>
                `}
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.classList.add('active');
        }, 100);
        
        this.currentOverlay = overlay;
    }
    
    hideAllOverlays() {
        const overlays = document.querySelectorAll('.loading-overlay, .success-overlay, .error-overlay');
        overlays.forEach(overlay => {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
            }, 300);
        });
    }
    
    // Notifications
    showNotification(type, title, message, duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                ${this.getNotificationIcon(type)}
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        this.notificationContainer.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        if (duration > 0) {
            setTimeout(() => {
                this.hideNotification(notification);
            }, duration);
        }
        
        return notification;
    }
    
    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || 'ℹ';
    }
    
    // Métodos de conveniência
    showSuccessNotification(title, message) {
        return this.showNotification('success', title, message);
    }
    
    showErrorNotification(title, message) {
        return this.showNotification('error', title, message);
    }
    
    showWarningNotification(title, message) {
        return this.showNotification('warning', title, message);
    }
    
    showInfoNotification(title, message) {
        return this.showNotification('info', title, message);
    }
    
    // Estados de botão
    setButtonLoading(button, text = 'Carregando...') {
        button.disabled = true;
        button.classList.add('btn-loading');
        button.dataset.originalText = button.textContent;
        button.textContent = text;
    }
    
    setButtonSuccess(button, text = 'Sucesso!') {
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.classList.add('btn-success');
        button.textContent = text;
        
        setTimeout(() => {
            button.classList.remove('btn-success');
            button.textContent = button.dataset.originalText || 'Enviar';
        }, 2000);
    }
    
    setButtonError(button, text = 'Erro!') {
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.classList.add('btn-error');
        button.textContent = text;
        
        setTimeout(() => {
            button.classList.remove('btn-error');
            button.textContent = button.dataset.originalText || 'Enviar';
        }, 2000);
    }
    
    resetButton(button) {
        button.disabled = false;
        button.classList.remove('btn-loading', 'btn-success', 'btn-error');
        button.textContent = button.dataset.originalText || 'Enviar';
    }
}

// Inicializa o state manager
let stateManager;
document.addEventListener('DOMContentLoaded', () => {
    stateManager = new StateManager();
});

// Métodos globais para uso fácil
window.showLoading = (title, description, steps) => stateManager.setLoading(title, description, steps);
window.showSuccess = (title, description, actions) => stateManager.setSuccess(title, description, actions);
window.showError = (title, description, details, actions) => stateManager.setError(title, description, details, actions);
window.hideStates = () => stateManager.setIdle();
window.showNotification = (type, title, message, duration) => stateManager.showNotification(type, title, message, duration);

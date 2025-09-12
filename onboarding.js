/**
 * Sistema de Onboarding Interativo - EstampAI
 * Guia passo-a-passo para novos usuários
 */

class EstampAIOnboarding {
    constructor() {
        this.currentStep = 0;
        this.steps = [
            {
                id: 'welcome',
                title: '🎨 Bem-vindo ao EstampAI!',
                description: 'Crie estampas incríveis com Inteligência Artificial em segundos.',
                content: `
                    <div class="onboarding-features">
                        <div class="feature-item">
                            <span class="feature-icon">🤖</span>
                            <div>
                                <h4>IA Avançada</h4>
                                <p>GPT-4 + DALL-E 3 para resultados profissionais</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">⚡</span>
                            <div>
                                <h4>Rápido e Fácil</h4>
                                <p>Crie estampas em menos de 30 segundos</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🎨</span>
                            <div>
                                <h4>Design Profissional</h4>
                                <p>Qualidade HD perfeita para impressão</p>
                            </div>
                        </div>
                    </div>
                `,
                target: null,
                position: 'center'
            },
            {
                id: 'chat',
                title: '💬 Como Funciona',
                description: 'Descreva sua ideia e a IA criará sua estampa.',
                content: `
                    <div class="onboarding-demo">
                        <div class="demo-message">
                            <div class="demo-avatar">👤</div>
                            <div class="demo-content">
                                "Uma estampa de gato fofo com estilo minimalista, cores pastel"
                            </div>
                        </div>
                        <div class="demo-arrow">↓</div>
                        <div class="demo-result">
                            <div class="demo-avatar">🤖</div>
                            <div class="demo-content">
                                "Perfeito! Criando sua estampa de gato minimalista..."
                            </div>
                        </div>
                    </div>
                `,
                target: '.chat-section',
                position: 'right'
            },
            {
                id: 'input',
                title: '✍️ Seu Turno',
                description: 'Digite sua ideia de estampa aqui.',
                content: `
                    <div class="onboarding-tips">
                        <h4>💡 Dicas para melhores resultados:</h4>
                        <ul>
                            <li>Seja específico sobre o tema</li>
                            <li>Mencione o estilo (minimalista, vintage, etc.)</li>
                            <li>Inclua preferências de cor</li>
                            <li>Adicione detalhes únicos</li>
                        </ul>
                    </div>
                `,
                target: '.input-field',
                position: 'top'
            },
            {
                id: 'results',
                title: '🎨 Sua Estampa',
                description: 'Aqui aparecerá sua estampa gerada.',
                content: `
                    <div class="onboarding-preview">
                        <div class="preview-stamp">
                            <div class="preview-image">🎨</div>
                            <div class="preview-text">Sua estampa aparecerá aqui</div>
                        </div>
                        <div class="preview-actions">
                            <button class="btn btn-sm btn-outline">👁️ Visualizar</button>
                            <button class="btn btn-sm btn-primary">📥 Baixar</button>
                        </div>
                    </div>
                `,
                target: '.canvas-container',
                position: 'left'
            },
            {
                id: 'complete',
                title: '🚀 Pronto para Começar!',
                description: 'Agora você sabe como usar o EstampAI. Vamos criar sua primeira estampa!',
                content: `
                    <div class="onboarding-complete">
                        <div class="complete-icon">🎉</div>
                        <h3>Você está pronto!</h3>
                        <p>Comece digitando sua primeira ideia de estampa no chat.</p>
                        <div class="complete-features">
                            <span class="badge badge-primary">💾 Favoritos</span>
                            <span class="badge badge-secondary">📱 Compartilhar</span>
                            <span class="badge badge-success">📚 Histórico</span>
                        </div>
                    </div>
                `,
                target: null,
                position: 'center'
            }
        ];
        
        this.isActive = false;
        this.overlay = null;
        this.tooltip = null;
        
        this.init();
    }
    
    init() {
        this.createStyles();
        this.checkFirstVisit();
    }
    
    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Onboarding Overlay */
            .onboarding-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .onboarding-overlay.active {
                opacity: 1;
            }
            
            /* Onboarding Modal */
            .onboarding-modal {
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
            
            .onboarding-overlay.active .onboarding-modal {
                transform: scale(1);
            }
            
            .onboarding-header {
                text-align: center;
                margin-bottom: var(--space-6);
            }
            
            .onboarding-title {
                font-size: var(--font-size-2xl);
                font-weight: 700;
                color: var(--gray-900);
                margin-bottom: var(--space-2);
            }
            
            .onboarding-description {
                font-size: var(--font-size-base);
                color: var(--gray-600);
                margin-bottom: var(--space-4);
            }
            
            .onboarding-content {
                margin-bottom: var(--space-6);
            }
            
            /* Features */
            .onboarding-features {
                display: flex;
                flex-direction: column;
                gap: var(--space-4);
            }
            
            .feature-item {
                display: flex;
                align-items: center;
                gap: var(--space-3);
                padding: var(--space-4);
                background: var(--gray-50);
                border-radius: var(--radius-lg);
            }
            
            .feature-icon {
                font-size: var(--font-size-2xl);
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: white;
                border-radius: var(--radius-full);
                box-shadow: var(--shadow-sm);
            }
            
            .feature-item h4 {
                font-size: var(--font-size-lg);
                font-weight: 600;
                color: var(--gray-900);
                margin-bottom: var(--space-1);
            }
            
            .feature-item p {
                font-size: var(--font-size-sm);
                color: var(--gray-600);
                margin: 0;
            }
            
            /* Demo */
            .onboarding-demo {
                display: flex;
                flex-direction: column;
                gap: var(--space-3);
                align-items: center;
            }
            
            .demo-message, .demo-result {
                display: flex;
                align-items: center;
                gap: var(--space-3);
                padding: var(--space-3);
                background: var(--gray-50);
                border-radius: var(--radius-lg);
                width: 100%;
            }
            
            .demo-avatar {
                width: 32px;
                height: 32px;
                border-radius: var(--radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-sm);
                background: white;
                box-shadow: var(--shadow-sm);
            }
            
            .demo-content {
                flex: 1;
                font-size: var(--font-size-sm);
                color: var(--gray-700);
            }
            
            .demo-arrow {
                font-size: var(--font-size-xl);
                color: var(--primary-500);
                animation: bounce 2s infinite;
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            
            /* Tips */
            .onboarding-tips {
                background: var(--primary-50);
                padding: var(--space-4);
                border-radius: var(--radius-lg);
                border-left: 4px solid var(--primary-500);
            }
            
            .onboarding-tips h4 {
                font-size: var(--font-size-lg);
                font-weight: 600;
                color: var(--primary-800);
                margin-bottom: var(--space-3);
            }
            
            .onboarding-tips ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .onboarding-tips li {
                padding: var(--space-2) 0;
                color: var(--primary-700);
                position: relative;
                padding-left: var(--space-6);
            }
            
            .onboarding-tips li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: var(--primary-500);
                font-weight: 600;
            }
            
            /* Preview */
            .onboarding-preview {
                text-align: center;
            }
            
            .preview-stamp {
                background: var(--gray-50);
                border: 2px dashed var(--gray-300);
                border-radius: var(--radius-lg);
                padding: var(--space-8);
                margin-bottom: var(--space-4);
            }
            
            .preview-image {
                font-size: var(--font-size-4xl);
                margin-bottom: var(--space-2);
            }
            
            .preview-text {
                color: var(--gray-600);
                font-size: var(--font-size-sm);
            }
            
            .preview-actions {
                display: flex;
                gap: var(--space-2);
                justify-content: center;
            }
            
            /* Complete */
            .onboarding-complete {
                text-align: center;
            }
            
            .complete-icon {
                font-size: var(--font-size-4xl);
                margin-bottom: var(--space-4);
                animation: pulse 2s infinite;
            }
            
            .complete-features {
                display: flex;
                gap: var(--space-2);
                justify-content: center;
                margin-top: var(--space-4);
                flex-wrap: wrap;
            }
            
            /* Navigation */
            .onboarding-nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: var(--space-6);
                padding-top: var(--space-4);
                border-top: 1px solid var(--gray-200);
            }
            
            .onboarding-progress {
                display: flex;
                gap: var(--space-2);
            }
            
            .progress-dot {
                width: 8px;
                height: 8px;
                border-radius: var(--radius-full);
                background: var(--gray-300);
                transition: background 0.3s ease;
            }
            
            .progress-dot.active {
                background: var(--primary-500);
            }
            
            .progress-dot.completed {
                background: var(--success-500);
            }
            
            .onboarding-buttons {
                display: flex;
                gap: var(--space-3);
            }
            
            .onboarding-btn {
                padding: var(--space-3) var(--space-6);
                border: none;
                border-radius: var(--radius-lg);
                font-weight: 500;
                cursor: pointer;
                transition: all var(--transition-fast);
            }
            
            .onboarding-btn-secondary {
                background: var(--gray-100);
                color: var(--gray-700);
            }
            
            .onboarding-btn-secondary:hover {
                background: var(--gray-200);
            }
            
            .onboarding-btn-primary {
                background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
                color: white;
            }
            
            .onboarding-btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: var(--shadow-md);
            }
            
            /* Tooltip */
            .onboarding-tooltip {
                position: absolute;
                background: var(--primary-600);
                color: white;
                padding: var(--space-2) var(--space-3);
                border-radius: var(--radius-lg);
                font-size: var(--font-size-sm);
                font-weight: 500;
                z-index: 10000;
                pointer-events: none;
                box-shadow: var(--shadow-lg);
            }
            
            .onboarding-tooltip::after {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border: 6px solid transparent;
            }
            
            .onboarding-tooltip.top::after {
                bottom: -12px;
                left: 50%;
                transform: translateX(-50%);
                border-top-color: var(--primary-600);
            }
            
            .onboarding-tooltip.bottom::after {
                top: -12px;
                left: 50%;
                transform: translateX(-50%);
                border-bottom-color: var(--primary-600);
            }
            
            .onboarding-tooltip.left::after {
                right: -12px;
                top: 50%;
                transform: translateY(-50%);
                border-left-color: var(--primary-600);
            }
            
            .onboarding-tooltip.right::after {
                left: -12px;
                top: 50%;
                transform: translateY(-50%);
                border-right-color: var(--primary-600);
            }
            
            /* Skip button */
            .onboarding-skip {
                position: absolute;
                top: var(--space-4);
                right: var(--space-4);
                background: none;
                border: none;
                color: var(--gray-400);
                cursor: pointer;
                font-size: var(--font-size-sm);
                padding: var(--space-2);
                border-radius: var(--radius-md);
                transition: all var(--transition-fast);
            }
            
            .onboarding-skip:hover {
                color: var(--gray-600);
                background: var(--gray-100);
            }
            
            /* Mobile responsive */
            @media (max-width: 768px) {
                .onboarding-modal {
                    padding: var(--space-6);
                    margin: var(--space-4);
                }
                
                .onboarding-title {
                    font-size: var(--font-size-xl);
                }
                
                .feature-item {
                    flex-direction: column;
                    text-align: center;
                }
                
                .onboarding-buttons {
                    flex-direction: column;
                }
                
                .onboarding-btn {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    checkFirstVisit() {
        const hasVisited = localStorage.getItem('estampai_onboarding_completed');
        if (!hasVisited) {
            // Aguarda o DOM carregar
            setTimeout(() => {
                this.start();
            }, 1000);
        }
    }
    
    start() {
        this.isActive = true;
        this.currentStep = 0;
        this.createOverlay();
        this.showStep();
    }
    
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'onboarding-overlay';
        this.overlay.innerHTML = `
            <div class="onboarding-modal">
                <button class="onboarding-skip" onclick="onboarding.skip()">Pular</button>
                <div class="onboarding-header">
                    <h2 class="onboarding-title" id="onboardingTitle"></h2>
                    <p class="onboarding-description" id="onboardingDescription"></p>
                </div>
                <div class="onboarding-content" id="onboardingContent"></div>
                <div class="onboarding-nav">
                    <div class="onboarding-progress" id="onboardingProgress"></div>
                    <div class="onboarding-buttons">
                        <button class="onboarding-btn onboarding-btn-secondary" id="onboardingPrev" onclick="onboarding.previous()" style="display: none;">Anterior</button>
                        <button class="onboarding-btn onboarding-btn-primary" id="onboardingNext" onclick="onboarding.next()">Próximo</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
        
        // Anima a entrada
        setTimeout(() => {
            this.overlay.classList.add('active');
        }, 100);
    }
    
    showStep() {
        const step = this.steps[this.currentStep];
        
        // Atualiza o conteúdo
        document.getElementById('onboardingTitle').textContent = step.title;
        document.getElementById('onboardingDescription').textContent = step.description;
        document.getElementById('onboardingContent').innerHTML = step.content;
        
        // Atualiza a navegação
        this.updateNavigation();
        
        // Atualiza o progresso
        this.updateProgress();
        
        // Mostra tooltip se necessário
        if (step.target) {
            this.showTooltip(step);
        } else {
            this.hideTooltip();
        }
    }
    
    updateNavigation() {
        const prevBtn = document.getElementById('onboardingPrev');
        const nextBtn = document.getElementById('onboardingNext');
        
        // Botão anterior
        if (this.currentStep === 0) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
        }
        
        // Botão próximo
        if (this.currentStep === this.steps.length - 1) {
            nextBtn.textContent = 'Começar!';
        } else {
            nextBtn.textContent = 'Próximo';
        }
    }
    
    updateProgress() {
        const progress = document.getElementById('onboardingProgress');
        progress.innerHTML = '';
        
        this.steps.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            
            if (index < this.currentStep) {
                dot.classList.add('completed');
            } else if (index === this.currentStep) {
                dot.classList.add('active');
            }
            
            progress.appendChild(dot);
        });
    }
    
    showTooltip(step) {
        const target = document.querySelector(step.target);
        if (!target) return;
        
        this.hideTooltip();
        
        this.tooltip = document.createElement('div');
        this.tooltip.className = `onboarding-tooltip ${step.position}`;
        this.tooltip.textContent = 'Clique aqui para continuar';
        
        document.body.appendChild(this.tooltip);
        
        // Posiciona o tooltip
        const rect = target.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        switch (step.position) {
            case 'top':
                this.tooltip.style.left = rect.left + rect.width / 2 - tooltipRect.width / 2 + 'px';
                this.tooltip.style.top = rect.top - tooltipRect.height - 10 + 'px';
                break;
            case 'bottom':
                this.tooltip.style.left = rect.left + rect.width / 2 - tooltipRect.width / 2 + 'px';
                this.tooltip.style.top = rect.bottom + 10 + 'px';
                break;
            case 'left':
                this.tooltip.style.left = rect.left - tooltipRect.width - 10 + 'px';
                this.tooltip.style.top = rect.top + rect.height / 2 - tooltipRect.height / 2 + 'px';
                break;
            case 'right':
                this.tooltip.style.left = rect.right + 10 + 'px';
                this.tooltip.style.top = rect.top + rect.height / 2 - tooltipRect.height / 2 + 'px';
                break;
        }
        
        // Adiciona highlight ao target
        target.style.position = 'relative';
        target.style.zIndex = '10001';
        target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.3)';
    }
    
    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
        
        // Remove highlight de todos os elementos
        document.querySelectorAll('*').forEach(el => {
            if (el.style.boxShadow && el.style.boxShadow.includes('rgba(14, 165, 233, 0.3)')) {
                el.style.boxShadow = '';
                el.style.zIndex = '';
            }
        });
    }
    
    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.showStep();
        } else {
            this.complete();
        }
    }
    
    previous() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep();
        }
    }
    
    complete() {
        localStorage.setItem('estampai_onboarding_completed', 'true');
        this.close();
        
        // Mostra mensagem de boas-vindas
        this.showWelcomeMessage();
    }
    
    skip() {
        localStorage.setItem('estampai_onboarding_completed', 'true');
        this.close();
    }
    
    close() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            setTimeout(() => {
                this.overlay.remove();
                this.overlay = null;
            }, 300);
        }
        this.hideTooltip();
        this.isActive = false;
    }
    
    showWelcomeMessage() {
        // Cria uma notificação de boas-vindas
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--success-500), var(--success-600));
            color: white;
            padding: var(--space-4) var(--space-6);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--space-2);">
                <span style="font-size: var(--font-size-lg);">🎉</span>
                <div>
                    <div style="font-weight: 600;">Bem-vindo ao EstampAI!</div>
                    <div style="font-size: var(--font-size-sm); opacity: 0.9;">Agora você pode começar a criar!</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Anima a entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove após 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Método para reiniciar o onboarding
    restart() {
        localStorage.removeItem('estampai_onboarding_completed');
        this.start();
    }
}

// Inicializa o onboarding
let onboarding;
document.addEventListener('DOMContentLoaded', () => {
    onboarding = new EstampAIOnboarding();
});

// Adiciona botão para reiniciar onboarding (para desenvolvimento)
if (typeof window !== 'undefined') {
    window.restartOnboarding = () => {
        if (onboarding) {
            onboarding.restart();
        }
    };
}

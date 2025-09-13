/**
 * Sistema de Autenticação - EstampAI
 * Gerencia login, registro, sessões e controle de uso
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.usageData = {
            stampsGenerated: 0,
            dailyLimit: 3,
            planType: 'free',
            lastResetDate: new Date().toDateString()
        };
        
        this.init();
    }
    
    init() {
        // Carrega dados do usuário do localStorage
        this.loadUserData();
        
        // Verifica se precisa resetar limite diário
        this.checkDailyReset();
        
        // Verifica expiração de planos
        this.checkPlanExpiration();
        
        // Atualiza interface baseada no status de autenticação
        this.updateUI();
    }
    
    // ===== GERENCIAMENTO DE USUÁRIO =====
    
    async register(email, password, name) {
        try {
            // Validação básica
            if (!this.validateEmail(email)) {
                throw new Error('Email inválido');
            }
            
            if (password.length < 6) {
                throw new Error('Senha deve ter pelo menos 6 caracteres');
            }
            
            if (!name.trim()) {
                throw new Error('Nome é obrigatório');
            }
            
            // Simula registro (em produção, faria requisição para API)
            const userData = {
                id: this.generateUserId(),
                email: email.toLowerCase(),
                name: name.trim(),
                password: this.hashPassword(password),
                createdAt: new Date().toISOString(),
                planType: 'free',
                usageData: {
                    stampsGenerated: 0,
                    dailyLimit: 3,
                    lastResetDate: new Date().toDateString()
                }
            };
            
            // Salva no localStorage (simulação de banco de dados)
            const users = this.getStoredUsers();
            if (users.find(u => u.email === userData.email)) {
                throw new Error('Email já cadastrado');
            }
            
            users.push(userData);
            localStorage.setItem('estampai_users', JSON.stringify(users));
            
            // Faz login automático após registro
            await this.login(email, password);
            
            // Trackear registro no analytics
            if (window.estampaiAnalytics) {
                window.estampaiAnalytics.trackRegister(email, 'free');
            }
            
            return { success: true, message: 'Conta criada com sucesso!' };
            
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    async login(email, password) {
        try {
            const users = this.getStoredUsers();
            const user = users.find(u => u.email === email.toLowerCase());
            
            if (!user) {
                throw new Error('Email não encontrado');
            }
            
            if (user.password !== this.hashPassword(password)) {
                throw new Error('Senha incorreta');
            }
            
            // Cria sessão
            this.currentUser = {
                id: user.id,
                email: user.email,
                name: user.name,
                planType: user.planType,
                createdAt: user.createdAt
            };
            
            this.usageData = user.usageData || this.usageData;
            this.isAuthenticated = true;
            
            // Salva sessão
            this.saveUserData();
            
            // Atualiza interface
            this.updateUI();
            
            // Trackear login no analytics
            if (window.estampaiAnalytics) {
                window.estampaiAnalytics.trackLogin(email);
            }
            
            return { success: true, message: 'Login realizado com sucesso!' };
            
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.usageData = {
            stampsGenerated: 0,
            dailyLimit: 3,
            planType: 'free',
            lastResetDate: new Date().toDateString()
        };
        
        // Remove dados da sessão
        localStorage.removeItem('estampai_current_user');
        localStorage.removeItem('estampai_usage_data');
        
        // Atualiza interface
        this.updateUI();
        
        // Redireciona para página inicial
        this.showLoginPage();
    }
    
    // ===== CONTROLE DE USO =====
    
    canGenerateStamp() {
        if (!this.isAuthenticated) {
            return { canGenerate: false, reason: 'Usuário não autenticado' };
        }
        
        // Plano Dia Ilimitado - sem limites
        if (this.usageData.planType === 'daily_unlimited') {
            return { canGenerate: true };
        }
        
        // Plano Premium - sem limites
        if (this.usageData.planType === 'premium') {
            return { canGenerate: true };
        }
        
        // Plano Gratuito - verifica limite diário
        if (this.usageData.stampsGenerated >= this.usageData.dailyLimit) {
            return { 
                canGenerate: false, 
                reason: 'Limite diário atingido',
                limit: this.usageData.dailyLimit,
                used: this.usageData.stampsGenerated
            };
        }
        
        return { canGenerate: true };
    }
    
    incrementStampUsage() {
        if (this.isAuthenticated) {
            this.usageData.stampsGenerated++;
            this.saveUserData();
            this.updateUsageDisplay();
        }
    }
    
    checkDailyReset() {
        const today = new Date().toDateString();
        if (this.usageData.lastResetDate !== today) {
            this.usageData.stampsGenerated = 0;
            this.usageData.lastResetDate = today;
            this.saveUserData();
        }
    }
    
    // ===== INTERFACE =====
    
    updateUI() {
        if (this.isAuthenticated) {
            this.showDashboard();
        } else {
            this.showLoginPage();
        }
    }
    
    showLoginPage() {
        // Remove dashboard se existir
        const dashboard = document.getElementById('userDashboard');
        if (dashboard) {
            dashboard.remove();
        }
        
        // Mostra página de login
        const loginPage = document.getElementById('loginPage');
        if (loginPage) {
            loginPage.style.display = 'block';
        }
        
        // Atualiza header
        this.updateHeader();
    }
    
    showDashboard() {
        // Remove página de login se existir
        const loginPage = document.getElementById('loginPage');
        if (loginPage) {
            loginPage.style.display = 'none';
        }
        
        // Cria dashboard se não existir
        if (!document.getElementById('userDashboard')) {
            this.createDashboard();
        }
        
        // Atualiza header
        this.updateHeader();
        
        // Atualiza display de uso
        this.updateUsageDisplay();
    }
    
    updateHeader() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) return;
        
        if (this.isAuthenticated) {
            headerActions.innerHTML = `
                <div class="user-info">
                    <span class="user-name">Olá, ${this.currentUser.name}</span>
                    <span class="user-plan">${this.getPlanDisplayName()}</span>
                </div>
                <button class="btn-header btn-secondary" onclick="authManager.showProfile()">
                    <span>👤</span>
                    <span>Perfil</span>
                </button>
                <button class="btn-header btn-primary" onclick="authManager.logout()">
                    <span>🚪</span>
                    <span>Sair</span>
                </button>
            `;
        } else {
            headerActions.innerHTML = `
                <button class="btn-header btn-secondary" onclick="authManager.showLogin()">
                    <span>🔑</span>
                    <span>Entrar</span>
                </button>
                <button class="btn-header btn-primary" onclick="authManager.showRegister()">
                    <span>📝</span>
                    <span>Registrar</span>
                </button>
            `;
        }
    }
    
    updateUsageDisplay() {
        const usageDisplay = document.getElementById('usageDisplay');
        if (usageDisplay) {
            // Plano Dia Ilimitado ou Premium - sem limites
            if (this.usageData.planType === 'daily_unlimited' || this.usageData.planType === 'premium') {
                usageDisplay.innerHTML = `
                    <div class="usage-info">
                        <div class="usage-stats">
                            <span class="usage-label">Estampas geradas:</span>
                            <span class="usage-count">${this.usageData.stampsGenerated}</span>
                        </div>
                        <div class="usage-progress">
                            <div class="progress-bar" style="width: 100%; background: linear-gradient(90deg, #4CAF50, #8BC34A);"></div>
                        </div>
                        <div class="usage-remaining">
                            ${this.usageData.planType === 'daily_unlimited' ? 'Ilimitado por 24h' : 'Ilimitado'}
                        </div>
                    </div>
                `;
            } else {
                // Plano Gratuito - com limite
                const remaining = this.usageData.dailyLimit - this.usageData.stampsGenerated;
                usageDisplay.innerHTML = `
                    <div class="usage-info">
                        <div class="usage-stats">
                            <span class="usage-label">Estampas hoje:</span>
                            <span class="usage-count">${this.usageData.stampsGenerated}/${this.usageData.dailyLimit}</span>
                        </div>
                        <div class="usage-progress">
                            <div class="progress-bar" style="width: ${(this.usageData.stampsGenerated / this.usageData.dailyLimit) * 100}%"></div>
                        </div>
                        <div class="usage-remaining">
                            ${remaining > 0 ? `${remaining} restantes` : 'Limite atingido'}
                        </div>
                    </div>
                `;
            }
        }
    }
    
    // ===== UTILITÁRIOS =====
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    hashPassword(password) {
        // Hash simples (em produção, usar bcrypt ou similar)
        return btoa(password + 'estampai_salt');
    }
    
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getStoredUsers() {
        const users = localStorage.getItem('estampai_users');
        return users ? JSON.parse(users) : [];
    }
    
    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem('estampai_current_user', JSON.stringify(this.currentUser));
            localStorage.setItem('estampai_usage_data', JSON.stringify(this.usageData));
        }
    }
    
    loadUserData() {
        const userData = localStorage.getItem('estampai_current_user');
        const usageData = localStorage.getItem('estampai_usage_data');
        
        if (userData && usageData) {
            this.currentUser = JSON.parse(userData);
            this.usageData = JSON.parse(usageData);
            this.isAuthenticated = true;
        }
    }
    
    getPlanDisplayName() {
        const plans = {
            'free': 'Gratuito',
            'daily_unlimited': 'Dia Ilimitado',
            'premium': 'Premium'
        };
        return plans[this.usageData.planType] || 'Gratuito';
    }
    
    // ===== MÉTODOS PÚBLICOS =====
    
    showLogin() {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
    }
    
    showRegister() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    }
    
    showProfile() {
        // Implementar página de perfil
        console.log('Mostrar perfil do usuário');
    }
    
    createDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'userDashboard';
        dashboard.className = 'user-dashboard';
        dashboard.innerHTML = `
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <div class="welcome-section">
                        <h1>Bem-vindo de volta, ${this.currentUser.name}!</h1>
                        <p>Gerencie sua conta e crie estampas incríveis</p>
                    </div>
                </div>
                
                <div class="dashboard-grid">
                    <!-- Card de Uso Diário -->
                    <div class="dashboard-card usage-card">
                        <div class="card-header">
                            <div class="card-icon">📊</div>
                            <h3>Uso Diário</h3>
                        </div>
                        <div class="card-content">
                            <div id="usageDisplay"></div>
                        </div>
                    </div>
                    
                    <!-- Card de Plano -->
                    <div class="dashboard-card plan-card">
                        <div class="card-header">
                            <div class="card-icon">💎</div>
                            <h3>Seu Plano</h3>
                        </div>
                        <div class="card-content">
                            <div class="plan-info">
                                <div class="plan-badge ${this.usageData.planType}">
                                    ${this.getPlanDisplayName()}
                                </div>
                                ${this.usageData.planType === 'free' ? `
                                    <div class="upgrade-section">
                                        <p class="upgrade-text">Desbloqueie estampas ilimitadas</p>
                                        <div class="upgrade-buttons">
                                            <button class="upgrade-btn daily" onclick="authManager.upgradeToDailyUnlimited()">
                                                <span class="btn-icon">⚡</span>
                                                <span class="btn-text">
                                                    <strong>Dia Ilimitado</strong>
                                                    <small>R$ 9,90</small>
                                                </span>
                                            </button>
                                            <button class="upgrade-btn premium" onclick="authManager.upgradeToPremium()">
                                                <span class="btn-icon">👑</span>
                                                <span class="btn-text">
                                                    <strong>Premium</strong>
                                                    <small>R$ 29,90/mês</small>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                ` : `
                                    <div class="plan-details">
                                        <div class="plan-price">
                                            ${this.usageData.planType === 'daily_unlimited' ? 'R$ 9,90/dia' : 'R$ 29,90/mês'}
                                        </div>
                                        ${this.usageData.expiresAt ? `
                                            <div class="plan-expires">
                                                Expira em: ${new Date(this.usageData.expiresAt).toLocaleDateString()}
                                            </div>
                                        ` : ''}
                                        <button class="manage-btn" onclick="authManager.showUpgrade()">
                                            <span>⚙️</span>
                                            Gerenciar Assinatura
                                        </button>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Card de Estatísticas -->
                    <div class="dashboard-card stats-card">
                        <div class="card-header">
                            <div class="card-icon">📈</div>
                            <h3>Estatísticas</h3>
                        </div>
                        <div class="card-content">
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <div class="stat-icon">🎨</div>
                                    <div class="stat-info">
                                        <span class="stat-number">${this.usageData.stampsGenerated}</span>
                                        <span class="stat-label">Estampas</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">⏱️</div>
                                    <div class="stat-info">
                                        <span class="stat-number">${this.getSessionDuration()}</span>
                                        <span class="stat-label">Min Online</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">📅</div>
                                    <div class="stat-info">
                                        <span class="stat-number">${this.getDaysSinceRegistration()}</span>
                                        <span class="stat-label">Dias</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">🎯</div>
                                    <div class="stat-info">
                                        <span class="stat-number">${this.usageData.planType === 'free' ? this.usageData.dailyLimit : '∞'}</span>
                                        <span class="stat-label">Limite</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insere o dashboard antes do main
        const main = document.querySelector('.main');
        if (main) {
            main.parentNode.insertBefore(dashboard, main);
        }
    }
    
    showUpgrade() {
        // Mostra modal de gerenciamento de assinatura
        this.showSubscriptionModal();
    }
    
    showSubscriptionModal() {
        const modal = document.createElement('div');
        modal.id = 'subscriptionModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Gerenciar Assinatura</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="current-plan">
                        <h4>Plano Atual</h4>
                        <div class="plan-details">
                            <span class="plan-name">${this.getPlanDisplayName()}</span>
                            ${this.usageData.planType !== 'free' ? `
                                <span class="plan-price">
                                    ${this.usageData.planType === 'daily_unlimited' ? 'R$ 9,90/dia' : 'R$ 29,90/mês'}
                                </span>
                                <span class="plan-expires">
                                    ${this.usageData.expiresAt ? `Expira em: ${new Date(this.usageData.expiresAt).toLocaleDateString()}` : 'Sem expiração'}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="upgrade-options">
                        <h4>Upgrade de Plano</h4>
                        <div class="plan-options">
                            <div class="plan-option">
                                <h5>Dia Ilimitado</h5>
                                <p class="price">R$ 9,90</p>
                                <p class="description">Estampas ilimitadas por 24 horas</p>
                                <button class="btn-upgrade" onclick="authManager.showUpgradeConfirmation('daily_unlimited', 'Dia Ilimitado', 9.90); this.closest('.modal-overlay').remove();">
                                    Comprar Agora
                                </button>
                            </div>
                            <div class="plan-option">
                                <h5>Premium</h5>
                                <p class="price">R$ 29,90/mês</p>
                                <p class="description">Estampas ilimitadas por 30 dias</p>
                                <button class="btn-upgrade" onclick="authManager.showUpgradeConfirmation('premium', 'Premium', 29.90); this.closest('.modal-overlay').remove();">
                                    Comprar Agora
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    ${this.usageData.planType !== 'free' ? `
                        <div class="cancel-option">
                            <h4>Cancelar Assinatura</h4>
                            <p>Você pode cancelar sua assinatura a qualquer momento.</p>
                            <button class="btn-cancel" onclick="authManager.cancelSubscription(); this.closest('.modal-overlay').remove();">
                                Cancelar Assinatura
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Adicionar CSS se não existir
        if (!document.getElementById('subscriptionModalCSS')) {
            const style = document.createElement('style');
            style.id = 'subscriptionModalCSS';
            style.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }
                
                .modal-content {
                    background: #1a1a1a;
                    border-radius: 1rem;
                    padding: 0;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    border: 1px solid #333;
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #333;
                }
                
                .modal-header h3 {
                    margin: 0;
                    color: #fff;
                }
                
                .modal-close {
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .modal-body {
                    padding: 1.5rem;
                }
                
                .current-plan, .upgrade-options, .cancel-option {
                    margin-bottom: 2rem;
                }
                
                .current-plan h4, .upgrade-options h4, .cancel-option h4 {
                    color: #fff;
                    margin-bottom: 1rem;
                }
                
                .plan-details {
                    background: #2a2a2a;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    border: 1px solid #333;
                }
                
                .plan-name {
                    display: block;
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #4CAF50;
                    margin-bottom: 0.5rem;
                }
                
                .plan-price {
                    display: block;
                    font-size: 1.1rem;
                    color: #fff;
                    margin-bottom: 0.5rem;
                }
                
                .plan-expires {
                    display: block;
                    font-size: 0.9rem;
                    color: #ccc;
                }
                
                .plan-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                
                .plan-option {
                    background: #2a2a2a;
                    padding: 1.5rem;
                    border-radius: 0.5rem;
                    border: 1px solid #333;
                    text-align: center;
                }
                
                .plan-option h5 {
                    color: #fff;
                    margin-bottom: 0.5rem;
                }
                
                .plan-option .price {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #4CAF50;
                    margin-bottom: 0.5rem;
                }
                
                .plan-option .description {
                    color: #ccc;
                    font-size: 0.9rem;
                    margin-bottom: 1rem;
                }
                
                .btn-upgrade {
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 600;
                    width: 100%;
                }
                
                .btn-upgrade:hover {
                    background: #45a049;
                }
                
                .btn-cancel {
                    background: #f44336;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 600;
                }
                
                .btn-cancel:hover {
                    background: #da190b;
                }
                
                @media (max-width: 768px) {
                    .plan-options {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    cancelSubscription() {
        if (confirm('Tem certeza que deseja cancelar sua assinatura? Você voltará para o plano gratuito.')) {
            // Volta para plano gratuito
            this.usageData.planType = 'free';
            this.usageData.dailyLimit = 3;
            this.usageData.stampsGenerated = 0;
            this.usageData.expiresAt = null;
            this.usageData.purchaseDate = null;
            
            this.saveUserData();
            this.updateUsageDisplay();
            this.updateHeader();
            
            this.showMessage('Assinatura cancelada. Voltou para o plano gratuito.', 'success');
        }
    }
    
    // ===== FUNÇÕES AUXILIARES =====
    
    getSessionDuration() {
        if (!this.usageData.sessionStart) {
            this.usageData.sessionStart = Date.now();
            this.saveUserData();
        }
        const duration = Math.floor((Date.now() - this.usageData.sessionStart) / (1000 * 60));
        return duration;
    }
    
    getDaysSinceRegistration() {
        if (!this.currentUser || !this.currentUser.createdAt) {
            return 0;
        }
        const registrationDate = new Date(this.currentUser.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - registrationDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    
    showUpgradeLoading(planName) {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'upgradeLoading';
        loadingOverlay.className = 'upgrade-loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="upgrade-loading-content">
                <div class="loading-spinner"></div>
                <h3>Processando ${planName}...</h3>
                <p>Aguarde enquanto processamos seu upgrade</p>
            </div>
        `;
        
        // Adicionar CSS se não existir
        if (!document.getElementById('upgradeLoadingCSS')) {
            const style = document.createElement('style');
            style.id = 'upgradeLoadingCSS';
            style.textContent = `
                .upgrade-loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }
                
                .upgrade-loading-content {
                    text-align: center;
                    color: white;
                }
                
                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid #333;
                    border-top: 4px solid #4CAF50;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .upgrade-loading-content h3 {
                    margin: 0 0 10px 0;
                    font-size: 1.5rem;
                }
                
                .upgrade-loading-content p {
                    margin: 0;
                    color: #ccc;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(loadingOverlay);
    }
    
    hideUpgradeLoading() {
        const loadingOverlay = document.getElementById('upgradeLoading');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }
    
    showUpgradeConfirmation(planType, planName, price) {
        console.log(`showUpgradeConfirmation chamado: ${planType} - ${planName} - R$ ${price}`);
        
        const modal = document.createElement('div');
        modal.id = 'upgradeConfirmation';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Confirmar Upgrade</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="confirmation-content">
                        <div class="plan-icon">
                            ${planType === 'daily_unlimited' ? '⚡' : '👑'}
                        </div>
                        <h4>Upgrade para ${planName}</h4>
                        <p class="plan-description">
                            ${planType === 'daily_unlimited' 
                                ? 'Estampas ilimitadas por 24 horas' 
                                : 'Estampas ilimitadas por 30 dias'
                            }
                        </p>
                        <div class="price-display">
                            <span class="price">R$ ${price.toFixed(2).replace('.', ',')}</span>
                            <span class="period">${planType === 'daily_unlimited' ? 'por dia' : 'por mês'}</span>
                        </div>
                        <div class="features-list">
                            <div class="feature">✅ Estampas ilimitadas</div>
                            <div class="feature">✅ Chat com IA avançado</div>
                            <div class="feature">✅ Download em múltiplos formatos</div>
                            <div class="feature">✅ Suporte prioritário</div>
                        </div>
                        <div class="payment-info">
                            <div class="payment-method">
                                <span class="payment-icon">💳</span>
                                <span class="payment-text">Pagamento seguro via Stripe</span>
                            </div>
                            <div class="payment-note">
                                Você será redirecionado para uma página segura de pagamento
                            </div>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-cancel" onclick="this.closest('.modal-overlay').remove()">
                            Cancelar
                        </button>
                        <button class="btn-confirm" onclick="authManager.confirmUpgrade('${planType}', '${planName}'); document.getElementById('upgradeConfirmation').remove();">
                            Confirmar Compra
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar CSS se não existir
        if (!document.getElementById('upgradeConfirmationCSS')) {
            const style = document.createElement('style');
            style.id = 'upgradeConfirmationCSS';
            style.textContent = `
                .confirmation-content {
                    text-align: center;
                    padding: 2rem 0;
                }
                
                .plan-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                
                .confirmation-content h4 {
                    color: #fff;
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                }
                
                .plan-description {
                    color: #ccc;
                    margin-bottom: 1.5rem;
                }
                
                .price-display {
                    background: #2a2a2a;
                    padding: 1.5rem;
                    border-radius: 1rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid #333;
                }
                
                .price {
                    display: block;
                    font-size: 2rem;
                    font-weight: 700;
                    color: #4CAF50;
                    margin-bottom: 0.5rem;
                }
                
                .period {
                    color: #ccc;
                    font-size: 0.9rem;
                }
                
                .features-list {
                    text-align: left;
                    margin-bottom: 2rem;
                }
                
                .feature {
                    color: #ccc;
                    margin-bottom: 0.5rem;
                    padding: 0.5rem 0;
                }
                
                .modal-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                
                .btn-cancel {
                    background: #333;
                    color: #fff;
                    border: none;
                    padding: 0.75rem 2rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 500;
                }
                
                .btn-cancel:hover {
                    background: #444;
                }
                
                .btn-confirm {
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 0.75rem 2rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 600;
                }
                
                .btn-confirm:hover {
                    background: #45a049;
                }
                
                .payment-info {
                    background: #2a2a2a;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid #333;
                }
                
                .payment-method {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                
                .payment-icon {
                    font-size: 1.2rem;
                }
                
                .payment-text {
                    color: #4CAF50;
                    font-weight: 600;
                }
                
                .payment-note {
                    color: #ccc;
                    font-size: 0.9rem;
                    text-align: center;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(modal);
    }
    
    confirmUpgrade(planType, planName) {
        console.log(`confirmUpgrade chamado: ${planType} - ${planName}`);
        
        // Trackear clique em upgrade
        if (window.estampaiAnalytics) {
            try {
                window.estampaiAnalytics.trackUpgradeClick(planType, planType === 'daily_unlimited' ? 9.90 : 29.90);
            } catch (error) {
                console.log('Erro ao trackear upgrade:', error);
            }
        }
        
        // Verificar se temos chaves reais do Stripe
        if (window.STRIPE_KEYS && window.STRIPE_KEYS.mode === 'live' && window.STRIPE_KEYS.publishableKey.startsWith('pk_live_')) {
            console.log('Usando Stripe real para checkout');
            this.processRealPayment(planType, planName);
        } else {
            console.log('Usando simulação de pagamento');
            this.processSimulatedPayment(planType, planName);
        }
    }
    
    processRealPayment(planType, planName) {
        // Mostra loading
        this.showUpgradeLoading(planName);
        
        // Criar sessão de checkout do Stripe
        this.createStripeCheckoutSession(planType)
            .then(session => {
                console.log('Sessão de checkout criada:', session);
                this.hideUpgradeLoading();
                
                // Redirecionar para checkout do Stripe
                if (window.stripe && session.id) {
                    window.stripe.redirectToCheckout({
                        sessionId: session.id
                    }).then(result => {
                        if (result.error) {
                            console.error('Erro no checkout:', result.error);
                            this.showMessage('Erro no checkout: ' + result.error.message, 'error');
                        }
                    });
                } else {
                    // Fallback para simulação se Stripe não estiver disponível
                    this.processSimulatedPayment(planType, planName);
                }
            })
            .catch(error => {
                console.error('Erro ao criar sessão de checkout:', error);
                this.hideUpgradeLoading();
                this.showMessage('Erro ao processar pagamento. Tentando simulação...', 'error');
                this.processSimulatedPayment(planType, planName);
            });
    }
    
    processSimulatedPayment(planType, planName) {
        // Mostra loading
        this.showUpgradeLoading(planName);
        
        // Simula delay e ativa o plano
        setTimeout(() => {
            console.log(`Processando upgrade simulado: ${planType}`);
            if (planType === 'daily_unlimited') {
                this.simulateUpgradeToDailyUnlimited();
            } else {
                this.simulateUpgradeToPremium();
            }
            this.hideUpgradeLoading();
        }, 2000);
    }
    
    async createStripeCheckoutSession(planType) {
        const priceId = planType === 'daily_unlimited' ? 'price_daily_unlimited' : 'price_premium';
        const amount = planType === 'daily_unlimited' ? 990 : 2990; // em centavos
        
        try {
            // Tentar usar API real do Stripe
            if (window.stripeAPI && window.stripeAPI.createCheckoutSession) {
                return await window.stripeAPI.createCheckoutSession(
                    planType,
                    `${window.location.origin}/chat.html?payment=success`,
                    `${window.location.origin}/landing.html?payment=cancelled`
                );
            } else {
                // Fallback para simulação
                throw new Error('API do Stripe não disponível');
            }
        } catch (error) {
            console.error('Erro ao criar sessão de checkout:', error);
            throw error;
        }
    }
    
    // ===== FUNÇÕES DE PLANOS =====
    
    upgradeToDailyUnlimited() {
        console.log('upgradeToDailyUnlimited chamado - APENAS MOSTRANDO CONFIRMAÇÃO');
        
        if (!this.isAuthenticated) {
            this.showMessage('Você precisa fazer login primeiro', 'error');
            return;
        }
        
        // Mostra modal de confirmação
        this.showUpgradeConfirmation('daily_unlimited', 'Dia Ilimitado', 9.90);
    }
    
    simulateUpgradeToDailyUnlimited() {
        // Simula compra do plano Dia Ilimitado
        this.usageData.planType = 'daily_unlimited';
        this.usageData.dailyLimit = 999999; // Praticamente ilimitado
        this.usageData.stampsGenerated = 0; // Reset contador
        this.usageData.purchaseDate = new Date().toISOString();
        this.usageData.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h
        
        this.saveUserData();
        this.updateUsageDisplay();
        this.updateHeader();
        
        // Trackear sucesso do pagamento
        if (window.estampaiAnalytics) {
            window.estampaiAnalytics.trackPaymentSuccess('daily_unlimited', 9.90, 'sim_' + Date.now());
        }
        
        this.showMessage('Plano Dia Ilimitado ativado! Válido por 24 horas.', 'success');
    }
    
    upgradeToPremium() {
        console.log('upgradeToPremium chamado - APENAS MOSTRANDO CONFIRMAÇÃO');
        
        if (!this.isAuthenticated) {
            this.showMessage('Você precisa fazer login primeiro', 'error');
            return;
        }
        
        // Mostra modal de confirmação
        this.showUpgradeConfirmation('premium', 'Premium', 29.90);
    }
    
    simulateUpgradeToPremium() {
        // Simula compra do plano Premium
        this.usageData.planType = 'premium';
        this.usageData.dailyLimit = 999999; // Praticamente ilimitado
        this.usageData.stampsGenerated = 0; // Reset contador
        this.usageData.purchaseDate = new Date().toISOString();
        this.usageData.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 dias
        
        this.saveUserData();
        this.updateUsageDisplay();
        this.updateHeader();
        
        // Trackear sucesso do pagamento
        if (window.estampaiAnalytics) {
            window.estampaiAnalytics.trackPaymentSuccess('premium', 29.90, 'sim_' + Date.now());
        }
        
        this.showMessage('Plano Premium ativado! Válido por 30 dias.', 'success');
    }
    
    checkPlanExpiration() {
        if (this.usageData.expiresAt) {
            const now = new Date();
            const expiresAt = new Date(this.usageData.expiresAt);
            
            if (now > expiresAt) {
                // Plano expirado - volta para gratuito
                this.usageData.planType = 'free';
                this.usageData.dailyLimit = 3;
                this.usageData.stampsGenerated = 0;
                this.usageData.expiresAt = null;
                this.usageData.purchaseDate = null;
                
                this.saveUserData();
                this.updateUsageDisplay();
                this.updateHeader();
                
                this.showMessage('Seu plano expirou. Voltou para o plano gratuito.', 'error');
            }
        }
    }
    
    // Função para processar pagamento confirmado
    processPaymentConfirmation(planType, sessionId) {
        console.log(`Processando confirmação de pagamento: ${planType} - ${sessionId}`);
        
        if (planType === 'daily_unlimited') {
            this.simulateUpgradeToDailyUnlimited();
        } else if (planType === 'premium') {
            this.simulateUpgradeToPremium();
        }
        
        // Salva informações da transação
        this.usageData.lastTransaction = {
            sessionId: sessionId,
            planType: planType,
            timestamp: new Date().toISOString()
        };
        
        this.saveUserData();
    }
    
    // ===== TRATAMENTO DE FORMULÁRIOS =====
    
    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const result = await this.login(email, password);
        this.showMessage(result.message, result.success ? 'success' : 'error');
        
        if (result.success) {
            // Limpa formulário
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
        }
    }
    
    async handleRegister(event) {
        event.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        // Validação de senha
        if (password !== confirmPassword) {
            this.showMessage('As senhas não coincidem', 'error');
            return;
        }
        
        const result = await this.register(email, password, name);
        this.showMessage(result.message, result.success ? 'success' : 'error');
        
        if (result.success) {
            // Limpa formulário
            document.getElementById('registerName').value = '';
            document.getElementById('registerEmail').value = '';
            document.getElementById('registerPassword').value = '';
            document.getElementById('registerConfirmPassword').value = '';
        }
    }
    
    showMessage(message, type) {
        const messageEl = document.getElementById('authMessage');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `auth-message ${type}`;
            messageEl.style.display = 'block';
            
            // Esconde mensagem após 5 segundos
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }
    }
}

// Instância global
window.authManager = new AuthManager();

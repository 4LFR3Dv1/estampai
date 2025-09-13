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
        
        // Verifica limite diário
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
            'premium': 'Premium',
            'pro': 'Pro'
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
            <div class="dashboard-header">
                <h2>Dashboard</h2>
                <p>Bem-vindo de volta, ${this.currentUser.name}!</p>
            </div>
            
            <div class="dashboard-content">
                <div class="usage-card">
                    <h3>Uso Diário</h3>
                    <div id="usageDisplay"></div>
                </div>
                
                <div class="plan-card">
                    <h3>Seu Plano</h3>
                    <div class="plan-info">
                        <span class="plan-name">${this.getPlanDisplayName()}</span>
                        <button class="upgrade-btn" onclick="authManager.showUpgrade()">
                            Upgrade
                        </button>
                    </div>
                </div>
                
                <div class="stats-card">
                    <h3>Estatísticas</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-number">${this.usageData.stampsGenerated}</span>
                            <span class="stat-label">Estampas Geradas</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${this.usageData.dailyLimit}</span>
                            <span class="stat-label">Limite Diário</span>
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
        // Implementar página de upgrade
        console.log('Mostrar opções de upgrade');
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

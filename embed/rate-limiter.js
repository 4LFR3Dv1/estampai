/**
 * Sistema de Rate Limiting para EstampAI
 * Controla uso por usuário e previne abuso
 */

class RateLimiter {
    constructor() {
        this.limits = {
            chat: { max: 20, window: 60000 }, // 20 mensagens por minuto
            stamp: { max: 5, window: 300000 }, // 5 estampas por 5 minutos
            daily: { max: 50, window: 86400000 } // 50 estampas por dia
        };
        
        this.users = new Map();
        this.cleanupInterval = 300000; // 5 minutos
        this.startCleanup();
    }

    // Verifica se usuário pode fazer ação
    canProceed(userId, action = 'chat') {
        const now = Date.now();
        const userData = this.getUserData(userId);
        const limit = this.limits[action];

        if (!userData[action]) {
            userData[action] = [];
        }

        // Remove requests antigas
        userData[action] = userData[action].filter(
            timestamp => now - timestamp < limit.window
        );

        // Verifica limite
        if (userData[action].length >= limit.max) {
            return {
                allowed: false,
                resetTime: userData[action][0] + limit.window,
                remaining: 0
            };
        }

        // Adiciona request atual
        userData[action].push(now);
        this.users.set(userId, userData);

        return {
            allowed: true,
            remaining: limit.max - userData[action].length,
            resetTime: now + limit.window
        };
    }

    // Obtém dados do usuário
    getUserData(userId) {
        if (!this.users.has(userId)) {
            this.users.set(userId, {});
        }
        return this.users.get(userId);
    }

    // Gera ID único para usuário
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    // Limpa dados antigos
    startCleanup() {
        setInterval(() => {
            const now = Date.now();
            const maxWindow = Math.max(...Object.values(this.limits).map(l => l.window));
            
            for (const [userId, userData] of this.users.entries()) {
                let hasData = false;
                
                for (const [action, timestamps] of Object.entries(userData)) {
                    const limit = this.limits[action];
                    const validTimestamps = timestamps.filter(
                        ts => now - ts < limit.window
                    );
                    
                    if (validTimestamps.length > 0) {
                        userData[action] = validTimestamps;
                        hasData = true;
                    } else {
                        delete userData[action];
                    }
                }
                
                if (!hasData) {
                    this.users.delete(userId);
                }
            }
            
            console.log(`🧹 Rate limiter cleanup: ${this.users.size} usuários ativos`);
        }, this.cleanupInterval);
    }

    // Obtém estatísticas
    getStats() {
        const now = Date.now();
        const stats = {
            totalUsers: this.users.size,
            activeUsers: 0,
            requestsByAction: {}
        };

        for (const [action] of Object.keys(this.limits)) {
            stats.requestsByAction[action] = 0;
        }

        for (const [userId, userData] of this.users.entries()) {
            let isActive = false;
            
            for (const [action, timestamps] of Object.entries(userData)) {
                const limit = this.limits[action];
                const validTimestamps = timestamps.filter(
                    ts => now - ts < limit.window
                );
                
                if (validTimestamps.length > 0) {
                    stats.requestsByAction[action] += validTimestamps.length;
                    isActive = true;
                }
            }
            
            if (isActive) {
                stats.activeUsers++;
            }
        }

        return stats;
    }
}

// Instância global
window.rateLimiter = new RateLimiter();

export default RateLimiter;
